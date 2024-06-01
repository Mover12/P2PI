const SignalSocket = require('./src/signalsocket');
const WebSocket = require('ws');

const uuid = require('uuid');

const URL = '127.0.0.1';
const PORT = 5000;

const socket = new WebSocket.WebSocketServer({
    url: URL,
    port: PORT
})

const ss = new SignalSocket({
    wss: socket
});

ss.guid = () => {
    return uuid.v1();
}