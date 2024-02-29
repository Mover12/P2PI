const WebSocket = require('ws');

module.exports = class SignalSocket {
    wss;

    clients;
    rooms;
    peers;

    onconnection = (uid) => {};

    onroom = (uid, data) => {};
    onopen = (uid, data) => {};
    onclose = (uid, rid) => {};
    onsdp = (uid, data) => {};
    onmessage = (uid, data) => {};

    guid = () => {};
    grid = (data) => {};

    constructor (options) {
        this.wss = options.ws;

        this.clients = {};
        this.rooms = {};
        this.peers = {};

        this.wss.on('connection', ws => {
            ws.uid = this.guid();
            this.clients[ws.uid] = ws;
            this.peers[ws.uid] = {};

            this.onconnection(ws.uid);

            ws.on('message', data => {
                const message = JSON.parse(data);
                if (message.event == 'room') {
                    const rid = this.grid(message.data.seed) || message.data.rid;
                    if (!(rid in this.rooms)) {
                        this.rooms[rid] = {}
                        message.data.rid = rid
                    }

                    this.onroom(ws.uid, message.data);
                } else if (message.event == 'open') {
                    ws.send(JSON.stringify({
                        event: 'open',
                        data: {
                            uid: ws.uid,
                            rid: message.data.rid,
                            peers: this.rooms[message.data.rid]
                        }
                    }));
                    this.rooms[message.data.rid][ws.uid] = null;
                    this.peers[ws.uid][message.data.rid] = null;

                    this.onopen(ws.uid, message.data);
                } else if (message.event == 'close') {
                    this.close(ws.uid, message.data.rid);
                } else if (message.event == 'sdp') {
                    this.clients[message.data.uid].send(JSON.stringify({
                        event: message.data.sdp.type,
                        data: {
                            uid: ws.uid,
                            rid: message.data.rid,
                            sdp: message.data.sdp
                        }
                    }))

                    this.onsdp(ws.uid, message.data);
                } else {
                    this.onmessage(ws.uid, message.data);
                }
            });

            ws.on('close', () => {
                for(const rid in this.peers[ws.uid]) {
                    this.close(ws.uid, rid);
                }

                delete this.peers[ws.uid];
                delete this.clients[ws.uid];
            });
        });
    }

    close(uid, rid) {
        delete this.rooms[rid][uid];
        delete this.peers[uid][rid];
        for (const id in this.rooms[rid]) {
            this.clients[id].send(JSON.stringify({
                event: 'close',
                data: {
                    uid: uid,
                    rid: rid
                }
            }))
        }

        this.onclose(uid, rid);
    }

    send(uid, message) {
        this.clients[uid].send(message)
    }

    broadcast(uids, data) {
        for(const i in uids) {
            this.send(uids[i], data)
        }

    }
}