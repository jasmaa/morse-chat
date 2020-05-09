import React, { useState } from 'react';

import Loading from 'src/components/Loading';
import Clicker from 'src/components/Clicker';
import MessageLog from 'src/components/MessageLog';
import Signaler from 'src/utils/signaler';
import MorsePlayer from 'src/utils/morse';

// WebRTC
const servers = null;
const pc = new RTCPeerConnection(servers);
const signaler = new Signaler();
let makingOffer = false;
let ignoreOffer = false;

// Messaging
const sendChannel = pc.createDataChannel('morse');
const player = new MorsePlayer();

/**
 * Room
 * @param {*} props 
 */
const Room = props => {

    const roomName = props.roomName;
    const [roomState, setRoomState] = useState('init');
    const [log, setLog] = useState([]);

    const updateLog = v => {
        setLog(data => {
            const l = [...data, v];
            if (l.length > 5) {
                l.shift();
            }
            return l;
        });
    }

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

            receiveChannel.onmessage = e => {

                // TEMP: disable for now
                //player.play(e.data);

                updateLog(`=> ${e.data}`);
            }
        }

        player.start();

        // Set to wait
        setRoomState('waiting');
    }

    if (roomState === 'waiting') {
        return <Loading />
    }

    return (
        <div className="container">
            <div className="d-flex flex-column justify-content-center p-3">
                <MessageLog log={log} />
                <Clicker sendChannel={sendChannel} updateLog={updateLog} />
            </div>
        </div>
    );
}

export default Room;