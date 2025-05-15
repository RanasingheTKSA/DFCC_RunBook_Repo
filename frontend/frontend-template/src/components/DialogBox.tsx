import React from 'react';
import '../css/DialogBox.css';

export default function DialogBox({ isOpen, message, activityName, onConfirm, onCancel }) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="dialog-overlay">
            <div className="dialog-box">
                <p>{message}<b>{activityName}</b></p>
                <button onClick={onConfirm}>Yes</button>
                <button onClick={onCancel}>No</button>
            </div>
        </div>
    );
}