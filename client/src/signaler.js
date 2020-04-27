import io from 'socket.io-client';

export default class Signaler {
    constructor() {
        this.socket = io('http://localhost:3000');

        this.socket.on('connect', () => {
            console.log('connected!')
        });
        this.socket.on('disconnect', () => {
            console.log('disconnected!');
        });
    }

    sendOffer(description) {
        return this.socket.emit('offer', { description });
    }
    sendCandidate(candidate) {
        return this.socket.emit('candidate', { candidate })
    }
}