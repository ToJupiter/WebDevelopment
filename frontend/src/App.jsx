import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Roadmaps from './pages/Roadmaps.jsx';
import Modules from './pages/Modules.jsx';
import Progress from './pages/Progress.jsx';
import Calendar from './pages/Calendar.jsx';
import Interviews from './pages/Interviews.jsx';
import CVs from './pages/CVs.jsx';
import Certificates from './pages/Certificates.jsx';
import Exercises from './pages/Exercises.jsx';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <nav className="navbar">
          <div className="navbar-brand">
            <h1>🎯 SkillSync</h1>
          </div>
          <ul className="navbar-menu">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/roadmaps">Roadmaps</Link></li>
            <li><Link to="/modules">Modules</Link></li>
            <li><Link to="/progress">Progress</Link></li>
            <li><Link to="/calendar">Calendar</Link></li>
            <li><Link to="/interviews">Interviews</Link></li>
            <li><Link to="/cvs">CVs</Link></li>
            <li><Link to="/certificates">Certificates</Link></li>
            <li><Link to="/exercises">Exercises</Link></li>
          </ul>
        </nav>

        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/roadmaps" element={<Roadmaps />} />
            <Route path="/modules" element={<Modules />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/interviews" element={<Interviews />} />
            <Route path="/cvs" element={<CVs />} />
            <Route path="/certificates" element={<Certificates />} />
            <Route path="/exercises" element={<Exercises />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}
