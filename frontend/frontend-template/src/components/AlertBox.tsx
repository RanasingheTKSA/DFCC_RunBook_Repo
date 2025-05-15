import React from 'react';
import '../css/AlertBox.css';

export default function AlertBox({ isOpen, activityName, message, back }) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="dialog-overlay">
            <div className="dialog-box">
                <p>{message}<b>{activityName}</b></p>
                <button onClick={back}>Back</button>
            </div>
        </div>
    );
}