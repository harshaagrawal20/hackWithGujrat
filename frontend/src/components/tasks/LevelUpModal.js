import React from 'react';

const LevelUpModal = ({ level, onClose }) => {
    return (
        <div className="level-up-modal">
            <div className="level-up-content">
                <h2>🎊 Level Up! 🎊</h2>
                <div className="level-display">
                    <span className="level-number">{level}</span>
                </div>
                <p>Congratulations! You've reached level {level}!</p>
                <p>Keep up the great work on your mental health journey!</p>
                <button onClick={onClose} className="btn-primary">Continue</button>
            </div>
        </div>
    );
};

export default LevelUpModal;
