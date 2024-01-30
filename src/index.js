const express = require('express');
const ws = require('ws');
const path = require('path');
const uuid = require('uuid');


const PORT = 8000;
const WSPORT = 5000;
const IP = 'localhost';

const app = express();
const wss = new ws.Server({
    port: WSPORT,
    url: IP
});

var clients = {};
var hosts = {};
var positions = {};

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', express.static(path.resolve('public')));
app.use('/src', express.static(path.resolve('src')));


wss.on('connection', ws => {
    ws.id = uuid.v4();
    clients[ws.id] = ws;
    positions[ws.id] = [];
    ws.on('close', () => {
        positions[ws.id].forEach(pos => {
            hosts[pos].splice(hosts[pos].indexOf(ws.id), 1);
            if (hosts[pos].length == 0) {
                delete hosts[pos]
            }
        });
        delete positions[ws.id];
        delete clients[ws.id]
    });
    ws.on('message', message => {
        var data = JSON.parse(message);
        if (data.event == 'get') {
            if (hosts[data.pos]) {
                hosts[data.pos].forEach(host => {
                    if (host != ws.id) {
                        clients[host].send(JSON.stringify({
                            event: 'get',
                            pos: data.pos
                        }));
                        return true;
                    }
                });
            } else {
                hosts[data.pos] = [];
            }
            hosts[data.pos].push(ws.id);
            positions[ws.id].push(data.pos);
        } else if (data.event == 'put') {
            hosts[data.pos].forEach(listener => {
                if (listener != ws.id) {
                    clients[listener].send(JSON.stringify({
                        event: 'put',
                        pos: data.pos,
                        chunk: data.chunk
                    }));
                }
            });
        } else if (data.event == 'pop') {
            positions[ws.id].splice(positions[ws.id].indexOf(data.pos), 1);
            hosts[data.pos].splice(hosts[data.pos].indexOf(ws.id), 1);
            if (hosts[data.pos].length == 0) {
                delete hosts[data.pos]
            }
        }
    })
});

app.listen(PORT, IP);