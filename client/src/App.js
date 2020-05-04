import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import Signaler from './signaler';
import MorsePlayer from './morse';

const roomName = 'hello';

// WebRTC
const servers = null;
const pc = new RTCPeerConnection(servers);
const signaler = new Signaler();
let makingOffer = false;
let ignoreOffer = false;

const sendChannel = pc.createDataChannel('morse');
const player = new MorsePlayer();


const App = () => {

    const [roomState, setRoomState] = useState('init');

    // Init WebRTC
    if (roomState === 'init') {

        // Offer negotiation
        pc.onnegotiationneeded = async () => {

            signaler.sendJoin(roomName);

            try {
                makingOffer = true;
                await pc.setLocalDescription();
                signaler.sendDescription(roomName, pc.localDescription);
            } catch (err) {
                console.error(err);
            } finally {
                makingOffer = false;
            }
        }

        pc.onicecandidate = ({ candidate }) => {
            signaler.sendCandidate(roomName, candidate);
        }

        // Answer negotiation
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

        // Messaging
        sendChannel.onopen = () => {
            setRoomState('connected');
        }
        sendChannel.onclose = () => {
            // Reload on P2P disconnect
            window.location.reload();
        }
        pc.ondatachannel = e => {

            const receiveChannel = e.channel;

            console.log(sendChannel.readyState);

            receiveChannel.onmessage = e => {
                console.log(e.data);
                player.play(e.data);
            }
        }

        player.start();

        // Set to wait
        setRoomState('waiting');
    }

    if (roomState === 'waiting') {
        return (
            <div id="connectSpinner" class="spinner-border m-2" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        );
    }

    return (
        <div class="container">
            <div class="d-flex flex-column justify-content-center align-items-center p-3">

                <div class="d-flex align-items-center p-1">
                    <input id="messageInput" />
                    <div id="sendBtn" class="btn btn-primary m-1" onClick={() => {
                        if (sendChannel.readyState === 'open') {
                            sendChannel.send(messageInput.value);
                        }
                    }}>Send</div>
                </div>

            </div>
        </div>
    );
}

export default App;