import React from 'react';

/**
 * Message log
 * @param {*} props 
 */
const MessageLog = props => {

    const log = props.log;

    const renderLog = () => {
        const l = [];
        for (let i = 0; i < log.length; i++) {
            const { timestamp, message } = log[i];
            l.push(<li key={i} className="list-group-item">{`${timestamp.toUTCString()} ${message}`}</li>)
        }

        return l;
    }

    return (
        <ul className="list-group list-group-flush">
            {renderLog()}
        </ul>
    )
}

export default MessageLog;