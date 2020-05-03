import Signaler from './signaler';

// UI
const roomInput = document.getElementById('roomInput');
const connectBtn = document.getElementById('connectBtn');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');

// WebRTC
const servers = null;
const pc = new RTCPeerConnection(servers);
const signaler = new Signaler();

const sendChannel = pc.createDataChannel('morse');

// Negotiation

let makingOffer = false;

connectBtn.onclick = async () => {

    signaler.sendJoin(roomInput.value);

    try {
        makingOffer = true;
        await pc.setLocalDescription();
        signaler.sendDescription(roomInput.value, pc.localDescription);
    } catch (err) {
        console.error(err);
    } finally {
        makingOffer = false;
    }
}

pc.onicecandidate = ({ candidate }) => {
    signaler.sendCandidate(roomInput.value, candidate);
}


let ignoreOffer = false;

signaler.setOnDescription(async ({ room, description }) => {

    console.log(description);

    try {
        const offerCollision = description.type === 'offer' && (makingOffer || pc.signalingState !== 'stable');

        console.log(offerCollision);

        // Ignore offer if impolite when collision occurs
        ignoreOffer = !signaler.polite && offerCollision;
        if (ignoreOffer) return;

        await pc.setRemoteDescription(description);
        if (description.type === 'offer') {
            await pc.setLocalDescription();
            signaler.sendDescription(room, pc.localDescription);
        }

    } catch (err) {
        console.error(err);
    }
});

signaler.setOnCandidate(async ({ candidate }) => {

    console.log(candidate);

    try {
        try {
            await pc.addIceCandidate(candidate);
        } catch (err) {
            if (!ignoreOffer) throw err;
        }
    } catch (err) {
        console.error(err);
    }
});

// P2P messaging
sendBtn.onclick = () => {
    sendChannel.send(messageInput.value);
}
pc.ondatachannel = e => {

    const receiveChannel = e.channel;

    receiveChannel.onmessage = e => {
        console.log(e.data);
    }
} 