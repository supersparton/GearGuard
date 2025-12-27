// KanbanColumn.jsx - Person 2
import React from 'react';

const KanbanColumn = ({ title, children }) => {
    return (
        <div className="kanban-column">
            <h3 className="kanban-column__title">{title}</h3>
            <div className="kanban-column__content">
                {children}
            </div>
        </div>
    );
};

export default KanbanColumn;
