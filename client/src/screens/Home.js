import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone } from '@fortawesome/free-solid-svg-icons';

const Home = () => {

    const [roomName, setRoomName] = useState('hello');

    return (
        <div className="container">
            <div className="card d-flex flex-column m-3 p-3">
                <div className="card-body">
                    <h1 className="card-title">Morse Chat</h1>
                    <div className="input-group mb-3">
                        <input
                            className="form-control"
                            onChange={e => {
                                setRoomName(e.target.value);
                            }}
                            value={roomName}
                        />
                        <div className="input-group-append">
                            <div
                                className="btn btn-outline-secondary"
                                onClick={() => {
                                    window.location.href = `/${roomName}`
                                }}
                            >
                                <FontAwesomeIcon icon={faPhone} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;