// RequestsPage.jsx - Kanban board (RENAMED from previous)
import React from 'react';
import Layout from '../shared/Layout';
import KanbanBoard from '../core/kanban/KanbanBoard';

const RequestsPage = () => {
    return (
        <Layout>
            <KanbanBoard />
        </Layout>
    );
};

export default RequestsPage;
