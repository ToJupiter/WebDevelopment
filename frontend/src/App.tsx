import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Roadmaps from './pages/Roadmaps';
import RoadmapDetail from './pages/RoadmapDetail';
import Analytics from './pages/Analytics';
import Interview from './pages/Interview';
import Login from './pages/Login';
import Learning from './pages/Learning';
import LearningModule from './pages/LearningModule';
import Calendar from "./pages/Calendar";
import CV from "./pages/CV";
import Admin from "./pages/Admin";
import Register from "./pages/Register";
import Settings from "./pages/Settings";
import Certificates from "./pages/Certificates";
import { useAuth } from './context/AuthContext';

// Protected Route Wrapper
// Protected Route Wrapper
const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
      </div>
    );
  }
  return isAuthenticated ? <Layout><Outlet /></Layout> : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/roadmaps" element={<Roadmaps />} />
          <Route path="/roadmaps/:id" element={<RoadmapDetail />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/interview" element={<Interview />} />
          <Route path="/learning" element={<Learning />} />
          <Route path="/roadmaps/:roadmapId/modules/:moduleId" element={<LearningModule />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/cv" element={<CV />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/certificates" element={<Certificates />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;