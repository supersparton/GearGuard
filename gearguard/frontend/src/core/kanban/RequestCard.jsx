// RequestCard.jsx - Person 2
import React from 'react';

const RequestCard = ({ request }) => {
    return (
        <div className="request-card">
            <h4 className="request-card__title">{request?.title}</h4>
            {/* Request card implementation */}
        </div>
    );
};

export default RequestCard;
