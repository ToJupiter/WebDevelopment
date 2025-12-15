## `index.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Lumina Learning</title>

    <!-- Fonts & Tailwind (optional if you use Tailwind via plugin) -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">
    <script>
      tailwind.config = {
        theme: {
          extend: {
            fontFamily: {
              sans: ['Inter', 'sans-serif'],
              mono: ['Fira Code', 'monospace'],
            },
            colors: {
              brand: {
                50: '#eef2ff',
                100: '#e0e7ff',
                500: '#6366f1',
                600: '#4f46e5',
                700: '#4338ca',
              }
            }
          }
        }
      }
    </script>

    <style>
      body { background-color: #f8fafc; }
      /* Custom scrollbar for webkit */
      ::-webkit-scrollbar { width: 6px; height: 6px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
      ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
    </style>

    <link rel="stylesheet" href="/src/index.css">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

## `src/App.css`

```css

#root {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.react:hover {
  filter: drop-shadow(0 0 2em #61dafbaa);
}

@keyframes logo-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: no-preference) {
  a:nth-of-type(2) .logo {
    animation: logo-spin infinite 20s linear;
  }
}

.card {
  padding: 2em;
}

.read-the-docs {
  color: #888;
}

```

## `src/App.tsx`

```tsx
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
```

## `src/components/Layout.tsx`

```tsx
import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map, 
  BookOpen, 
  BarChart2, 
  Video, 
  Menu, 
  X, 
  Bell, 
  Search,
  LogOut,
  User,
  Settings
} from 'lucide-react';
import { Avatar } from './ui/Common';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Map size={20} />, label: 'Roadmaps', path: '/roadmaps' },
    { icon: <BookOpen size={20} />, label: 'My Learning', path: '/learning' },
    { icon: <BarChart2 size={20} />, label: 'Analytics', path: '/analytics' },
    { icon: <Video size={20} />, label: 'Learning', path: '/learning' },
    { icon: <Video size={20} />, label: 'Calendar', path: '/calendar' },
    { icon: <Video size={20} />, label: 'CV', path: '/cv' },
    { icon: <Video size={20} />, label: 'Admin', path: '/admin' },
  ];

  const handleLogout = () => {
    // Clear auth token logic here
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-800">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-slate-900/50 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:static z-30 inset-y-0 left-0 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:transform-none flex flex-col shadow-xl lg:shadow-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-brand-500/30">
              L
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">Lumina</span>
          </div>
          <button onClick={toggleSidebar} className="ml-auto lg:hidden text-slate-500">
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Main Menu</p>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-brand-50 text-brand-600 shadow-sm ring-1 ring-brand-200' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
          
          <div className="mt-8">
            <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Settings</p>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
              <Settings size={20} />
              Preferences
            </button>
          </div>
        </nav>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <Avatar src="https://picsum.photos/100/100" alt="User" size="md" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">Alex Morgan</p>
              <p className="text-xs text-slate-500 truncate">Pro Member</p>
            </div>
            <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500 transition-colors" title="Logout">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden w-full relative">
        {/* Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <button onClick={toggleSidebar} className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-md">
              <Menu size={24} />
            </button>
            <div className="hidden md:flex items-center bg-slate-100 rounded-lg px-3 py-2 w-64 border border-transparent focus-within:border-brand-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-200 transition-all">
              <Search size={18} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="Search roadmaps, skills..." 
                className="bg-transparent border-none outline-none text-sm ml-2 w-full text-slate-700 placeholder-slate-400"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block"></div>
            <button className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors">
               <span className="hidden sm:inline">Help</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;

```

## `src/components/ui/Common.tsx`

```tsx
import React from 'react';

// --- Types ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  extra?: React.ReactNode;
  hoverable?: boolean;
}

interface BadgeProps {
  children: React.ReactNode;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'gray' | 'indigo';
  className?: string;
}

// --- Components ---

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  isLoading, 
  icon,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-brand-500 hover:bg-brand-600 text-white shadow-sm hover:shadow-md focus:ring-brand-500 border border-transparent",
    secondary: "bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm focus:ring-emerald-500 border border-transparent",
    outline: "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 focus:ring-slate-400",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 focus:ring-slate-400",
    danger: "bg-red-500 hover:bg-red-600 text-white shadow-sm focus:ring-red-500 border border-transparent",
  };

  const sizes = {
    sm: "text-xs px-3 py-1.5 rounded",
    md: "text-sm px-4 py-2 rounded-md",
    lg: "text-base px-6 py-3 rounded-lg",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {!isLoading && icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export const Card: React.FC<CardProps> = ({ children, className = '', title, extra, hoverable = false }) => {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 overflow-hidden ${hoverable ? 'hover:shadow-lg hover:-translate-y-1 transition-all duration-300' : 'shadow-sm'} ${className}`}>
      {(title || extra) && (
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
          {title && <h3 className="text-base font-semibold text-slate-800">{title}</h3>}
          {extra && <div>{extra}</div>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string, error?: string }> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>}
      <input 
        className={`w-full px-3 py-2 bg-white border ${error ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:border-brand-500 focus:ring-brand-200'} rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 transition-all duration-200 ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500 animate-pulse">{error}</p>}
    </div>
  );
};

export const Badge: React.FC<BadgeProps> = ({ children, color = 'blue', className = '' }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-700 ring-blue-600/20",
    green: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    yellow: "bg-amber-50 text-amber-700 ring-amber-600/20",
    red: "bg-red-50 text-red-700 ring-red-600/20",
    gray: "bg-slate-50 text-slate-600 ring-slate-500/10",
    indigo: "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
  };
  
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${colors[color]} ${className}`}>
      {children}
    </span>
  );
};

export const Avatar: React.FC<{ src: string, alt: string, size?: 'sm' | 'md' | 'lg' }> = ({ src, alt, size = 'md' }) => {
  const sizes = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-16 w-16",
  };
  return (
    <img className={`${sizes[size]} rounded-full object-cover border-2 border-white shadow-sm`} src={src} alt={alt} />
  );
};

