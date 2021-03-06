import io from 'socket.io-client';

const baseURL = process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:3000';

/**
 * Signaling server client
 */
export default class Signaler {

    constructor({ onJoin, onDescription, onCandidate }) {
        this.socket = io(baseURL);

        this.socket.on('connect', () => {
            console.log('connected!');
        });
        this.socket.on('disconnect', () => {
            console.log('disconnected!');
        });

        this.socket.on('join', data => {

            if (data.isJoin) {
                this.polite = data.polite;
            }

            onJoin(data);
        });
        this.socket.on('description', onDescription);
        this.socket.on('candidate', onCandidate);
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
}