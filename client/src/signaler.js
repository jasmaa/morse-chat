import io from 'socket.io-client';

export default class Signaler {

    constructor() {
        this.socket = io('http://localhost:3000');

        this.socket.on('connect', () => {
            console.log('connected!');
            this.socket.emit('peerList');
        });
        this.socket.on('disconnect', () => {
            console.log('disconnected!');
        });
    }

    sendDescription(socketID, description) {
        return this.socket.emit('description', { socketID, description });
    }
    sendCandidate(socketID, candidate) {
        return this.socket.emit('candidate', { socketID, candidate })
    }

    setOnDescription(cb) {
        this.socket.on('description', cb);
    }
    setOnCandidate(cb) {
        this.socket.on('candidate', cb);
    }
    setOnPeerList(cb) {
        this.socket.on('peerList', cb);
    }
}