import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faPersonBooth, faUser, faArrowLeft, faArrowsAltH, faArrowRight, faLongArrowAltRight, faLongArrowAltLeft } from '@fortawesome/free-solid-svg-icons';

/**
 * Home screen
 */
const Home = () => {

    const [roomName, setRoomName] = useState('hello');

    const goToRoom = room => {
        window.location.href = `/${room}`;
    }

    return (
        <div className="container p-3">

            <div className="card m-3 p-3">
                <div className="card-body d-flex flex-column align-items-center justify-content-center">
                    <h1 className="card-title">Morse Chat</h1>
                    <p>P2P Morse code with WebRTC</p>
                    <div>
                        <FontAwesomeIcon className="mr-3" icon={faUser} size="2x" />
                        <FontAwesomeIcon icon={faLongArrowAltLeft} size="2x" />
                        <FontAwesomeIcon className="mx-1" icon={faPhone} size="2x" />
                        <FontAwesomeIcon icon={faLongArrowAltRight} size="2x" />
                        <FontAwesomeIcon className="ml-3" icon={faUser} size="2x" />
                    </div>
                </div>
            </div>

            <div className="card m-3 p-3">
                <div className="card-body d-flex align-items-center justify-content-center">

                    <div className="input-group mx-3">
                        <input
                            className="form-control"
                            onChange={e => {
                                setRoomName(e.target.value);
                            }}
                            onKeyPress={e => {
                                if (e.charCode === 13) {
                                    goToRoom(roomName);
                                }
                            }}
                            value={roomName}
                        />
                        <div className="input-group-append">
                            <div
                                className="btn btn-outline-secondary"
                                onClick={() => goToRoom(roomName)}
                            >
                                <FontAwesomeIcon icon={faPhone} />
                            </div>
                        </div>
                    </div>

                    <div className="btn btn-primary mx-3" onClick={() => {
                        goToRoom((Math.random() * 0xFFFFFF << 0).toString(16));
                    }}>Random</div>

                </div>
            </div>
        </div>
    );
}

export default Home;