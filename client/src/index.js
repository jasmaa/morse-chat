import Signaler from './signaler';

// UI
const targetPeerInput = document.getElementById('targetPeer');
const connectBtn = document.getElementById('connectBtn');
const sendBtn = document.getElementById('sendBtn');
const peerList = document.getElementById('peerList')

// WebRTC
const servers = null;
const pc = new RTCPeerConnection(servers);
const signaler = new Signaler();

signaler.setOnPeerList(data => {
    peerList.innerHTML = JSON.stringify(data);
});

const sendChannel = pc.createDataChannel('morse');

// Offer
let makingOffer = false;

connectBtn.onclick = async () => {
    try {
        makingOffer = true;
        await pc.setLocalDescription();
        signaler.sendDescription(targetPeerInput.value, pc.localDescription);
    } catch (err) {
        console.error(err);
    } finally {
        makingOffer = false;
    }
}

pc.onicecandidate = ({ candidate }) => {
    signaler.sendCandidate(targetPeerInput.value, candidate);
}

// Messaging
let ignoreOffer = false;
const polite = true; // TODO: set this from server

signaler.setOnDescription(async ({ socketID, description }) => {

    console.log(description);

    try {
        const offerCollision = description.type === 'offer' && (makingOffer || pc.signalingState !== 'stable');

        console.log(offerCollision);

        // Ignore offer if impolite when collision occurs
        ignoreOffer = !polite && offerCollision;
        if (ignoreOffer) return;

        await pc.setRemoteDescription(description);
        if (description.type === 'offer') {
            await pc.setLocalDescription();
            signaler.sendDescription(socketID, pc.localDescription);
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