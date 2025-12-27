// CalendarEvent.jsx - Person 3
import React from 'react';

const CalendarEvent = ({ event }) => {
    return (
        <div className="calendar-event">
            <span className="calendar-event__title">{event?.title}</span>
            {/* Calendar event implementation */}
        </div>
    );
};

export default CalendarEvent;
