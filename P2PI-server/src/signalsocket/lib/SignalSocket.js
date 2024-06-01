const EventEmitter = require('events');

class SignalSocket extends EventEmitter {
    events = ['connection', 'room', 'open', 'close', 'sdp'];

    guid() {};
    grid() {};

    constructor (options) {
        super();

        this.wss = options.wss;

        this.clients = {};
        this.rooms = {};
        this.peers = {};

        for (const i in this.events) {
            Object.defineProperty(this, `on${this.events[i]}`, {
                set(handler) {
                    this.on(this.events[i], handler)
                }
            });
        }

        this.wss.on('connection', ws => {
            ws.uid = this.guid();
            this.clients[ws.uid] = ws;
            this.peers[ws.uid] = {};

            this.emit('connection', ws.uid);

            ws.on('message', data => {
                const message = JSON.parse(data);
                if (message.event == 'room') {
                    const rid = message.data.rid || this.grid(message.data.seed);
                    if (!(rid in this.rooms)) {
                        this.rooms[rid] = {};
                        message.data.rid = rid;
                    }

                    this.emit('room', ws.uid, message.data);
                } else if (message.event == 'open') {
                    this.send(ws.uid, JSON.stringify({
                        event: 'open',
                        data: {
                            uid: ws.uid,
                            rid: message.data.rid,
                            peers: this.rooms[message.data.rid]
                        }
                    }));

                    this.rooms[message.data.rid][ws.uid] = null;
                    this.peers[ws.uid][message.data.rid] = null;

                    this.emit('open', ws.uid, message.data);
                } else if (message.event == 'close') {
                    this.close(ws.uid, message.data.rid);
                } else if (message.event == 'sdp') {
                    this.send(message.data.uid, JSON.stringify({
                        event: message.data.sdp.type,
                        data: {
                            uid: ws.uid,
                            rid: message.data.rid,
                            sdp: message.data.sdp
                        }
                    }));

                    this.emit('sdp', ws.uid, message.data);
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

    on(event, handler) {
        this.addListener(event, handler);
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
            }));
        }

        this.emit('close', uid, rid);
    }

    send(uid, message) {
        if(this.clients[uid]) {
            this.clients[uid].send(message);
        }
    }

    broadcast(uids, data) {
        for(const i in uids) {
            this.send(uids[i], data);
        }
    }
}

module.exports = SignalSocket;