export const ProgressBar: React.FC<{ progress: number, color?: string, height?: string }> = ({ progress, color = 'bg-brand-500', height = 'h-2' }) => {
  return (
    <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${height}`}>
      <div 
        className={`${color} ${height} rounded-full transition-all duration-1000 ease-out`} 
        style={{ width: `${progress}%` }} 
      />
    </div>
  );
};
```

## `src/index.css`

```css
body {
  background-color: #f8fafc; /* Slate-50: A modern, clean backdrop */
  margin: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Smooth scrolling for the whole app */
html {
  scroll-behavior: smooth;
}


:root {
  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a {
  font-weight: 500;
  color: #646cff;
  text-decoration: inherit;
}
a:hover {
  color: #535bf2;
}

body {
  margin: 0;
  /* display: flex; */
  /* place-items: center; */
  min-width: 320px;
  min-height: 100vh;
}

h1 {
  font-size: 3.2em;
  line-height: 1.1;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  /* background-color: #1a1a1a; */
  cursor: pointer;
  transition: border-color 0.25s;
}
button:hover {
  border-color: #646cff;
}
button:focus,
button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}

@media (prefers-color-scheme: light) {
  :root {
    color: #213547;
    background-color: #ffffff;
  }
  a:hover {
    color: #747bff;
  }
  button {
    background-color: #f9f9f9;
  }
}

```

## `src/index.tsx`

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Polyfill storage to prevent SecurityError in restricted environments (e.g. sandboxed iframes)
try {
  const x = window.localStorage;
  const y = window.sessionStorage;
} catch (e) {
  const noopStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
    clear: () => {},
    length: 0,
    key: () => null,
  };
  try {
    Object.defineProperty(window, 'localStorage', { value: noopStorage });
    Object.defineProperty(window, 'sessionStorage', { value: noopStorage });
  } catch (err) {
    console.warn('Failed to polyfill storage', err);
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

## `src/main.tsx`

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

```

## `src/pages/Admin.tsx`

```tsx
import { Card, Badge } from "../components/ui/Common";
import { Users, BookOpen, Activity } from "lucide-react";

const Admin = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-500 mt-1">
          System overview and activity monitoring.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          { label: "Users", value: "1,248", icon: <Users /> },
          { label: "Active Learners", value: "312", icon: <Activity /> },
          { label: "Modules", value: "86", icon: <BookOpen /> },
          { label: "Completion Rate", value: "74%", icon: <Activity /> },
        ].map((s, i) => (
          <Card key={i}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{s.label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {s.value}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
                {s.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Activity */}
      <Card title="Recent Activity">
        <div className="space-y-3">
          {[
            "User A completed React Patterns",
            "User B updated CV",
            "New module added: UX Basics",
          ].map((a, i) => (
            <div
              key={i}
              className="flex items-center justify-between text-sm p-3 rounded-lg border border-slate-200 bg-slate-50"
            >
              <span className="text-slate-700">{a}</span>
              <Badge color="gray">log</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Admin;

```

## `src/pages/Analytics.tsx`

```tsx
import React from 'react';
import { Card } from '../components/ui/Common';
import { 
  LineChart, Line, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const Analytics = () => {
  const activityData = [
    { name: 'Mon', study: 4, practice: 2 },
    { name: 'Tue', study: 3, practice: 1 },
    { name: 'Wed', study: 5, practice: 3 },
    { name: 'Thu', study: 2, practice: 4 },
    { name: 'Fri', study: 4, practice: 3 },
    { name: 'Sat', study: 6, practice: 5 },
    { name: 'Sun', study: 3, practice: 2 },
  ];

  const skillData = [
    { subject: 'React', A: 120, fullMark: 150 },
    { subject: 'TypeScript', A: 98, fullMark: 150 },
    { subject: 'Node.js', A: 86, fullMark: 150 },
    { subject: 'Design', A: 99, fullMark: 150 },
    { subject: 'Testing', A: 85, fullMark: 150 },
    { subject: 'DevOps', A: 65, fullMark: 150 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Performance Analytics</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Study vs Practice Hours">
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                   cursor={{fill: '#f1f5f9'}}
                   contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="study" fill="#6366f1" radius={[4, 4, 0, 0]} stackId="a" />
                <Bar dataKey="practice" fill="#10b981" radius={[4, 4, 0, 0]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Skill Radar">
          <div className="h-80 w-full flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                <Radar
                  name="Skills"
                  dataKey="A"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fill="#8b5cf6"
                  fillOpacity={0.4}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        <Card title="Learning Consistency" className="lg:col-span-2">
           <div className="h-64 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <LineChart data={activityData}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} />
                 <YAxis axisLine={false} tickLine={false} />
                 <Tooltip />
                 <Line type="monotone" dataKey="study" stroke="#6366f1" strokeWidth={3} dot={{r: 4, fill: '#6366f1'}} activeDot={{r: 6}} />
               </LineChart>
             </ResponsiveContainer>
           </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;

```

## `src/pages/CV.tsx`

```tsx
import { Card, Button, ProgressBar, Badge } from "../components/ui/Common";
import { FileText, Sparkles, Download } from "lucide-react";

const CV = () => {
  const completeness = 65;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Resume</h1>
          <p className="text-slate-500 mt-1">
            Build and improve your professional profile.
          </p>
        </div>
        <Button icon={<Download size={16} />}>Export PDF</Button>
      </div>

      {/* Progress */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <FileText className="text-brand-600" />
            <p className="font-semibold text-slate-900">Profile Completeness</p>
          </div>
          <span className="font-bold text-slate-900">{completeness}%</span>
        </div>
        <ProgressBar progress={completeness} />
      </Card>

      {/* Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Summary">
          <p className="text-slate-600">
            Short professional summary goes here. Add your goals, strengths,
            and current focus.
          </p>
          <Button variant="outline" size="sm" className="mt-4">
            Edit
          </Button>
        </Card>

        <Card title="Skills">
          <div className="flex flex-wrap gap-2">
            {["React", "Node.js", "SQL", "System Design"].map((s) => (
              <Badge key={s} color="blue">
                {s}
              </Badge>
            ))}
          </div>
          <Button variant="outline" size="sm" className="mt-4">
            Manage Skills
          </Button>
        </Card>

        <Card title="Experience">
          <p className="text-slate-600">
            No experience added yet. Start by adding your first role.
          </p>
          <Button size="sm" className="mt-4">
            Add Experience
          </Button>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white">
          <Badge color="indigo">AI Assist</Badge>
          <h3 className="font-bold text-lg mt-2">Improve with AI</h3>
          <p className="text-indigo-200 text-sm mt-1">
            Let Lumina rewrite your CV for clarity and impact.
          </p>
          <Button className="mt-4 bg-white text-indigo-900 border-none">
            <Sparkles size={16} className="mr-2" />
            Enhance CV
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default CV;

```

## `src/pages/Calendar.tsx`

```tsx
import { Card, Button, Badge } from "../components/ui/Common";
import { CalendarDays, Clock, Sparkles } from "lucide-react";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const Calendar = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Calendar</h1>
          <p className="text-slate-500 mt-1">
            Plan your learning sessions and stay consistent.
          </p>
        </div>
        <Button icon={<Sparkles size={16} />}>AI Schedule</Button>
      </div>

      {/* Week View */}
      <Card title="This Week">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
          {days.map((d, i) => (
            <div
              key={d}
              className={`rounded-xl border p-4 text-center ${
                i === 2
                  ? "border-brand-300 bg-brand-50"
                  : "border-slate-200 bg-white"
              }`}
            >
              <p className="text-sm font-semibold text-slate-600">{d}</p>
              <p className="text-xl font-bold text-slate-900 mt-1">{10 + i}</p>

              {i === 2 && (
                <Badge color="indigo" className="mt-2">
                  Today
                </Badge>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Study Blocks */}
      <Card title="Scheduled Sessions">
        <div className="space-y-3">
          {[
            { title: "React Patterns", time: "09:00 – 10:00" },
            { title: "System Design", time: "14:00 – 15:30" },
          ].map((s, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 rounded-lg border border-slate-200 bg-slate-50"
            >
              <div className="flex items-center gap-3">
                <Clock className="text-slate-400" size={18} />
                <div>
                  <p className="font-semibold text-slate-800">{s.title}</p>
                  <p className="text-sm text-slate-500">{s.time}</p>
                </div>
              </div>
              <Button size="sm" variant="outline">
                Open
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Calendar;

```

## `src/pages/Dashboard.tsx`

```tsx
import React from 'react';
import { Card, Button, Badge, ProgressBar, Avatar } from '../components/ui/Common';
import { 
  TrendingUp, 
  Clock, 
  Award, 
  Target, 
  ArrowRight,
  MoreHorizontal,
  Calendar,
  Video
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const data = [
  { name: 'Mon', hours: 2 },
  { name: 'Tue', hours: 3.5 },
  { name: 'Wed', hours: 1.5 },
  { name: 'Thu', hours: 4 },
  { name: 'Fri', hours: 3 },
  { name: 'Sat', hours: 5 },
  { name: 'Sun', hours: 4.5 },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">Welcome back, Alex! You've learned for 32 hours this week.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" icon={<Calendar size={16} />}>Schedule</Button>
          <Button>Resume Learning</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Weekly Progress', value: '85%', icon: <TrendingUp className="text-emerald-500" />, change: '+12%', color: 'emerald' },
          { label: 'Time Spent', value: '32h', icon: <Clock className="text-brand-500" />, change: '+4h', color: 'brand' },
          { label: 'Modules Finished', value: '12', icon: <Target className="text-amber-500" />, change: '2 pending', color: 'amber' },
          { label: 'Certificates', value: '4', icon: <Award className="text-purple-500" />, change: 'New!', color: 'purple' },
        ].map((stat, i) => (
          <Card key={i} className="flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
              </div>
              <div className={`p-2 rounded-lg bg-${stat.color}-50`}>
                {stat.icon}
              </div>
            </div>
            <div className="text-xs text-slate-500">
              <span className="text-emerald-600 font-medium">{stat.change}</span> from last week
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <div className="lg:col-span-2">
          <Card title="Learning Activity" className="h-full">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Area type="monotone" dataKey="hours" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Current Course Progress */}
        <div className="space-y-6">
          <Card title="Continue Learning" extra={<Button variant="ghost" size="sm">View All</Button>}>
             <div className="space-y-6">
                {[
                  { title: "Advanced React Patterns", progress: 75, module: "Higher-Order Components", img: "https://picsum.photos/200/200?random=1" },
                  { title: "System Design Interview", progress: 30, module: "Load Balancing", img: "https://picsum.photos/200/200?random=2" },
                  { title: "UI/UX Fundamentals", progress: 90, module: "Color Theory", img: "https://picsum.photos/200/200?random=3" }
                ].map((course, i) => (
                  <div key={i} className="group cursor-pointer">
                    <div className="flex gap-4 mb-3">
                      <img src={course.img} alt={course.title} className="w-16 h-16 rounded-lg object-cover shadow-sm group-hover:shadow-md transition-shadow" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-slate-900 truncate group-hover:text-brand-600 transition-colors">{course.title}</h4>
                        <p className="text-xs text-slate-500 mb-2 truncate">{course.module}</p>
                        <ProgressBar progress={course.progress} height="h-1.5" />
                      </div>
                    </div>
                  </div>
                ))}
             </div>
             <Button variant="outline" className="w-full mt-4" icon={<ArrowRight size={14} />}>Go to Current Module</Button>
          </Card>
          
          <Card className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white border-none">
            <div className="flex items-start justify-between">
              <div>
                <Badge color="indigo">Pro Tip</Badge>
                <h3 className="text-lg font-bold mt-2">Practice Makes Perfect</h3>
                <p className="text-indigo-200 text-sm mt-1 mb-4">Try the AI interview simulator to test your knowledge.</p>
                <Button size="sm" className="bg-white text-indigo-900 hover:bg-indigo-50 border-none">Start Practice</Button>
              </div>
              <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                <Video className="text-white" size={24} />
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      {/* Recommended Roadmaps */}
       <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
           <h2 className="text-lg font-bold text-slate-900">Recommended for You</h2>
           <Button variant="ghost" size="sm">Explore All</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {[1, 2, 3].map((i) => (
             <Card key={i} hoverable className="p-0 overflow-hidden">
                <div className="h-32 bg-slate-200 relative">
                   <img src={`https://picsum.photos/400/200?random=${10+i}`} className="w-full h-full object-cover" alt="Course" />
                   <div className="absolute top-3 right-3">
                     <Badge color="gray" className="shadow-sm">Beginner</Badge>
                   </div>
                </div>
                <div className="p-5">
                   <div className="flex items-center gap-2 mb-2 text-xs text-slate-500">
                      <Avatar src={`https://picsum.photos/30/30?random=${i}`} alt="Instructor" size="sm" />
                      <span>Sarah Drasner</span>
                      <span className="mx-1">•</span>
                      <span>4h 30m</span>
                   </div>
                   <h3 className="font-bold text-slate-900 mb-1">Fullstack Serverless GraphQL</h3>
                   <p className="text-sm text-slate-500 mb-4 line-clamp-2">Learn to build scalable apps with AWS Lambda, DynamoDB and Apollo.</p>
                   <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center text-amber-400 text-xs font-bold">
                         ★★★★★ <span className="text-slate-400 ml-1 font-normal">(420)</span>
                      </div>
                      <Button variant="outline" size="sm">Preview</Button>
                   </div>
                </div>
             </Card>
           ))}
        </div>
       </div>
    </div>
  );
};

export default Dashboard;
```

## `src/pages/Interview.tsx`

```tsx
import React, { useState, useEffect } from 'react';
import { Card, Button } from '../components/ui/Common';
import { Mic, MicOff, Square, Play, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { generateInterviewFeedback } from '../services/gemini';
import { InterviewFeedback } from '../types';
import { 
  RadialBarChart, 
  RadialBar, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

const Interview = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);

  const questions = [
    "Tell me about a challenging technical problem you solved recently.",
    "Explain the concept of closures in JavaScript.",
    "How do you handle state management in a large React application?",
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => setTimer(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const toggleRecording = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      handleSubmission();
    } else {
      // Start recording
      setIsRecording(true);
      setTranscript("");
      setFeedback(null);
      setTimer(0);
      // Simulate real-time transcription
      simulateTranscription();
    }
  };

  const simulateTranscription = () => {
    const words = "I recently worked on optimizing a large-scale data visualization dashboard. The main challenge was rendering thousands of data points without blocking the main thread. I implemented a virtualization strategy using react-window and moved data processing to a Web Worker. This reduced the initial load time by 40% and improved frame rates significantly during interactions.".split(" ");
    let i = 0;
    const interval = setInterval(() => {
      if (!isRecording && i >= words.length) clearInterval(interval);
      setTranscript(prev => prev + (prev ? " " : "") + (words[i] || ""));
      i++;
      if (i >= words.length) clearInterval(interval);
    }, 500);
  };

  const handleSubmission = async () => {
    setIsProcessing(true);
    const result = await generateInterviewFeedback(questions[questionIndex], transcript || "User provided answer...");
    setFeedback(result);
    setIsProcessing(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const scoreData = feedback ? [
    { name: 'Score', uv: feedback.score, fill: '#6366f1' },
    { name: 'Max', uv: 100, fill: '#e2e8f0' }
  ] : [];

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-6">
      {/* Left Panel - Interview Interface */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 flex-1 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-slate-100">
             <div className="h-full bg-brand-500 transition-all duration-300" style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }}></div>
          </div>
          
          <span className="text-xs font-bold tracking-wider text-slate-400 uppercase mb-4">Question {questionIndex + 1} of {questions.length}</span>
          <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-900 mb-12 max-w-2xl leading-relaxed">
            {questions[questionIndex]}
          </h2>

          <div className="flex flex-col items-center gap-6">
             {/* Audio Visualizer Placeholder */}
             <div className="h-16 flex items-center gap-1">
                {[...Array(20)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-1.5 bg-brand-500 rounded-full transition-all duration-75 ${isRecording ? 'animate-pulse' : 'h-2 bg-slate-200'}`}
                    style={{ height: isRecording ? `${Math.random() * 40 + 10}px` : '4px' }}
                  ></div>
                ))}
             </div>

             <div className="text-4xl font-mono font-medium text-slate-700 tabular-nums">
               {formatTime(timer)}
             </div>

             <button 
                onClick={toggleRecording}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
                  isRecording 
                    ? 'bg-red-500 hover:bg-red-600 ring-4 ring-red-100 scale-110' 
                    : 'bg-brand-600 hover:bg-brand-700 hover:-translate-y-1'
                }`}
             >
                {isRecording ? <Square className="text-white fill-white" size={24} /> : <Mic className="text-white" size={32} />}
             </button>
             <p className="text-slate-500 text-sm">
               {isRecording ? 'Recording your answer...' : 'Click microphone to start'}
             </p>
          </div>
        </div>

        {/* Transcript Area */}
        <Card className="h-48 overflow-y-auto bg-slate-50">
           <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">Live Transcript</h3>
           <p className="text-slate-700 leading-relaxed font-mono text-sm">
             {transcript || <span className="text-slate-400 italic">Your speech will appear here...</span>}
           </p>
        </Card>
      </div>

      {/* Right Panel - Feedback */}
      <div className={`w-full lg:w-96 flex flex-col transition-all duration-500 ${feedback ? 'opacity-100 translate-x-0' : 'opacity-50 lg:translate-x-4 grayscale'}`}>
         {isProcessing ? (
           <Card className="flex-1 flex flex-col items-center justify-center">
             <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mb-4"></div>
             <p className="text-slate-600 font-medium">Analyzing your response...</p>
             <p className="text-slate-400 text-sm mt-2">Checking technical accuracy and clarity</p>
           </Card>
         ) : feedback ? (
           <div className="space-y-4 h-full overflow-y-auto">
             <Card className="text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"></div>
                <h3 className="text-slate-500 font-medium text-sm uppercase tracking-wide mb-2">Confidence Score</h3>
                <div className="h-48 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart innerRadius="60%" outerRadius="100%" data={scoreData} startAngle={180} endAngle={0} cy="70%">
                      <RadialBar label={{ position: 'insideStart', fill: '#fff' }} background dataKey="uv" cornerRadius={10} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center pt-8">
                     <span className="text-4xl font-bold text-slate-900">{feedback.score}</span>
                  </div>
                </div>
             </Card>

             <Card title="AI Feedback" className="flex-1">
               <p className="text-slate-600 text-sm mb-4 leading-relaxed">{feedback.summary}</p>
               
               <div className="space-y-4">
                 <div>
                   <h4 className="flex items-center text-emerald-600 font-semibold text-sm mb-2">
                     <CheckCircle2 size={16} className="mr-2" /> Strengths
                   </h4>
                   <ul className="text-sm text-slate-600 space-y-1 pl-6 list-disc marker:text-emerald-300">
                     {feedback.strengths.map((s, i) => <li key={i}>{s}</li>)}
                   </ul>
                 </div>
                 
                 <div>
                   <h4 className="flex items-center text-amber-600 font-semibold text-sm mb-2">
                     <AlertCircle size={16} className="mr-2" /> Areas for Improvement
                   </h4>
                   <ul className="text-sm text-slate-600 space-y-1 pl-6 list-disc marker:text-amber-300">
                     {feedback.improvements.map((s, i) => <li key={i}>{s}</li>)}
                   </ul>
                 </div>
               </div>
             </Card>

             <Button 
               className="w-full" 
               variant="outline" 
               icon={<RefreshCw size={16} />}
               onClick={() => {
                 setFeedback(null);
                 setTranscript("");
                 setQuestionIndex((prev) => (prev + 1) % questions.length);
               }}
             >
               Next Question
             </Button>
           </div>
         ) : (
            <div className="flex-1 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 p-8 text-center bg-slate-50/50">
               <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                  <Play className="ml-1 text-slate-300" />
               </div>
               <p className="font-medium text-slate-500">Ready for feedback?</p>
               <p className="text-sm mt-1">Record your answer to get instant AI analysis on your performance.</p>
            </div>
         )}
      </div>
    </div>
  );
};

export default Interview;
```

## `src/pages/Learning.tsx`

```tsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Badge,
  ProgressBar,
  Input,
  Avatar,
} from "../components/ui/Common";
import {
  BookOpen,
  Play,
  Filter,
  Search,
  Clock,
  Sparkles,
  ArrowRight,
} from "lucide-react";

type LearningItem = {
  id: string;
  title: string;
  subtitle: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  category: "Frontend" | "Backend" | "Design" | "Interview";
  progress: number;
  eta: string;
  lessonsDone: number;
  lessonsTotal: number;
  lastTouched: string;
  cover: string;
  instructorName: string;
  instructorAvatar: string;
};

const Learning = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] =
    useState<LearningItem["category"] | "All">("All");
  const [activeLevel, setActiveLevel] =
    useState<LearningItem["level"] | "All">("All");

  const items: LearningItem[] = useMemo(
    () => [
      {
        id: "react-patterns",
        title: "Advanced React Patterns",
        subtitle: "HOCs, Render Props, Compound Components",
        level: "Advanced",
        category: "Frontend",
        progress: 72,
        eta: "2h 10m",
        lessonsDone: 18,
        lessonsTotal: 25,
        lastTouched: "Yesterday",
        cover: "https://picsum.photos/900/500?random=31",
        instructorName: "Sarah Drasner",
        instructorAvatar: "https://picsum.photos/80/80?random=131",
      },
      {
        id: "system-design",
        title: "System Design Interview",
        subtitle: "Load balancing, caching, partitioning",
        level: "Intermediate",
        category: "Interview",
        progress: 34,
        eta: "4h 20m",
        lessonsDone: 6,
        lessonsTotal: 18,
        lastTouched: "2 days ago",
        cover: "https://picsum.photos/900/500?random=32",
        instructorName: "Alex Xu",
        instructorAvatar: "https://picsum.photos/80/80?random=132",
      },
      {
        id: "ux-fundamentals",
        title: "UI/UX Fundamentals",
        subtitle: "Typography, spacing, visual hierarchy",
        level: "Beginner",
        category: "Design",
        progress: 90,
        eta: "45m",
        lessonsDone: 9,
        lessonsTotal: 10,
        lastTouched: "Today",
        cover: "https://picsum.photos/900/500?random=33",
        instructorName: "Mia Chen",
        instructorAvatar: "https://picsum.photos/80/80?random=133",
      },
      {
        id: "node-api",
        title: "Node API Essentials",
        subtitle: "REST patterns, auth, pagination",
        level: "Intermediate",
        category: "Backend",
        progress: 12,
        eta: "6h 10m",
        lessonsDone: 2,
        lessonsTotal: 16,
        lastTouched: "Last week",
        cover: "https://picsum.photos/900/500?random=34",
        instructorName: "Kent C. Dodds",
        instructorAvatar: "https://picsum.photos/80/80?random=134",
      },
    ],
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((it) => {
      const matchesQuery =
        !q ||
        it.title.toLowerCase().includes(q) ||
        it.subtitle.toLowerCase().includes(q) ||
        it.category.toLowerCase().includes(q) ||
        it.level.toLowerCase().includes(q);

      const matchesCategory =
        activeCategory === "All" || it.category === activeCategory;
      const matchesLevel =
        activeLevel === "All" || it.level === activeLevel;

      return matchesQuery && matchesCategory && matchesLevel;
    });
  }, [items, query, activeCategory, activeLevel]);

  const resumeCandidate = useMemo(() => {
    const ongoing = items
      .filter((x) => x.progress < 100)
      .sort((a, b) => b.progress - a.progress);
    return ongoing[0] || items[0];
  }, [items]);

  const categories: Array<LearningItem["category"]> = [
    "Frontend",
    "Backend",
    "Design",
    "Interview",
  ];
  const levels: Array<LearningItem["level"]> = [
    "Beginner",
    "Intermediate",
    "Advanced",
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Learning</h1>
          <p className="text-slate-500 mt-1">
            Track your active modules, pick up where you left off, and keep
            momentum.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="border-slate-300 text-slate-700 hover:border-brand-400 hover:text-brand-600 hover:bg-brand-50"
            icon={<BookOpen size={16} />}
            onClick={() => {
              setQuery("");
              setActiveCategory("All");
              setActiveLevel("All");
            }}
          >
            Browse All
          </Button>

          <Button
            className="bg-brand-500 hover:bg-brand-600 text-white shadow-sm"
            icon={<Play size={16} />}
            onClick={() => navigate(`/learning/${resumeCandidate.id}`)}
          >
            Resume
          </Button>
        </div>
      </div>

      {/* Resume Card + Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-0 overflow-hidden">
          {/*<div className="relative h-56">*/}
          <div className="relative h-[390px] md:h-[450px] lg:h-[500px]">
            <img
              src={resumeCandidate.cover}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 to-transparent" />

            <div className="absolute bottom-4 left-4 right-4">
              <h2 className="text-white text-2xl font-bold drop-shadow-lg">
                {resumeCandidate.title}
              </h2>
              <p className="text-white text-sm mt-1 drop-shadow-md">
                {resumeCandidate.subtitle}
              </p>

              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-2 text-white text-sm drop-shadow">
                  <span className="font-semibold">{resumeCandidate.progress}%</span>
                  <span className="text-white/80">·</span>
                  <span className="text-white/90">{resumeCandidate.lessonsDone} / {resumeCandidate.lessonsTotal} lessons</span>
                  <span className="text-white/80">·</span>
                  <span className="text-white/90">{resumeCandidate.eta} left</span>
                </div>
                <ProgressBar
                  progress={resumeCandidate.progress}
                  className="bg-white/30"
                  barClassName="bg-white shadow-lg"
                />
                <div className="flex gap-3">
                  <Button
                    className="text-slate-900 shadow-xl font-semibold flex-1"
                    icon={<Play size={16} />}
                    onClick={() =>
                      navigate(`/learning/${resumeCandidate.id}`)
                    }
                  >
                    Continue Learning
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
                    icon={<BookOpen size={16} />}
                    onClick={() =>
                      navigate(`/learning/${resumeCandidate.id}`)
                    }
                  >
                    Details
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Filters */}
        <Card title="Filters">
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-semibold text-slate-700">
              <Filter size={16} />
              Refine results
            </div>

            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search modules..."
            />

            {/* Category */}
            <div>
              <p className="text-xs font-semibold text-slate-400 mb-2">
                CATEGORY
              </p>
              <div className="flex flex-wrap gap-2">
                {["All", ...categories].map((c) => (
                  <button
                    key={c}
                    onClick={() =>
                      setActiveCategory(c as any)
                    }
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                      activeCategory === c
                        ? "bg-brand-100 text-brand-700 ring-1 ring-brand-300 shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Level */}
            <div>
              <p className="text-xs font-semibold text-slate-400 mb-2">
                LEVEL
              </p>
              <div className="flex flex-wrap gap-2">
                {["All", ...levels].map((l) => (
                  <button
                    key={l}
                    onClick={() =>
                      setActiveLevel(l as any)
                    }
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                      activeLevel === l
                        ? "bg-brand-100 text-brand-700 ring-1 ring-brand-300 shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Card */}
            <div className="rounded-xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-4">
              <Badge color="indigo">AI Assist</Badge>
              <h3 className="font-bold mt-2">Keep a streak</h3>
              <p className="text-indigo-200 text-sm mt-1">
                Set a 20-minute daily focus block.
              </p>
              <Button className="mt-4 text-indigo-900">
                Suggest schedule
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Active Modules */}
      <h2 className="text-lg font-bold text-slate-900">
        Active Modules
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((it) => (
          <Card key={it.id} className="p-0 overflow-hidden">
            <img
              src={it.cover}
              className="h-32 w-full object-cover"
            />

            <div className="p-5">
              <h3 className="font-bold text-slate-900">
                {it.title}
              </h3>
              <p className="text-sm text-slate-500 mb-3">
                {it.subtitle}
              </p>

              <ProgressBar
                progress={it.progress}
                className="bg-slate-200"
                barClassName="bg-brand-500"
              />

              <div className="mt-4 flex justify-between">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-slate-300 hover:border-brand-400 hover:text-brand-600"
                  onClick={() =>
                    navigate(`/learning/${it.id}`)
                  }
                >
                  Open
                </Button>

                <Button
                  size="sm"
                  className="bg-brand-500 hover:bg-brand-600 text-white"
                  onClick={() =>
                    navigate(`/learning/${it.id}`)
                  }
                >
                  Continue
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Learning;

```

## `src/pages/LearningModule.tsx`

```tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Button, Badge, ProgressBar } from "../components/ui/Common";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  BookOpen,
  Code2,
  Video,
  FileText,
  Sparkles,
  MessageSquare,
  UploadCloud,
  ChevronUp,
} from "lucide-react";

type Section = {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
};

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

const LearningModule = () => {
  const navigate = useNavigate();
  const { moduleId } = useParams<{ moduleId: string }>();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [showChat, setShowChat] = useState(false);

  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    watch: false,
    read: true,
    code: false,
    exercise: false,
  });

  const progress = useMemo(() => {
    const vals = Object.values(checklist);
    const done = vals.filter(Boolean).length;
    return Math.round((done / vals.length) * 100);
  }, [checklist]);

  const title = useMemo(() => {
    const pretty = (moduleId || "module").replace(/[-_]/g, " ");
    return pretty.replace(/\b\w/g, (m) => m.toUpperCase());
  }, [moduleId]);

  const sections: Section[] = useMemo(
    () => [
      {
        id: "overview",
        title: "Overview",
        icon: <BookOpen size={16} className="text-slate-500" />,
        content: (
          <div className="space-y-4">
            <p className="text-slate-600 leading-relaxed">
              In this module, you’ll learn the core concepts, then reinforce them with a small hands-on exercise.
              Use the checklist to track completion and jump between sections using the table of contents.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Estimated time</p>
                <p className="text-lg font-bold text-slate-900 mt-1">45–60 min</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Difficulty</p>
                <p className="text-lg font-bold text-slate-900 mt-1">Intermediate</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Learning goal</p>
                <p className="text-lg font-bold text-slate-900 mt-1">Build intuition + practice</p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Badge color="indigo">AI Hint</Badge>
                  <h3 className="font-bold text-lg mt-2">Ask “why” before “how”</h3>
                  <p className="text-indigo-200 text-sm mt-1">
                    If you understand the trade-offs, implementation details become much easier to memorize.
                  </p>
                </div>
                <div className="bg-white/10 p-2 rounded-lg">
                  <Sparkles size={20} />
                </div>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "video",
        title: "Video Lesson",
        icon: <Video size={16} className="text-slate-500" />,
        content: (
          <div className="space-y-4">
            <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-900 relative">
              <div className="aspect-video w-full flex items-center justify-center">
                <div className="text-center px-6">
                  <div className="mx-auto w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mb-3">
                    <Video className="text-white" />
                  </div>
                  <p className="text-white font-semibold">Embedded video placeholder</p>
                  <p className="text-white/60 text-sm mt-1">
                    Hook up your player later; layout and styling already match the template.
                  </p>
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                <div className="h-1.5 bg-white/15 rounded-full overflow-hidden">
                  <div className="h-1.5 bg-brand-500 rounded-full w-[35%]"></div>
                </div>
                <div className="flex items-center justify-between mt-2 text-xs text-white/70">
                  <span>12:10</span>
                  <span>34:20</span>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => setChecklist((p) => ({ ...p, watch: !p.watch }))}
              icon={checklist.watch ? <CheckCircle2 size={16} /> : <Circle size={16} />}
            >
              Mark video as {checklist.watch ? "incomplete" : "complete"}
            </Button>
          </div>
        ),
      },
      {
        id: "reading",
        title: "Reading Notes",
        icon: <FileText size={16} className="text-slate-500" />,
        content: (
          <div className="space-y-4">
            <div className="prose prose-slate max-w-none">
              <h3 className="text-slate-900">Key ideas</h3>
              <ul className="text-slate-700">
                <li>Focus on constraints first (time, space, correctness).</li>
                <li>Choose the simplest approach that satisfies requirements.</li>
                <li>Make trade-offs explicit and test assumptions early.</li>
              </ul>
              <h3 className="text-slate-900">Mini takeaway</h3>
              <p className="text-slate-700">
                Good solutions are rarely “perfect”—they are <b>appropriate</b> given the context.
              </p>
            </div>

            <Button
              variant="outline"
              onClick={() => setChecklist((p) => ({ ...p, read: !p.read }))}
              icon={checklist.read ? <CheckCircle2 size={16} /> : <Circle size={16} />}
            >
              Mark reading as {checklist.read ? "incomplete" : "complete"}
            </Button>
          </div>
        ),
      },
      {
        id: "code",
        title: "Code Walkthrough",
        icon: <Code2 size={16} className="text-slate-500" />,
        content: (
          <div className="space-y-4">
            <p className="text-slate-600 leading-relaxed">
              This is a styled code block matching Lumina’s brand palette and typography.
              Swap in a real editor later if needed.
            </p>

            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Example</span>
                <Badge color="gray">TypeScript</Badge>
              </div>
              <pre className="p-4 bg-slate-900 text-slate-100 text-sm overflow-x-auto font-mono leading-relaxed">
{`type Result<T> = { ok: true; value: T } | { ok: false; error: string };

export function safeParseNumber(input: string): Result<number> {
  const n = Number(input);
  if (Number.isNaN(n)) return { ok: false, error: "Not a number" };
  return { ok: true, value: n };
}`}
              </pre>
            </div>

            <Button
              variant="outline"
              onClick={() => setChecklist((p) => ({ ...p, code: !p.code }))}
              icon={checklist.code ? <CheckCircle2 size={16} /> : <Circle size={16} />}
            >
              Mark code walkthrough as {checklist.code ? "incomplete" : "complete"}
            </Button>
          </div>
        ),
      },
      {
        id: "exercise",
        title: "Exercise",
        icon: <BookOpen size={16} className="text-slate-500" />,
        content: (
          <div className="space-y-4">
            <Card title="Task: Implement a small helper" className="bg-slate-50">
              <p className="text-slate-700 leading-relaxed">
                Create a helper that validates input and returns a typed result. Include one unit test case.
              </p>

              <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Requirements</p>
                  <ul className="mt-2 text-sm text-slate-700 list-disc pl-5 space-y-1">
                    <li>Return a discriminated union result</li>
                    <li>Handle invalid input</li>
                    <li>Include one example test</li>
                  </ul>
                </div>

                <div className="rounded-xl border-2 border-dashed border-slate-200 bg-white p-4 flex items-center justify-center text-center">
                  <div className="max-w-xs">
                    <div className="mx-auto w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                      <UploadCloud className="text-slate-400" />
                    </div>
                    <p className="text-sm font-semibold text-slate-700">Submission placeholder</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Plug in drag & drop upload or a form later—this keeps the UI consistent.
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Button
              onClick={() => setChecklist((p) => ({ ...p, exercise: !p.exercise }))}
              icon={checklist.exercise ? <CheckCircle2 size={16} /> : <Circle size={16} />}
            >
              Mark exercise as {checklist.exercise ? "incomplete" : "complete"}
            </Button>
          </div>
        ),
      },
    ],
    [checklist]
  );

  // Smooth scroll to section + active section highlight
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const elements = sections.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    if (elements.length === 0) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))[0];
        if (visible?.target?.id) setActiveSection(visible.target.id);
      },
      { root: null, threshold: [0.2, 0.35, 0.5] }
    );

    elements.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [sections]);

  const onJump = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const checklistItems = useMemo(
    () => [
      { key: "read", label: "Read notes" },
      { key: "watch", label: "Watch lesson" },
      { key: "code", label: "Follow code walkthrough" },
      { key: "exercise", label: "Complete exercise" },
    ],
    []
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" ref={containerRef}>
      {/* Main content */}
      <div className="lg:col-span-8 xl:col-span-9 space-y-6">
        {/* Top bar */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <button
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-brand-600 transition-colors"
              onClick={() => navigate("/learning")}
            >
              <ArrowLeft size={16} />
              Back to My Learning
            </button>

            <h1 className="text-2xl font-bold text-slate-900 mt-2">{title}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge color="gray">Module</Badge>
              <Badge color="blue">Interactive</Badge>
              <Badge color="indigo">Brand: Lumina</Badge>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              icon={<MessageSquare size={16} />}
              onClick={() => setShowChat((s) => !s)}
            >
              {showChat ? "Hide" : "AI Chat"}
            </Button>
            <Button onClick={() => onJump("exercise")}>Go to Exercise</Button>
          </div>
        </div>

        {/* Progress strip */}
        <Card className="p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center ring-1 ring-brand-200">
                <BookOpen className="text-brand-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Module progress</p>
                <p className="text-xs text-slate-500">Complete checklist items to finish this module.</p>
              </div>
            </div>
            <div className="text-sm font-bold text-slate-900 tabular-nums">{progress}%</div>
          </div>
          <div className="p-6">
            <ProgressBar progress={progress} height="h-2.5" />
          </div>
        </Card>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((s) => (
            <div
              key={s.id}
              id={s.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {s.icon}
                  <h2 className="text-base font-semibold text-slate-900">{s.title}</h2>
                </div>
                <div className="h-1 w-24 bg-gradient-to-r from-brand-500 to-indigo-500 rounded-full opacity-60" />
              </div>
              <div className="p-6">{s.content}</div>
            </div>
          ))}
        </div>

        {/* Back to top */}
        <div className="flex justify-center pt-2">
          <Button variant="ghost" icon={<ChevronUp size={16} />} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            Back to top
          </Button>
        </div>
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-4 xl:col-span-3 space-y-6">
        {/* TOC */}
        <Card title="Contents">
          <div className="space-y-1">
            {sections.map((s) => {
              const isActive = activeSection === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => onJump(s.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-brand-50 text-brand-600 ring-1 ring-brand-200"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span className="flex-none">{s.icon}</span>
                  <span className="truncate">{s.title}</span>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Checklist */}
        <Card title="Checklist">
          <div className="space-y-2">
            {checklistItems.map((it) => {
              const checked = !!checklist[it.key];
              return (
                <button
                  key={it.key}
                  onClick={() => setChecklist((p) => ({ ...p, [it.key]: !p[it.key] }))}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
                >
                  <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    {checked ? (
                      <CheckCircle2 size={18} className="text-emerald-600" />
                    ) : (
                      <Circle size={18} className="text-slate-300" />
                    )}
                    {it.label}
                  </span>
                  <span className={`text-xs font-bold ${checked ? "text-emerald-600" : "text-slate-400"}`}>
                    {checked ? "Done" : "Todo"}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200 p-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tip</p>
            <p className="text-sm text-slate-700 mt-1">
              Use the TOC to jump between sections and keep your flow.
            </p>
          </div>
        </Card>

        {/* AI chat panel placeholder */}
        {showChat ? (
          <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Badge color="indigo">AI Assistant</Badge>
                <h3 className="font-bold text-lg mt-2">Ask about this module</h3>
                <p className="text-indigo-200 text-sm mt-1">
                  This is a UI placeholder. Wire it to your assistant endpoint later.
                </p>
              </div>
              <div className="bg-white/10 p-2 rounded-lg">
                <Sparkles size={20} />
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-white/10 border border-white/10 p-3 text-sm text-white/80">
              Try: “Summarize the key trade-offs from the reading notes.”
            </div>

            <Button
              size="sm"
              className="mt-4 bg-white text-indigo-900 hover:bg-indigo-50 border-none"
              onClick={() => setShowChat(false)}
            >
              Close
            </Button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 p-6 text-center text-slate-500">
            <div className="mx-auto w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
              <MessageSquare className="text-slate-300" />
            </div>
            <p className="font-semibold">Need help?</p>
            <p className="text-sm mt-1">Toggle AI Chat for contextual guidance.</p>
          </div>
        )}

        {/* Sticky action bar on mobile */}
        <div className="lg:hidden sticky bottom-3">
          <div className="bg-white/90 backdrop-blur-md border border-slate-200 rounded-xl p-3 shadow-lg flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-xs text-slate-500">Progress</p>
              <p className="text-sm font-bold text-slate-900 tabular-nums">{clamp(progress, 0, 100)}%</p>
            </div>
            <Button size="sm" onClick={() => onJump("exercise")}>
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningModule;

```

## `src/pages/Login.tsx`

```tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Card } from '../components/ui/Common';
import { CheckCircle2 } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50">
      {/* Left Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-600 text-white text-2xl font-bold mb-6 shadow-lg shadow-brand-500/40">
              L
            </div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              {isRegister ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="mt-2 text-slate-500">
              {isRegister ? 'Start your learning journey today.' : 'Please enter your details to sign in.'}
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {isRegister && (
                 <Input label="Full Name" type="text" placeholder="John Doe" required />
              )}
              <Input label="Email address" type="email" placeholder="john@example.com" required />
              <Input label="Password" type="password" placeholder="••••••••" required />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" type="checkbox" className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-slate-300 rounded" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600">
                  Remember me
                </label>
              </div>
              {!isRegister && (
                <a href="#" className="text-sm font-medium text-brand-600 hover:text-brand-500">
                  Forgot password?
                </a>
              )}
            </div>

            <Button type="submit" variant="primary" className="w-full py-3" isLoading={isLoading}>
              {isRegister ? 'Sign up' : 'Sign in'}
            </Button>
            
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                <div className="relative flex justify-center text-sm"><span className="px-2 bg-slate-50 text-slate-500">Or continue with</span></div>
            </div>

             <div className="grid grid-cols-2 gap-3">
                <Button type="button" variant="outline" className="w-full">Google</Button>
                <Button type="button" variant="outline" className="w-full">GitHub</Button>
             </div>
          </form>

          <p className="text-center text-sm text-slate-600">
            {isRegister ? 'Already have an account?' : 'Don\'t have an account?'}
            <button 
              onClick={() => setIsRegister(!isRegister)}
              className="ml-1 font-semibold text-brand-600 hover:text-brand-500 focus:outline-none focus:underline"
            >
              {isRegister ? 'Sign in' : 'Sign up'}
            </button>
          </p>
        </div>
      </div>

      {/* Right Side - Brand Visual */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600 to-indigo-900 opacity-90 z-10"></div>
        <img 
            src="https://picsum.photos/1000/1000?grayscale" 
            alt="Learning Background" 
            className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
        />
        <div className="relative z-20 max-w-lg px-8 text-center text-white">
            <h1 className="text-4xl font-bold mb-6 leading-tight">Master New Skills with AI-Powered Roadmaps</h1>
            <p className="text-lg text-indigo-100 mb-8 leading-relaxed">
                Join thousands of developers and designers accelerating their careers with Lumina's adaptive learning paths.
            </p>
            <div className="space-y-4">
                 {[
                    "Interactive coding environments",
                    "Real-time AI interview practice",
                    "Personalized career roadmaps"
                 ].map((item, idx) => (
                    <div key={idx} className="flex items-center text-indigo-200">
                        <CheckCircle2 className="w-5 h-5 mr-3 text-emerald-400" />
                        <span>{item}</span>
                    </div>
                 ))}
            </div>
        </div>
        {/* Decorative Circles */}
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-brand-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>
    </div>
  );
};

export default Login;

```

## `src/pages/RoadmapDetail.tsx`

```tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, ProgressBar } from '../components/ui/Common';
import { CheckCircle2, Circle, Lock, PlayCircle, FileText, Award, ChevronDown } from 'lucide-react';

const RoadmapDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const modules = [
    { id: '1', title: 'Internet Fundamentals', status: 'completed', duration: '45m', type: 'video' },
    { id: '2', title: 'HTML & CSS Basics', status: 'completed', duration: '2h 15m', type: 'project' },
    { id: '3', title: 'JavaScript Syntax', status: 'active', duration: '1h 30m', type: 'code' },
    { id: '4', title: 'DOM Manipulation', status: 'locked', duration: '1h', type: 'video' },
    { id: '5', title: 'Async JavaScript', status: 'locked', duration: '2h', type: 'code' },
    { id: '6', title: 'React Ecosystem', status: 'locked', duration: '4h', type: 'project' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content - Modules */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
           <div className="h-48 bg-gradient-to-r from-brand-600 to-indigo-900 relative p-8 flex flex-col justify-end">
              <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <h1 className="text-3xl font-bold text-white relative z-10 capitalize">{id?.replace('-', ' ')} Roadmap</h1>
              <p className="text-indigo-100 relative z-10 mt-2">Master the modern stack from scratch.</p>
           </div>
           <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                 <h2 className="text-lg font-bold text-slate-900">Course Content</h2>
                 <span className="text-sm text-slate-500">{modules.filter(m => m.status === 'completed').length} / {modules.length} Completed</span>
              </div>
              
              <div className="space-y-3">
                 {modules.map((module, idx) => (
                    <div 
                      key={module.id} 
                      onClick={() => module.status !== 'locked' && navigate(`/learning/${module.id}`)}
                      className={`group border rounded-lg p-4 flex items-center gap-4 transition-all ${
                        module.status === 'locked' 
                          ? 'bg-slate-50 border-slate-200 opacity-70 cursor-not-allowed' 
                          : 'bg-white border-slate-200 hover:border-brand-300 hover:shadow-md cursor-pointer'
                      } ${module.status === 'active' ? 'ring-2 ring-brand-100 border-brand-500' : ''}`}
                    >
                       <div className="flex-shrink-0">
                          {module.status === 'completed' ? (
                            <CheckCircle2 className="text-emerald-500 w-6 h-6" />
                          ) : module.status === 'locked' ? (
                            <Lock className="text-slate-400 w-6 h-6" />
                          ) : (
                            <div className="w-6 h-6 rounded-full border-2 border-brand-500 flex items-center justify-center">
                               <div className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-pulse"></div>
                            </div>
                          )}
                       </div>
                       <div className="flex-1">
                          <h3 className={`font-semibold ${module.status === 'active' ? 'text-brand-700' : 'text-slate-800'}`}>
                            {idx + 1}. {module.title}
                          </h3>
                          <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                             <span className="flex items-center gap-1"><PlayCircle size={12} /> {module.duration}</span>
                             <span className="flex items-center gap-1"><FileText size={12} /> {module.type}</span>
                          </div>
                       </div>
                       {module.status === 'active' && (
                         <Button size="sm">Continue</Button>
                       )}
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* Sidebar - Progress & Info */}
      <div className="space-y-6">
        <Card title="Your Progress">
           <div className="flex items-center justify-center py-6">
              <div className="relative w-32 h-32">
                 <svg className="w-full h-full transform -rotate-90">
                    <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
                    <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={351.86} strokeDashoffset={351.86 * (1 - 0.35)} className="text-brand-500 transition-all duration-1000" />
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-slate-900">35%</span>
                 </div>
              </div>
           </div>
           <p className="text-center text-sm text-slate-600 mb-6">Keep it up! You're on track to finish by next month.</p>
           <Button className="w-full" variant="secondary">Download Syllabus</Button>
        </Card>

        <Card title="Certificate">
           <div className="bg-slate-50 rounded-lg p-4 border border-dashed border-slate-300 text-center">
              <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
                 <Award size={24} />
              </div>
              <p className="text-sm font-medium text-slate-900">Locked</p>
              <p className="text-xs text-slate-500 mt-1">Complete all modules to earn your certificate of completion.</p>
           </div>
        </Card>

        <div className="bg-indigo-900 rounded-xl p-6 text-white relative overflow-hidden">
           <div className="relative z-10">
             <h3 className="font-bold text-lg">Need Help?</h3>
             <p className="text-indigo-200 text-sm mt-2 mb-4">Ask our AI tutor for instant clarification on any topic.</p>
             <Button size="sm" className="bg-white text-indigo-900 border-none hover:bg-indigo-50">Ask AI Tutor</Button>
           </div>
           <div className="absolute -bottom-4 -right-4 text-indigo-800 opacity-50">
             <BookOpenIcon size={120} />
           </div>
        </div>
      </div>
    </div>
  );
};

const BookOpenIcon = ({size}: {size: number}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
)

export default RoadmapDetail;

```

## `src/pages/Roadmaps.tsx`

```tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Badge, ProgressBar } from '../components/ui/Common';
import { Search, Filter, Book, CheckCircle, Code } from 'lucide-react';

const Roadmaps = () => {
  const navigate = useNavigate();

  const roadmaps = [
    { id: 'frontend', title: 'Frontend Developer', category: 'Frontend', progress: 45, total: 24, completed: 11, color: 'blue', icon: <Code /> },
    { id: 'backend', title: 'Backend Developer', category: 'Backend', progress: 10, total: 30, completed: 3, color: 'green', icon: <Book /> },
    { id: 'datascience', title: 'Data Scientist', category: 'Data Science', progress: 0, total: 18, completed: 0, color: 'purple', icon: <Filter /> },
    { id: 'uiux', title: 'UI/UX Designer', category: 'Design', progress: 80, total: 15, completed: 12, color: 'pink', icon: <CheckCircle /> },
    { id: 'devops', title: 'DevOps Engineer', category: 'DevOps', progress: 5, total: 25, completed: 1, color: 'orange', icon: <Code /> },
    { id: 'mobile', title: 'Mobile Developer', category: 'Mobile', progress: 0, total: 20, completed: 0, color: 'indigo', icon: <Code /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Learning Roadmaps</h1>
          <p className="text-slate-500 mt-1">Structured paths to master new technologies.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-200 focus:border-brand-500 outline-none transition-all"
              placeholder="Search paths..."
            />
          </div>
          <Button variant="outline" icon={<Filter size={18} />}>Filter</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roadmaps.map((map) => (
          <div 
            key={map.id}
            onClick={() => navigate(`/roadmaps/${map.id}`)}
            className="group relative bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1"
          >
            <div className={`w-12 h-12 rounded-lg bg-${map.color}-50 text-${map.color}-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              {map.icon}
            </div>
            
            <div className="mb-4">
              <Badge color={map.progress === 0 ? 'gray' : map.progress === 100 ? 'green' : 'blue'}>
                {map.category}
              </Badge>
              <h3 className="text-xl font-bold text-slate-900 mt-2 group-hover:text-brand-600 transition-colors">{map.title}</h3>
              <p className="text-slate-500 text-sm mt-1">{map.total} Modules • Est. 3 Months</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium text-slate-600">
                <span>{map.progress}% Completed</span>
                <span>{map.completed}/{map.total}</span>
              </div>
              <ProgressBar progress={map.progress} />
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
              <div className="flex -space-x-2">
                 {[1,2,3].map(i => (
                    <img key={i} className="w-6 h-6 rounded-full border-2 border-white" src={`https://picsum.photos/30/30?random=${i+10}`} alt="User" />
                 ))}
                 <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] text-slate-600 font-bold">+2k</div>
              </div>
              <span className="text-sm font-semibold text-brand-600 group-hover:translate-x-1 transition-transform">Start Path &rarr;</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Roadmaps;

```

## `src/services/gemini.ts`

```typescript
import { GoogleGenAI, Type } from "@google/genai";
import { InterviewFeedback } from "../types";

export const generateInterviewFeedback = async (question: string, answer: string): Promise<InterviewFeedback> => {
  const apiKey = process.env.API_KEY || '';
  
  if (!apiKey) {
    // Mock response if no key is present for demo purposes
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          score: 85,
          summary: "Good answer, but could be more specific about technical implementation details.",
          strengths: ["Clear communication", "Addressed the core problem"],
          improvements: ["Mention specific libraries", "Discuss edge cases"]
        });
      }, 1500);
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const model = "gemini-2.5-flash";
    const prompt = `
      You are an expert technical interviewer.
      Question: "${question}"
      Candidate Answer: "${answer}"
      
      Provide feedback in JSON format with the following schema:
      - score: integer (0-100)
      - summary: string (brief overview)
      - strengths: array of strings
      - improvements: array of strings
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            summary: { type: Type.STRING },
            strengths: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            improvements: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as InterviewFeedback;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      score: 0,
      summary: "Failed to generate feedback. Please try again.",
      strengths: [],
      improvements: []
    };
  }
};

export const getChatResponse = async (history: {role: string, parts: {text: string}[]}[], message: string) => {
    const apiKey = process.env.API_KEY || '';
    if (!apiKey) return "I'm a demo AI. Please configure your API key to chat for real!";
    
    try {
        const ai = new GoogleGenAI({ apiKey });
        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            history: history
        });
        const result = await chat.sendMessage({ message });
        return result.text;
    } catch (e) {
        console.error(e);
        return "Sorry, I encountered an error.";
    }
}
```

## `src/types.ts`

```typescript
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  avatar: string;
}

export interface Roadmap {
  id: string;
  title: string;
  description: string;
  category: 'Frontend' | 'Backend' | 'Data Science' | 'Design';
  progress: number;
  totalModules: number;
  completedModules: number;
  image: string;
  estimatedTime: string;
}

export interface Module {
  id: string;
  title: string;
  duration: string;
  status: 'locked' | 'active' | 'completed';
  type: 'video' | 'quiz' | 'project';
}

export interface Activity {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  type: 'progress' | 'achievement' | 'comment';
}

export interface Stat {
  label: string;
  value: string | number;
  change: number;
  period: string;
  icon: string;
}

export enum InterviewStatus {
  IDLE = 'IDLE',
  RECORDING = 'RECORDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
}

export interface InterviewFeedback {
  score: number;
  summary: string;
  strengths: string[];
  improvements: string[];
}

```

## `vite.config.ts`

```typescript
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), tailwindcss()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, 'src'),
          '@models': path.resolve(__dirname, 'src/models')
        }
      }
    };
});
```
