import io from 'socket.io-client';

export default class Signaler {

    constructor() {
        this.socket = io('http://localhost:3000');

        this.socket.on('connect', () => {
            console.log('connected!');
        });
        this.socket.on('disconnect', () => {
            console.log('disconnected!');
        });

        this.socket.on('join', data => {

            console.log(data);

            if (data.isJoin) {
                this.polite = data.polite;
            }
        });
    }

    sendJoin(room) {
        return this.socket.emit('join', { room });
    }

    sendDescription(room, description) {
        return this.socket.emit('description', { room, description });
    }
    sendCandidate(room, candidate) {
        return this.socket.emit('candidate', { room, candidate })
    }

    setOnDescription(cb) {
        this.socket.on('description', cb);
    }
    setOnCandidate(cb) {
        this.socket.on('candidate', cb);
    }
}