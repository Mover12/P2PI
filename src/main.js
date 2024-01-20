import Vector from './class/Vector.js'
import Chunk from './class/Chunk.js'


var cnv = document.getElementById("cnv");
var cnv2d = cnv.getContext("2d");

var chunks = new Map();
var chunksQueue = new Array();

var camera = new Vector(0, 0);
var prevCamera = new Vector(0, 0);
var scale = new Vector(1, 1);

const cellCount = 64;
const cellPSize = 10;
const chunkPSize = cellCount * cellPSize;

const renderDistance = 1;
const chunksCashSize= 128;

const zoomSpeed = 0.1;
const zoomMaximum = 10;


function generateChunk(pos) {
    var chunk = chunks.get(pos.stringify());
    
    if (chunk == null) {
        chunk = downloadChunk(pos.stringify());
        chunksQueue.push(pos);
        chunks.set(pos.stringify(), chunk);
        if (chunksQueue.length > chunksCashSize) {
            let pos = chunksQueue.shift();
            uploadChunk(pos, chunks.get(pos.stringify()));
            chunks.delete(pos.stringify());
      }
    }
}

function generateNearChunks(pos) {
    for (let i = pos.y - renderDistance; i <= pos.y + renderDistance; i++) {
      for (let j = pos.x - renderDistance; j <= pos.x + renderDistance; j++) {
        generateChunk(new Vector(j, i));
      }
    }
  }

function uploadChunk(pos, chunk) {
    fetch("/upload", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [pos] : chunk })
    });
}
  
function downloadChunk(pos) {
    var chunk = new Chunk(cellCount);
    fetch("/download", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pos })
    }).then(function(res) {
        return res.json()
    }).then(function(data) {
        if (Object.keys(data)[0] != 'ERROR') {
            chunk.cellCount = data[Object.keys(data)]['cellCount']
            chunk.cells = data[Object.keys(data)]['cells']
        }
    });
    return chunk;
}
  
function renderChunks(chunksQueue) {
    chunksQueue.forEach(chunkPos => {
        for (let i = 0; i < cellCount; i++) {
            for (let j = 0; j < cellCount; j++) {
                var cell = chunks.get(chunkPos.stringify()).cells[i][j];
                var cellColor = '#000000';
                if (cell == 0) {
                    cellColor = '#FFFFFF';
                }
                else if (cell == 1) {
                    cellColor = '#FF4040';
                }
                var cellPos = convertC2Mo(new Vector(
                    j * cellPSize + chunkPos.x * chunkPSize, 
                    i * cellPSize + chunkPos.y * chunkPSize
                ));
                if ((-cellPSize * scale.x <= cellPos.x && cellPos.x <= cnv2d.canvas.width) && (-cellPSize * scale.y <= cellPos.y && cellPos.y <= cnv2d.canvas.height)) {
                    cnv2d.fillStyle = cellColor;
                    cnv2d.fillRect(cellPos.x, cellPos.y, cellPSize * scale.x, cellPSize * scale.y);
                }
            }
        }
    });
}

function mousePress(event) {
    if (event.buttons == 4) {
        prevCamera.set(event.offsetX, event.offsetY);
    }
    document.addEventListener('mousemove', mouseMove)
}

function mouseRelease() {
    document.removeEventListener('mousemove', mouseMove);
}

function mouseMove(event) {
    if (event.buttons == 4) {
        camera.x = camera.x - (event.offsetX - prevCamera.x) / scale.x;
        camera.y = camera.y - (event.offsetY - prevCamera.y) / scale.y;
        prevCamera.set(event.offsetX, event.offsetY);
    } else {
        var chunkPos = convertM2Ch(convertM2Ca(new Vector(event.offsetX, event.offsetY)));
        var cellPos = convertM2Ce(convertM2Ca(new Vector(event.offsetX, event.offsetY)));
        const chunk = chunks.get(chunkPos.stringify());
        if (chunk != null) {
            if (event.buttons == 1) {
                chunk.cells[cellPos.y][cellPos.x] = 1;
            }
            else if (event.buttons == 2) {
                chunk.cells[cellPos.y][cellPos.x] = 0;
            }
        }
    }
}

function keyPress(event) {
    console.log(event);
    if (event.code == 'KeyS') {
        chunks.keys().forEach((chunkPos) => {
            uploadChunk(chunkPos, chunks.get(chunkPos));
        })
    }
}

function wheel(event) {
    var cameraBefore = convertM2Ca(new Vector(event.offsetX, event.offsetY));
    if (event.deltaY < 0) {
        if (Math.floor(scale.x) < zoomMaximum && Math.floor(scale.y) < zoomMaximum) {
            scale = scale.add(new Vector(zoomSpeed, zoomSpeed));
        }
    } else {
        if (Math.floor(scale.x) > zoomSpeed && Math.floor(scale.y) > zoomSpeed) {
            scale = scale.sub(new Vector(zoomSpeed, zoomSpeed));
        }
    }
    var cameraAfter = convertM2Ca(new Vector(event.offsetX, event.offsetY));
    camera = camera.add(cameraBefore.sub(cameraAfter));
}


function convertC2Mo(pos) {
    return pos.sub(camera).mult(scale);
}

function convertM2Ca(pos) {
    var cameraX = camera.x + pos.x / scale.x;
    var cameraY = camera.y + pos.y / scale.y;
    return new Vector(cameraX, cameraY);
}

function convertM2Ch(pos) {
    var chunkX = Math.floor(pos.x / (chunkPSize));
    var chunkY = Math.floor(pos.y / (chunkPSize));
    return new Vector(chunkX, chunkY);
}

function convertM2Ce(pos) {
    var cellX = Math.floor((pos.x - convertM2Ch(pos).x * chunkPSize) / (cellPSize));
    var cellY = Math.floor((pos.y - convertM2Ch(pos).y * chunkPSize) / (cellPSize));
    return new Vector(cellX, cellY);
}


setInterval(() => {
    cnv2d.fillStyle = "black"
    cnv2d.fillRect(0, 0, cnv2d.canvas.width, cnv2d.canvas.height)
    generateNearChunks(convertM2Ch(new Vector(camera.x + cnv2d.canvas.width / 2, camera.y + cnv2d.canvas.height / 2)));
    renderChunks(chunksQueue);
}, 1);


cnv.addEventListener('mousedown', mousePress);
cnv.addEventListener('mouseup', mouseRelease);
cnv.addEventListener('wheel', wheel);

document.addEventListener('keydown', keyPress);