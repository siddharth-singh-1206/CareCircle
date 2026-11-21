import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import Dashboard from './pages/Dashboard';
import FamilyMembers from './pages/FamilyMembers';
import Medications from './pages/Medications';
import Documents from './pages/Documents';
import DoctorSharing from './pages/DoctorSharing';
import DoctorDirectory from './pages/DoctorDirectory';
import EmergencyView from './pages/EmergencyView';
import DoctorPortal from './pages/DoctorPortal';
import DoctorDashboard from './pages/DoctorDashboard';
import Login from './pages/Login';
import Register from './pages/Register';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7FAF9] text-[#013A40] text-sm font-semibold">
        Loading CareCircle...
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Role-aware Home dispatcher
const HomeDispatcher = () => {
  const { user } = useAuth();
  if (user?.role === 'doctor') {
    return <DoctorDashboard />;
  }
  return <Dashboard />;
};

// Main App Layout matching the screenshot: Left Sidebar + Top Navbar + Main Content
const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#EDF5F4] flex flex-row text-slate-800">
      {/* Left Deep Teal Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopNavbar />
        <main className="flex-1 overflow-y-auto">{children}</main>
        <footer className="border-t border-slate-200/80 py-3.5 px-8 text-center sm:text-left text-[11px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2 bg-white">
          <span className="font-semibold text-[#013A40]">CareCircle • Family Health Management Platform</span>
          <span>GLA University Mathura (2026-27)</span>
        </footer>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Emergency SOS & Doctor Portal Routes */}
          <Route path="/emergency" element={<EmergencyView />} />
          <Route path="/emergency/:code" element={<EmergencyView />} />
          <Route path="/doctor-access/:token" element={<DoctorPortal />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Main App Routes with Role Dispatcher */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <HomeDispatcher />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor"
            element={
              <ProtectedRoute>
                <Layout>
                  <DoctorDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/members"
            element={
              <ProtectedRoute>
                <Layout>
                  <FamilyMembers />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/medications"
            element={
              <ProtectedRoute>
                <Layout>
                  <Medications />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/documents"
            element={
              <ProtectedRoute>
                <Layout>
                  <Documents />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor-sharing"
            element={
              <ProtectedRoute>
                <Layout>
                  <DoctorSharing />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctors"
            element={
              <ProtectedRoute>
                <Layout>
                  <DoctorDirectory />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
