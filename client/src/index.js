import './css/style.css'

import Vector from './class/Vector.js'
import Chunk from './class/Chunk.js'
import Converter from './class/Converter.js'
import Peer from './class/Peer.js'

const socket = await new Promise((resolve, reject) => {
    const socket = new WebSocket('ws://localhost:8000')
    socket.onopen = () => {
        resolve(socket)
    }
})

const peer = new Peer({ wss: socket });

var cnv = document.querySelector(".canvas");
var position = document.querySelector(".position");
var cnv2d = cnv.getContext("2d");

var chunks = new Map();
var chunksQueue = new Array();
var colors = ['#FFFFFF', '#FF4040'];

var camera = new Vector(0, 0);
var prevCamera = new Vector(0, 0);
var scale = new Vector(1, 1);

const width = cnv2d.canvas.width;
const height = cnv2d.canvas.height;
const cellCount = 64;
const cellPSize = 10;
const chunkPSize = cellCount * cellPSize;

const renderDistance = 1;
const chunksCashSize = 16;

const zoomSpeed = 1;
const zoomMaximum = 10;



function generateChunk(pos) {
    var chunk = chunks.get(pos.stringify());
    
    if (chunk == null) {
        chunk = new Chunk(cellCount);
        chunksQueue.push(pos);
        chunks.set(pos.stringify(), chunk);
        peer.room(pos.stringify());
        peer.openroom(pos.stringify());
        if (chunksQueue.length > chunksCashSize) {
            var pos = chunksQueue.shift();
            chunks.delete(pos.stringify());
            peer.closeroom(pos.stringify());
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
  
function renderChunks(chunksQueue) {
    chunksQueue.forEach(chunkPos => {
        for (let i = 0; i < cellCount; i++) {
            for (let j = 0; j < cellCount; j++) {
                var cellColor = chunks.get(chunkPos.stringify()).cells[i][j];
                var cellPos = Converter.CaToMo(new Vector(
                    j * cellPSize + chunkPos.x * chunkPSize, 
                    i * cellPSize + chunkPos.y * chunkPSize
                ), camera, scale);
                if ((-cellPSize * scale.x <= cellPos.x && cellPos.x <= width) && (-cellPSize * scale.y <= cellPos.y && cellPos.y <= height)) {
                    cnv2d.fillStyle = colors[cellColor];
                    cnv2d.fillRect(Math.trunc(cellPos.x), Math.trunc(cellPos.y), Math.trunc(cellPSize * scale.x), Math.trunc(cellPSize * scale.y));
                }
            }
        }
    });
}

function mousePress(event) {
    if (event.buttons == 4) {
        prevCamera.set(event.offsetX, event.offsetY);
    }
    cnv.addEventListener('mousemove', mouseMove)
}

function mouseRelease() {
    cnv.removeEventListener('mousemove', mouseMove);
}

function mouseMove(event) {
    if (event.buttons == 4) {
        camera.x = camera.x - (event.offsetX - prevCamera.x) / scale.x;
        camera.y = camera.y - (event.offsetY - prevCamera.y) / scale.y;
        prevCamera.set(event.offsetX, event.offsetY);
    } else {
        const chunkPos = Converter.CaToCh(Converter.MoToCa(new Vector(event.offsetX, event.offsetY), camera, scale), chunkPSize);
        const cellPos = Converter.CaToCe(Converter.MoToCa(new Vector(event.offsetX, event.offsetY), camera, scale), chunkPSize, cellPSize);
        const chunk = chunks.get(chunkPos.stringify());
        if (chunk != null) {
            if (event.buttons == 1) {
                chunk.cells[cellPos.y][cellPos.x] = 1;
            }
            peer.broadcast(chunkPos.stringify(), JSON.stringify({
                event: 'set',
                data: {
                    pos: chunkPos.stringify(),
                    chunk: chunk
                }
            }))
        }
    }
}

function wheel(event) {
    var cameraBeforeZoom = Converter.MoToCa(new Vector(event.offsetX, event.offsetY), camera, scale);
    if (event.deltaY < 0) {
        if (scale.x < zoomMaximum && scale.y < zoomMaximum) {
            scale = scale.add(new Vector(zoomSpeed, zoomSpeed));
        }
    } else {
        if (scale.x > zoomSpeed && scale.y > zoomSpeed) {
            scale = scale.sub(new Vector(zoomSpeed, zoomSpeed));
        }
    }
    var cameraAfterZoom = Converter.MoToCa(new Vector(event.offsetX, event.offsetY), camera, scale);
    camera = camera.add(cameraBeforeZoom.sub(cameraAfterZoom));
}

setInterval(() => {
    position.innerHTML = `${Math.floor(camera.x)}, ${Math.floor(camera.y)}`;
    cnv2d.fillStyle = "white";
    cnv2d.fillRect(0, 0, width, height);
    generateNearChunks(Converter.CaToCh(new Vector(camera.x, camera.y), chunkPSize));
    renderChunks(chunksQueue);
}, 1);

peer.onrtcopen = (data) => {
    peer.send(data.uid, JSON.stringify({
        event: 'set',
        data: {
            pos: data.rid,
            chunk: chunks.get(data.rid)
        }
    }))
}

peer.onrtcmessage = (message) => {
    if (message.event == 'set') {
        chunks.set(message.data.pos, message.data.chunk)
    }
}

cnv.addEventListener('mousedown', mousePress);
cnv.addEventListener('mouseup', mouseRelease);
cnv.addEventListener('wheel', wheel);