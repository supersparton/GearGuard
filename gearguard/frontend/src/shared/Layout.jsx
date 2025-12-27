// Layout.jsx - Shared layout component
import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    return (
        <div className="layout">
            <Sidebar />
            <main className="layout__main">
                {children}
            </main>
        </div>
    );
};

export default Layout;
