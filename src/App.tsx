import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import Layout from './components/Layout';
import Login from './auth/Login';
import Signup from './auth/Signup';
import Dashboard from './dashboard/Dashboard';
import AssignmentList from './features/assignments/AssignmentList';
import ProjectList from './features/projects/ProjectList';
import InternshipList from './features/internships/InternshipList';
import InstallPrompt from './components/InstallPrompt';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { currentUser } = useAuth();
    return currentUser ? <>{children}</> : <Navigate to="/login" />;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { currentUser } = useAuth();
    return !currentUser ? <>{children}</> : <Navigate to="/dashboard" />;
};

function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

            {/* Protected Routes */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <Dashboard />
                        </Layout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/assignments"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <AssignmentList />
                        </Layout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/projects"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <ProjectList />
                        </Layout>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/internships"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <InternshipList />
                        </Layout>
                    </ProtectedRoute>
                }
            />

            {/* Default Route */}
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppRoutes />
                <InstallPrompt />
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
