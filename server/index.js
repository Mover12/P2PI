const SignalSocket = require('./class/SignalSocket');
const WebSocket = require('ws');

const uuid = require('uuid');

const PORT = 8000;
const URL = '127.0.0.1';

const socket = new WebSocket.Server({
    port: PORT,
    url: URL
})

const ss = new SignalSocket({ ws: socket });

ss.guid = () => {
    return uuid.v1();
}