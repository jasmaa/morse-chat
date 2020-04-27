import Signaler from './signaler';

// UI
const sendBtn = document.getElementById('sendBtn');

// WebRTC

const servers = null;
const pc = new RTCPeerConnection(servers);
const signaler = new Signaler();

const sendChannel = pc.createDataChannel('morse');

let makingOffer = false;

pc.onnegotiationneeded = async () => {
    try {
        makingOffer = true;
        await pc.setLocalDescription();
        signaler.sendOffer(pc.localDescription);
    } catch (err) {
        console.error(err);
    } finally {
        makingOffer = false;
    }
}

pc.onicecandidate = ({ candidate }) => {
    signaler.sendCandidate(candidate);
}

/*
// TEMP: Negotiate connection for both local and remote
localConnection.createOffer()
    .then(desc => {

        console.log(`Offer from local connection\n${desc.sdp}`);

        localConnection.setLocalDescription(desc);
        remoteConnection.setRemoteDescription(desc);
    })
    .then(() => remoteConnection.createAnswer())
    .then(desc => {

        console.log(`Answer from remote connection\n${desc.sdp}`);

        localConnection.setRemoteDescription(desc);
        remoteConnection.setLocalDescription(desc)
    });



remoteConnection.onicecandidate = e => {
    localConnection.addIceCandidate(e.candidate)
        .then(() => {
            console.log('ICE candidate added successfully');
        }, err => {
            console.log(`Failed to add ICE candidate: ${err}`);
        });
}

localConnection.onicecandidate = e => {
    remoteConnection.addIceCandidate(e.candidate)
        .then(() => {
            console.log('ICE candidate added successfully');
        }, err => {
            console.log(`Failed to add ICE candidate: ${err}`);
        });
}


sendChannel.onopen = () => {
    console.log(`Send: ${sendChannel.readyState}`);
}

sendBtn.onclick = e => {
    if (sendChannel.readyState === 'open') {
        sendChannel.send('Hi there')
    }
}

remoteConnection.ondatachannel = e => {

    receiveChannel = e.channel;

    receiveChannel.onopen = () => {
        console.log(`Receive: ${receiveChannel.readyState}`);
    }
    receiveChannel.onclose = () => {
        console.log(`Receive: ${receiveChannel.readyState}`);
    }
    receiveChannel.onmessage = e => {
        console.log(e.data);
    }
}
*/