// App.jsx - Main application component
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './shared/AuthProvider';
import ProtectedRoute from './shared/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RequestsPage from './pages/RequestsPage';
import EquipmentPage from './pages/EquipmentPage';
import CalendarPage from './pages/CalendarPage';
import RequestDetailPage from './pages/RequestDetailPage';
import './index.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <DashboardPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <DashboardPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/requests"
                        element={
                            <ProtectedRoute>
                                <RequestsPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/requests/:id"
                        element={
                            <ProtectedRoute>
                                <RequestDetailPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/equipment"
                        element={
                            <ProtectedRoute>
                                <EquipmentPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/calendar"
                        element={
                            <ProtectedRoute>
                                <CalendarPage />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
