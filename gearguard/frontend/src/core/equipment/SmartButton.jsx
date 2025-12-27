// SmartButton.jsx - Person 1
import React from 'react';

const SmartButton = ({ children, onClick, variant = 'primary', ...props }) => {
    return (
        <button
            className={`smart-button smart-button--${variant}`}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    );
};

export default SmartButton;
