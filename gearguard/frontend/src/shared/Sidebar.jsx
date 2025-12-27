// Sidebar.jsx - Shared sidebar component
import React from 'react';

const Sidebar = () => {
    return (
        <aside className="sidebar">
            <div className="sidebar__logo">
                <img src="/logo.png" alt="GearGuard" />
            </div>
            <nav className="sidebar__nav">
                {/* Navigation links */}
            </nav>
        </aside>
    );
};

export default Sidebar;
