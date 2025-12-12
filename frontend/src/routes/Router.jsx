import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';
import AuthPage from '../pages/AuthPage.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';
import EditorPage from '../pages/EditorPage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';

export default function Router() {
    return (
        <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/editor/:projectId/:pageId" element={<EditorPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}