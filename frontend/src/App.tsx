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

// Protected Route Wrapper
const ProtectedRoute = () => {
  // Mock auth check
  const isAuthenticated = true;
  return isAuthenticated ? <Layout><Outlet /></Layout> : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/roadmaps" element={<Roadmaps />} />
          <Route path="/roadmaps/:id" element={<RoadmapDetail />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/interview" element={<Interview />} />
          <Route path="/learning" element={<Learning />} />
          <Route path="/learning/:moduleId" element={<LearningModule />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/cv" element={<CV />} />
          <Route path="/admin" element={<Admin />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;