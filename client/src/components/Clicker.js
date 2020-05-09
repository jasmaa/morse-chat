import React, { useState, useEffect } from 'react';

let isKeyDown = false;
let nowDown, nowUp;

const DOT_WAIT = 100;
const DASH_WAIT = 400;
const SPACE_WAIT = 300;

const Clicker = props => {

    const sendChannel = props.sendChannel;

    const [message, setMessage] = useState('');

    useEffect(() => {
        document.addEventListener("keydown", e => {
            if (e.keyCode === 32 && !isKeyDown) {
                isKeyDown = true;

                nowDown = new Date();
                const diff = nowDown - nowUp;

                if (diff > SPACE_WAIT) {
                    setMessage(data => data + ' ');
                }
            }
        }, false);
        document.addEventListener("keyup", e => {
            if (e.keyCode === 32) {
                isKeyDown = false;

                nowUp = new Date();
                const diff = nowUp - nowDown;

                if (diff < DOT_WAIT) {
                    setMessage(data => data + '.');
                } else if (diff < DASH_WAIT) {
                    setMessage(data => data + '-');
                }
            }
        }, false);
    }, []);

    return (
        <div className="d-flex flex-column">

            <h2>{`Sending: ${message}`}</h2>

            <div id="sendBtn" className="btn btn-primary m-1" onClick={() => {    
                if (sendChannel.readyState === 'open') {
                    sendChannel.send(message);
                    setMessage('');
                }
            }}>Send</div>
        </div>
    );
}

export default Clicker;