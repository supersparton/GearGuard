// StatCard.jsx - Person 3
import React from 'react';

const StatCard = ({ title, value, icon, trend }) => {
    return (
        <div className="stat-card">
            <div className="stat-card__icon">{icon}</div>
            <div className="stat-card__content">
                <h3 className="stat-card__title">{title}</h3>
                <p className="stat-card__value">{value}</p>
            </div>
        </div>
    );
};

export default StatCard;
