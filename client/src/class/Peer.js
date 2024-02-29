export default class Peer {
    wss;

    rooms;
    peers;
    peerConnections;
    dataChannels;

    onroom = (data) => {};
    onopen = (data) => {};
    onclose = (uid, rid) => {};
    onsdp = (data) => {};
    onmessage = (message) => {};


    onrtcopen = (data) => {};
    onrtclose = (uid, rid) => {};
    onrtcmessage = (message) => {};

    constructor(options) {
        this.wss = options.wss;
        this.rooms = {};
        this.peers = {};
        this.peerConnections = {};
        this.dataChannels = {};
        this.wss.onmessage = async event => {
            const message = JSON.parse(event.data)
            if (message.event == 'room') {
                this.onroom(message.data);
            } else if (message.event == 'open') {
                if (message.data.peers) {
                    for (const uid in message.data.peers) {
                        this.rooms[message.data.rid][uid] = null;
                        this.peers[uid] = this.peers[uid] || {};
                        this.peers[uid][message.data.rid] = null;

                        if (!(uid in this.peerConnections)) {
                            this.peerConnections[uid] = new RTCPeerConnection();
                
                            this.dataChannels[uid] = new Promise(async (resolve, reject) => {
                                const dataChannel = await this.peerConnections[uid].createDataChannel("messageInput");
                                this.setupdatachannel(dataChannel);
                                dataChannel.onopen = () => {
                                    resolve(dataChannel)
                                }
                            })
                
                            const offer = await this.peerConnections[uid].createOffer();
                            await this.peerConnections[uid].setLocalDescription(offer);
                
                            this.peerConnections[uid].onicecandidate = event => {
                                if (event.candidate) {
                                    this.wss.send(JSON.stringify({
                                        event: 'sdp',
                                        data: {
                                            uid: uid,
                                            rid: message.data.rid,
                                            sdp: this.peerConnections[uid].localDescription
                                        }
                                    }))
                                }
                            }
                        } else {
                            this.send(uid, JSON.stringify({
                                event: 'open',
                                data: {
                                    uid: message.data.uid,
                                    rid: message.data.rid
                                },
                            }));
                        }
                    };
                }

                this.onopen(message.data);
            } else if (message.event == 'close') {
                this.close(message.data.uid, message.data.rid);
            } else if (message.event == 'offer') {
                this.rooms[message.data.rid][message.data.uid] = null;
                this.peers[message.data.uid] = this.peers[message.data.uid] || {};
                this.peers[message.data.uid][message.data.rid] = null;

                this.peerConnections[message.data.uid] = new RTCPeerConnection();

                this.dataChannels[message.data.uid] = new Promise(async (resolve, reject) => {
                    this.peerConnections[message.data.uid].ondatachannel = event => {
                        this.setupdatachannel(event.channel);
                        resolve(event.channel)
    
                        this.onrtcopen(message.data);
                    }
                })
                
                await this.peerConnections[message.data.uid].setRemoteDescription(message.data.sdp);
                const answer = await this.peerConnections[message.data.uid].createAnswer()
                await this.peerConnections[message.data.uid].setLocalDescription(answer)

                this.peerConnections[message.data.uid].onicecandidate = event => {
                    if (event.candidate) {
                        this.wss.send(JSON.stringify({
                            event: 'sdp',
                            data: {
                                uid: message.data.uid,
                                rid: message.data.rid,
                                sdp: this.peerConnections[message.data.uid].localDescription
                            }
                        }))
                    }
                }

                this.onsdp(message.data);
            } else if (message.event == 'answer') {
                await this.peerConnections[message.data.uid].setRemoteDescription(message.data.sdp);

                this.onsdp(message.data);
            } else {
                this.onmessage(message);
            }
        };
    }

    setupdatachannel(dataChannel) {
        dataChannel.onmessage = event => {
            const message = JSON.parse(event.data)
            if (message.event == 'open') {
                this.rooms[message.data.rid][message.data.uid] = null;
                this.peers[message.data.uid] = this.peers[message.data.uid] || {};
                this.peers[message.data.uid][message.data.room] = null;

                this.onrtcopen(message.data);
            } else {
                this.onrtcmessage(message);
            }
        };
    }

    room(rid, seed) {
        this.wss.send(JSON.stringify({
            event: 'room',
            data: {
                rid: rid,
                seed: seed
            }
        }))
    }

    openroom(rid) {
        this.rooms[rid] = {};

        this.wss.send(JSON.stringify({
            event: 'open',
            data: {
                rid: rid
            }
        }));
    }

    closeroom(rid) {
        for(const uid in this.rooms[rid]) {
            this.close(uid, rid);
        }
        delete this.rooms[rid];
        
        this.wss.send(JSON.stringify({
            event: 'close',
            data: {
                rid: rid
            }
        }));
    }

    async close(uid, rid) {
        delete this.rooms[rid][uid];
        delete this.peers[uid][rid];

        if (Object.keys(this.peers[uid]).length == 0) {
            (await this.dataChannels[uid]).close();
            this.peerConnections[uid].close();
            delete this.dataChannels[uid];
            delete this.peerConnections[uid];
            delete this.peers[uid];

            this.onrtclose(uid, rid);
        }

        this.onclose(uid, rid);
    }

    async send(uid, message) {

        (await this.dataChannels[uid]).send(message);
    }

    broadcast(rid, message) {
        for(const uid in this.rooms[rid]) {
            this.send(uid, message);
        }
    }
}