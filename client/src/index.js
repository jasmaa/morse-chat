import 'bootstrap/dist/css/bootstrap.min.css';

import Signaler from './signaler';
import MorsePlayer from './morse';

// UI
const roomInput = document.getElementById('roomInput');
const connectBtn = document.getElementById('connectBtn');
const connectSpinner = document.getElementById('connectSpinner');

const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');

// init UI
roomInput.style.display = '';
connectBtn.style.display = '';
connectSpinner.style.display = 'none';
messageInput.style.display = 'none';
sendBtn.style.display = 'none';

// WebRTC
const servers = null;
const pc = new RTCPeerConnection(servers);
const signaler = new Signaler();

// Offer negotiation

let makingOffer = false;

connectBtn.onclick = async () => {

    signaler.sendJoin(roomInput.value);

    try {
        makingOffer = true;
        await pc.setLocalDescription();
        signaler.sendDescription(roomInput.value, pc.localDescription);

        connectSpinner.style.display = '';

    } catch (err) {
        console.error(err);
    } finally {
        makingOffer = false;
    }
}

pc.onicecandidate = ({ candidate }) => {
    signaler.sendCandidate(roomInput.value, candidate);
}

// Answer negotiation

let ignoreOffer = false;

signaler.setOnDescription(async ({ room, description }) => {

    console.log(description);

    try {
        const offerCollision = description.type === 'offer' && (makingOffer || pc.signalingState !== 'stable');

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
const sendChannel = pc.createDataChannel('morse');
const player = new MorsePlayer();
player.start();

sendChannel.onopen = () => {
    roomInput.style.display = 'none';
    connectBtn.style.display = 'none';
    connectSpinner.style.display = 'none';
    messageInput.style.display = 'block';
    sendBtn.style.display = 'block';
}
sendChannel.onclose = () => {
    // Reload on P2P disconnect
    window.location.reload();
}

sendBtn.onclick = () => {
    if (sendChannel.readyState === 'open') {
        sendChannel.send(messageInput.value);
    }
}
pc.ondatachannel = e => {

    const receiveChannel = e.channel;

    receiveChannel.onmessage = e => {
        console.log(e.data);
        player.play(e.data);
    }
}

