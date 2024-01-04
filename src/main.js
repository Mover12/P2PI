import Vector from './field/Vector.js'
import Chunk from './field/Chunk.js'
import field from './field/consts.js'

var cnv = document.getElementById("cnv");
var cnv2d = cnv.getContext("2d");

var chunks = new Map();
var chunksQueue = new Array();

var curCameraX = 0;
var curCameraY = 0;
var cameraX = 0;
var cameraY = 0;

function generateChunk (pos) {
    var chunk = chunks.get(pos.stringify());
    
    if (chunk == null) {
        chunk = deserializeChunk(pos.stringify());
        chunksQueue.push(pos);
        chunks.set(pos.stringify(), chunk);
        if (chunksQueue.length > field.CHUNKSCASHSIZE) {
            let pos = chunksQueue.shift();
            serializeChunk(pos, chunks.get(pos.stringify()));
            chunks.delete(pos.stringify());
      }
    }
}
  
function generateNearChunks(pos) {
    for (let i = pos.y - field.RENDERDISTANCE; i <= pos.y + field.RENDERDISTANCE; i++) {
      for (let j = pos.x - field.RENDERDISTANCE; j <= pos.x + field.RENDERDISTANCE; j++) {
        generateChunk(new Vector(j, i));
      }
    }
  }
  
function serializeChunk (pos, chunk) {
    fetch("/upload", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [pos] : chunk })
    });
}
  
function deserializeChunk (pos) {
    var chunk = new Chunk();
    fetch("/download", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pos })
    }).then(function(res) {
        return res.json()
    }).then(function(data) {
        if (data != "-4058") {
            chunk.cellCount = data[Object.keys(data)]['cellCount']
            chunk.cells = data[Object.keys(data)]['cells']
        }
    });
    return chunk;
}
  
function renderChunks (chunksQueue) {
    chunksQueue.forEach(elem => {
        var chunkPos = elem;
        for (let i = 0; i < field.CELLCOUNT; i++) {
            for (let j = 0; j < field.CELLCOUNT; j++) {
                var cell = chunks.get(chunkPos.stringify()).cells[i][j];
                var cellColor = '#000000';
                if (cell == 0) {
                    cellColor = '#FFFFFF';
                }
                else if (cell == 1) {
                    cellColor = '#FF4040';
                }
                var cellX = j * field.CELLPSIZE + chunkPos.x * field.CHUNKPSIZE + cnv.width / 2  - cameraX;
                var cellY = i * field.CELLPSIZE + chunkPos.y * field.CHUNKPSIZE + cnv.height / 2 - cameraY;
                if ((-field.CELLPSIZE <= cellX && cellX <= cnv.width) && (-field.CELLPSIZE <= cellY && cellY <= cnv.height)) {
                    cnv2d.fillStyle = cellColor;
                    cnv2d.fillRect(cellX, cellY, field.CELLPSIZE, field.CELLPSIZE);
                }
            }
        }
    });
}
  
function convertM2Ch (pos) {
    var chunkX = Math.floor(pos.x / field.CHUNKPSIZE);
    var chunkY = Math.floor(pos.y / field.CHUNKPSIZE);
    return new Vector(chunkX, chunkY);
}
  
function convertM2Ce (pos) {
    var cellX = Math.floor((pos.x - convertM2Ch(pos).x * field.CHUNKPSIZE) / field.CELLPSIZE);
    var cellY = Math.floor((pos.y - convertM2Ch(pos).y * field.CHUNKPSIZE) / field.CELLPSIZE);
    return new Vector(cellX, cellY);
}

document.addEventListener('mousedown', mousedown)
document.addEventListener('mouseup', mouseup)
document.addEventListener('keydown', save)

function save(event) {
    if (event.code == 'KeyS') {
        chunks.keys().forEach((chunkPos) => {
            serializeChunk(chunkPos, chunks.get(chunkPos));
        })
    }
}

function mousedown(event) {
    if (event.buttons == 4) {
        curCameraX = event.offsetX;
        curCameraY = event.offsetY;
    }
    document.addEventListener('mousemove', mousemove)
}

function mouseup() {
    document.removeEventListener('mousemove', mousemove);
}

function mousemove(event) {
    if (event.buttons == 4) {
        cameraX = cameraX - (event.offsetX - curCameraX);
        cameraY = cameraY - (event.offsetY - curCameraY);
        curCameraX = event.offsetX;
        curCameraY = event.offsetY;
    } else {
        var chunkPos = convertM2Ch(new Vector(cameraX + event.offsetX - cnv.width / 2, cameraY + event.offsetY - cnv.height / 2));
        var cellPos = convertM2Ce(new Vector(cameraX + event.offsetX - cnv.width / 2, cameraY + event.offsetY - cnv.height / 2));
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

setInterval(() => {
    cnv2d.fillStyle = "black"
    cnv2d.fillRect(0, 0, cnv2d.canvas.width, cnv2d.canvas.height)
    generateNearChunks(convertM2Ch(new Vector(cameraX, cameraY)));
    renderChunks(chunksQueue);
}, 1);