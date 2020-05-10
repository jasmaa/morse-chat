import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFrownOpen } from '@fortawesome/free-solid-svg-icons';

/**
 * Room full display
 */
const RoomFull = () => {
    return (
        <div className="container p-3">
            <div className="card">
                <div className="card-body d-flex flex-column align-items-center justify-content-center">
                    <p>This room is currently unavailable. Please try another room.</p>
                    <FontAwesomeIcon icon={faFrownOpen} size="6x" color="gray" />
                </div>
            </div>
        </div>
    );
}
export default RoomFull;