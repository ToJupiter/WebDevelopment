# Source Code Summary


Generated on: /home/rocminfo/Templates/WebDevelopment/frontend

File types included: .ts, .tsx, .html, .css

---


## `dist/assets/index-XGmXxU8j.css`

```css
body{background-color:#f8fafc;margin:0;font-family:Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif}html{scroll-behavior:smooth}:root{font-family:system-ui,Avenir,Helvetica,Arial,sans-serif;line-height:1.5;font-weight:400;color-scheme:light dark;color:#ffffffde;background-color:#242424;font-synthesis:none;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}a{font-weight:500;color:#646cff;text-decoration:inherit}a:hover{color:#535bf2}body{margin:0;min-width:320px;min-height:100vh}h1{font-size:3.2em;line-height:1.1}button{border-radius:8px;border:1px solid transparent;padding:.6em 1.2em;font-size:1em;font-weight:500;font-family:inherit;cursor:pointer;transition:border-color .25s}button:hover{border-color:#646cff}button:focus,button:focus-visible{outline:4px auto -webkit-focus-ring-color}@media(prefers-color-scheme:light){:root{color:#213547;background-color:#fff}a:hover{color:#747bff}button{background-color:#f9f9f9}}

```

## `dist/index.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SkillSync Learning</title>

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

    <script type="module" crossorigin src="/assets/index-BC0FkON9.js"></script>
    <link rel="stylesheet" crossorigin href="/assets/index-XGmXxU8j.css">
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

## `index.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SkillSync Learning</title>

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
  Settings,
  Calendar as CalendarIcon,
  FileText,
  Award,
  Shield
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
    { icon: <Video size={20} />, label: 'Interview', path: '/interview' },
    { icon: <BookOpen size={20} />, label: 'Learning', path: '/learning' },
    { icon: <CalendarIcon size={20} />, label: 'Calendar', path: '/calendar' }, // Renamed from Video
    { icon: <FileText size={20} />, label: 'CV', path: '/cv' }, // Renamed from Video
    { icon: <Award size={20} />, label: 'Certificates', path: '/certificates' },
    { icon: <Shield size={20} />, label: 'Admin', path: '/admin' }, // Renamed from Video
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
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">SkillSync</span>
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
            <NavLink 
              to="/settings"
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-brand-50 text-brand-600' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <Settings size={20} />
              Preferences
            </NavLink>
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
        className={`w-full px-3 py-2 bg-white border ${error ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:border-brand-500 focus:ring-brand-200'} rounded-md text-sm text-slate-900 shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 transition-all duration-200 ${className}`}
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

export const ProgressBar: React.FC<{ progress: number, color?: string, height?: string, className?: string, barClassName?: string }> = ({ progress, color = 'bg-brand-500', height = 'h-2', className = '', barClassName = '' }) => {
  return (
    <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${height} ${className}`}>
      <div 
        className={`${color} ${height} rounded-full transition-all duration-1000 ease-out ${barClassName}`} 
        style={{ width: `${progress}%` }} 
      />
    </div>
  );
};
```

## `src/context/AuthContext.tsx`

```tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { User } from '../types';
import { AuthResponse } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      setLoading(true);
      // Calls /api/users/me to validate session cookie
      const response = await api.get<{ data: User }>('/users/me');
      setUser(response.data.data);
    } catch (error) {
      // 401 or other errors mean not logged in
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (credentials: any) => {
    const response = await api.post<{ data: AuthResponse }>('/auth/login', credentials);
    setUser(response.data.data); // The backend returns the user object in data
    // Cookie is set automatically by the backend
  };

  const register = async (userData: any) => {
    const response = await api.post<{ data: AuthResponse }>('/auth/register', userData);
    setUser(response.data.data);
    // Cookie is set automatically by the backend
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.error("Logout failed", e);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isAuthenticated: !!user, 
      login, 
      register, 
      logout,
      checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

```

## `src/hooks/useInterviewSocket.ts`

```typescript
import { useEffect, useRef, useState, useCallback } from 'react';

type MessageType = 'auth' | 'answer_audio' | 'answer_text' | 'next_question' | 'end_session';

interface WebSocketMessage {
  type: MessageType;
  payload?: any;
}

export const useInterviewSocket = (sessionId: string | null) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    // Use relative path to take advantage of Vite proxy
    // If we are on https, use wss, else ws
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host; // e.g. localhost:5173
    // But our proxy is at /api, but WS proxying might need setup in Vite too!
    // Vite proxy supports ws: true.
    // The backend path is /interviews/ws.
    
    // NOTE: Vite proxy needs `ws: true` for websocket proxying.
    // We added proxy for `/api`. We should add proxy for `/interviews/ws` or just `/interviews`.
    // Backend `setupInterviewWebSocket` us path `/interviews/ws`.
    // So we should connect to `ws://${host}/interviews/ws` if proxy is set up.
    
    // Let's assume we will fix Vite config to proxy /interviews as well.
    const url = `${protocol}//${host}/interviews/ws`;
    
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WS Connected');
      setIsConnected(true);
      // Send auth
      ws.send(JSON.stringify({ type: 'auth', payload: { session_id: sessionId } }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setLastMessage(data);
      } catch (e) {
        console.error("WS Parse error", e);
      }
    };

    ws.onclose = () => {
      console.log('WS Closed');
      setIsConnected(false);
    };

    ws.onerror = (e) => {
      console.error('WS Error', e);
    };

    return () => {
      ws.close();
    };
  }, [sessionId]);

  const sendMessage = useCallback((type: MessageType, payload: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type, payload }));
    } else {
        console.warn("WS not connected, cannot send message");
    }
  }, []);

  return { isConnected, lastMessage, sendMessage };
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
import { AuthProvider } from './context/AuthContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
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
import React, { useState, useEffect } from 'react';
import { Card, Button, ProgressBar, Badge, Input } from "../components/ui/Common";
import { FileText, Sparkles, Download, Plus, Save, X } from "lucide-react";
import api from '../services/api';

const CV = () => {
  const [cv, setCv] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  
  // Fetch CV
  useEffect(() => {
    fetchCV();
  }, []);

  const fetchCV = async () => {
    try {
      const res = await api.get('/cvs');
      if (res.data.success && res.data.data.length > 0) {
        setCv(res.data.data[0]);
        setEditForm(res.data.data[0]);
      } else {
        setCv(null);
      }
    } catch (error) {
      console.error("Failed to fetch CV", error);
    } finally {
      setLoading(false);
    }
  };

  const createCV = async () => {
    try {
      setLoading(true);
      const res = await api.post('/cvs', {
        cv_name: 'My Professional CV',
        template_style: 'modern',
        skills: ["JavaScript", "React", "Node.js"], 
        personal_info: { summary: "Passionate developer ready to build." }
      });
      if (res.data.success) {
        setCv(res.data.data);
        setEditForm(res.data.data);
      }
    } catch (error) {
      console.error("Failed to create CV", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!cv) return;
    try {
      const res = await api.put(`/cvs/${cv.cv_id}`, editForm);
      if (res.data.success) {
        setCv(res.data.data);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  const handleDownload = async () => {
    if (!cv) return;
    try {
      const response = await api.post(`/cvs/${cv.cv_id}/generate-pdf`, {}, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${cv.cv_name || 'CV'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download failed", error);
    }
  };

  const handleOptimise = async () => {
     if (!cv) return;
     // Placeholder for AI optimization trigger
     alert("AI Optimization request sent! (Mock)");
  };

  if (loading) return <div className="p-8 text-center">Loading CV...</div>;

  if (!cv) {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
        <Card className="text-center p-8 max-w-md">
            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">No CV Found</h2>
            <p className="text-slate-500 mb-6">Create your first CV to start tracking your skills and experience.</p>
            <Button onClick={createCV} icon={<Plus size={18} />}>Create CV</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{cv.cv_name}</h1>
          <p className="text-slate-500 mt-1">
            {isEditing ? 'Editing Mode' : 'View and manage your professional profile.'}
          </p>
        </div>
        <div className="flex gap-2">
            {!isEditing && (
                <>
                <Button variant="outline" onClick={() => setIsEditing(true)}>Edit Profile</Button>
                <Button icon={<Download size={16} />} onClick={handleDownload}>Export PDF</Button>
                </>
            )}
            {isEditing && (
                <>
                <Button variant="ghost" onClick={() => { setIsEditing(false); setEditForm(cv); }}>Cancel</Button>
                <Button icon={<Save size={16} />} onClick={handleUpdate}>Save Changes</Button>
                </>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Summary">
          {isEditing ? (
             <textarea 
                className="w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-brand-500 outline-none min-h-[100px]"
                value={editForm.personal_info?.summary || ''}
                onChange={(e) => setEditForm({...editForm, personal_info: { ...editForm.personal_info, summary: e.target.value }})}
             />
          ) : (
            <p className="text-slate-600 leading-relaxed">
                {cv.personal_info?.summary || "No summary added yet."}
            </p>
          )}
        </Card>

        <Card title="Skills">
           {isEditing ? (
              <div className="space-y-4">
                 <p className="text-xs text-slate-500">Comma separated skills</p>
                 <Input 
                    value={Array.isArray(editForm.skills) ? editForm.skills.join(', ') : ''}
                    onChange={(e) => setEditForm({...editForm, skills: e.target.value.split(',').map((s: string) => s.trim())})}
                 />
              </div>
           ) : (
              <div className="flex flex-wrap gap-2">
                {Array.isArray(cv.skills) && cv.skills.map((s: string, i: number) => (
                <Badge key={i} color="blue">{s}</Badge>
                ))}
            </div>
           )}
        </Card>

        <Card className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white">
          <Badge color="indigo">AI Assist</Badge>
          <h3 className="font-bold text-lg mt-2">Improve with AI</h3>
          <p className="text-indigo-200 text-sm mt-1">
            Let SkillSync rewrite your CV for clarity and impact.
          </p>
          <Button className="mt-4 bg-white text-indigo-900 border-none" onClick={handleOptimise}>
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

## `src/pages/Certificates.tsx`

```tsx
import React, { useEffect, useState } from 'react';
import { Card, Button, Badge } from '../components/ui/Common';
import { Award, Download, Calendar, ExternalLink } from 'lucide-react';
import api from '../services/api';

interface Certificate {
  certificate_id: string;
  certificate_name: string;
  issue_date: string;
  pdf_url?: string;
  roadmap?: {
    title: string;
    category: string;
  };
}

const Certificates = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const res = await api.get('/certificates');
      if (res.data.success) {
        setCertificates(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch certificates", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (id: string, name: string) => {
    try {
      const response = await api.get(`/certificates/${id}/download`, {
        responseType: 'blob',
      });
      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${name.replace(/\s+/g, '_')}_Certificate.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download failed", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Certificates</h1>
          <p className="text-slate-500 mt-1">Verify and download your earned credentials.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
        </div>
      ) : certificates.length === 0 ? (
        <Card className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Award size={32} />
          </div>
          <h3 className="text-lg font-medium text-slate-900">No Certificates Yet</h3>
          <p className="text-slate-500 mt-2 mb-6">Complete roadmaps to earn certificates.</p>
          <Button onClick={() => window.location.hash = '#/roadmaps'}>Browse Roadmaps</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <Card key={cert.certificate_id} className="group hover:border-brand-200 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
                  <Award size={24} />
                </div>
                {cert.roadmap && <Badge color="blue">{cert.roadmap.category || 'Tech'}</Badge>}
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 mb-2">{cert.certificate_name}</h3>
              <p className="text-sm text-slate-500 mb-4">
                Issued on {new Date(cert.issue_date).toLocaleDateString()}
              </p>

              <div className="pt-4 border-t border-slate-100 flex gap-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleDownload(cert.certificate_id, cert.certificate_name)}
                  icon={<Download size={14} />}
                >
                  PDF
                </Button>
                <Button variant="ghost" size="sm" icon={<ExternalLink size={14} />}>
                  Verify
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Certificates;

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
  const [stats, setStats] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await import('../services/api').then(m => m.default.get('/progress/overview'));
        setStats(response.data.data);
      } catch (e) {
        console.error("Failed to fetch dashboard stats", e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statItems = [
    { label: 'Overall Completion', value: stats ? `${stats.average_completion}%` : '0%', icon: <TrendingUp className="text-emerald-500" />, change: '+0%', color: 'emerald' },
    { label: 'Enrolled Roadmaps', value: stats ? stats.enrolled_roadmaps : '0', icon: <Clock className="text-brand-500" />, change: 'Active', color: 'brand' },
    { label: 'Modules Finished', value: stats ? stats.completed_modules : '0', icon: <Target className="text-amber-500" />, change: 'Keep going!', color: 'amber' },
    { label: 'Certificates', value: '0', icon: <Award className="text-purple-500" />, change: 'Earn more', color: 'purple' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">Welcome back! Track your learning progress.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" icon={<Calendar size={16} />}>Schedule</Button>
          <Button>Resume Learning</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statItems.map((stat, i) => (
          <Card key={i} className="flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{loading ? '...' : stat.value}</h3>
              </div>
              <div className={`p-2 rounded-lg bg-${stat.color}-50`}>
                {stat.icon}
              </div>
            </div>
            <div className="text-xs text-slate-500">
              <span className="text-emerald-600 font-medium">{stat.change}</span>
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
import React, { useState, useEffect, useRef } from 'react';
import { Card, Button } from '../components/ui/Common';
import { Send, Clock, RefreshCw } from 'lucide-react';
import { InterviewFeedback } from '../types';
import { 
  RadialBarChart, 
  RadialBar, 
  ResponsiveContainer 
} from 'recharts';
import api from '../services/api';
import { useInterviewSocket } from '../hooks/useInterviewSocket';

const Interview = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const { lastMessage, sendMessage } = useInterviewSocket(sessionId);
  
  const [timer, setTimer] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Current Question State
  const [question, setQuestion] = useState<{ id: string; text: string; index: number; total: number } | null>(null);
  const [answers, setAnswers] = useState<{ question_id: string; answer: string }[]>([]);

  // Timer Logic - Auto start when question is present
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (question && !isProcessing && !feedback) {
      interval = setInterval(() => setTimer(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [question, isProcessing, feedback]);

  // WebSocket Message Handling
  useEffect(() => {
    if (!lastMessage) return;

    switch (lastMessage.type) {
      case 'question':
        setQuestion({
          id: lastMessage.payload.question_id,
          text: lastMessage.payload.text,
          index: lastMessage.payload.index,
          total: lastMessage.payload.total,
        });
        setCurrentAnswer(""); 
        setTimer(0);
        setIsProcessing(false);
        break;
      
      case 'finished':
        // Triggered by socket when no more questions
        // We rely on the effect below to handle final submission if needed, 
        // OR we can trust the 'finished' event to be the signal to stop.
        // However, we usually send the LAST answer before this.
        // The backend might send 'finished' after the last answer ack.
        // We just need to stop processing.
        break;

      case 'error':
        console.error("Socket error:", lastMessage.payload.message);
        setIsProcessing(false);
        break;
    }
  }, [lastMessage]);

  const startSession = async () => {
    try {
      setIsProcessing(true);
      const res = await api.post('/interviews/sessions', {
        session_name: `Practice Session ${new Date().toLocaleDateString()}`,
        interview_type: 'simulated'
      });
      setSessionId(res.data.data.session_id);
    } catch (error) {
      console.error("Failed to start session", error);
      setIsProcessing(false);
    }
  };

  const submitAnswer = () => {
    if (!question) return;

    setIsProcessing(true);
    const finalAnswer = currentAnswer.trim() || "No answer provided.";
    
    // Update local answers state
    const newAnswers = [...answers, { question_id: question.id, answer: finalAnswer }];
    setAnswers(newAnswers);

    // Send to WebSocket
    // Note: The backend will reply with next 'question' OR 'finished'
    sendMessage('answer_text', { text: finalAnswer });
  };
  
  // Watch for 'finished' message to submit all answers to backend for final scoring
  const answersRef = useRef(answers);
  useEffect(() => { answersRef.current = answers; }, [answers]);

  useEffect(() => {
      if (lastMessage?.type === 'finished') {
          setIsProcessing(true);
          api.post(`/interviews/sessions/${sessionId}/submit`, {
              user_answers: answersRef.current
          }).then(res => {
              setFeedback(res.data.data.ai_feedback);
              setSessionId(null);
          }).catch(err => console.error(err))
          .finally(() => setIsProcessing(false));
      }
  }, [lastMessage, sessionId]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const scoreData = feedback ? [
    { name: 'Score', uv: feedback.score || 0, fill: '#6366f1' },
    { name: 'Max', uv: 100, fill: '#e2e8f0' }
  ] : [];

  if (!sessionId && !feedback && !isProcessing) {
      return (
        <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
            <Card className="max-w-md w-full text-center p-8">
                <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Clock size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Practice Interview</h2>
                <p className="text-slate-500 mb-8">
                    Start a simulated technical interview. You'll have time to type your answers to 4 questions.
                </p>
                <Button onClick={startSession} className="w-full" size="lg">Start Session</Button>
            </Card>
        </div>
      );
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-6">
      <div className="flex-1 flex flex-col gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 flex-1 flex flex-col relative overflow-hidden">
          {question && (
             <div className="w-full h-full flex flex-col">
                <div className="absolute top-0 left-0 w-full h-1 bg-slate-100">
                    <div className="h-full bg-brand-500 transition-all duration-300" style={{ width: `${((question.index + 1) / question.total) * 100}%` }}></div>
                </div>
                <div className="flex justify-between items-center mb-6">
                    <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">Question {question.index + 1} of {question.total}</span>
                    <div className="flex items-center gap-2 text-slate-500 font-mono">
                        <Clock size={16} />
                        {formatTime(timer)}
                    </div>
                </div>
                
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-6 leading-relaxed">
                    {question.text}
                </h2>
                
                <textarea 
                    className="flex-1 w-full p-4 bg-slate-50 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all font-mono text-sm leading-relaxed"
                    placeholder="Type your answer here..."
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    disabled={isProcessing}
                    autoFocus
                />
                
                <div className="mt-6 flex justify-end">
                    <Button 
                        onClick={submitAnswer} 
                        disabled={!currentAnswer.trim() || isProcessing}
                        icon={<Send size={16} />}
                        className="px-8"
                    >
                        {isProcessing ? 'Submitting...' : 'Submit Answer'}
                    </Button>
                </div>
             </div>
          )}

          {!question && !feedback && (
             <div className="flex-1 flex items-center justify-center text-slate-400 animate-pulse">Connecting to interviewer...</div>
          )}
        </div>
      </div>

      {(feedback || isProcessing) && !question && (
        <div className={`w-full lg:w-96 flex flex-col transition-all duration-500`}>
             {isProcessing && !feedback ? (
                <Card className="flex-1 flex flex-col items-center justify-center">
                    <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mb-4"></div>
                    <p className="text-slate-600 font-medium">Analyzing...</p>
                </Card>
             ) : feedback ? (
               <div className="space-y-4 h-full overflow-y-auto">
                 <Card className="text-center relative overflow-hidden">
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
                 </Card>

                 <Button 
                    className="w-full" 
                    variant="outline" 
                    icon={<RefreshCw size={16} />}
                    onClick={() => {
                        setFeedback(null);
                        setAnswers([]);
                        setQuestion(null);
                        setCurrentAnswer("");
                    }}
                 >
                    Start New Session
                 </Button>
               </div>
             ) : null}
        </div>
      )}
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
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Button, Badge, ProgressBar } from "../components/ui/Common";
import {
  ArrowLeft,
  BookOpen,
  Code2,
  FileText,
  MessageSquare,
  CheckCircle2,
  Circle,
  PlayCircle
} from "lucide-react";
import api from "../services/api";

const LearningModule = () => {
  const navigate = useNavigate();
  const { roadmapId, moduleId } = useParams<{ roadmapId: string; moduleId: string }>();

  const [module, setModule] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'content' | 'exercise'>('content');
  const [exerciseInput, setExerciseInput] = useState("");
  const [exerciseResult, setExerciseResult] = useState<any>(null);

  useEffect(() => {
    if (roadmapId && moduleId) {
      fetchModule();
    }
  }, [roadmapId, moduleId]);

  const fetchModule = async () => {
    try {
        const res = await api.get(`/roadmaps/${roadmapId}/modules/${moduleId}`);
        if (res.data.success) {
            setModule(res.data.data);
        }
    } catch (error) {
        console.error("Failed to load module", error);
    } finally {
        setLoading(false);
    }
  };

  const submitExercise = async () => {
      // Assuming module has exercises, pick the first one or iterate
      // For now, simple mock submission if no real exercise ID
      const exerciseId = module?.exercises?.[0]?.exercise_id;
      if (!exerciseId) {
          alert("No exercise found for this module.");
          return;
      }
      try {
          const res = await api.post(`/exercises/${exerciseId}/submit`, {
              code_answer: exerciseInput
          });
          setExerciseResult(res.data);
      } catch (e) {
          console.error("Exercise submission failed", e);
      }
  };

  if (loading) return <div className="p-12 text-center text-slate-500">Loading module content...</div>;
  if (!module) return <div className="p-12 text-center text-red-500">Module not found.</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Main content */}
      <div className="lg:col-span-8 xl:col-span-9 space-y-6">
        {/* Top bar */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <button
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-brand-600 transition-colors"
              onClick={() => navigate(`/roadmaps/${roadmapId}`)}
            >
              <ArrowLeft size={16} />
              Back to Roadmap
            </button>
            <h1 className="text-2xl font-bold text-slate-900 mt-2">{module.title}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
               <Badge color="blue">Module</Badge>
               {module.estimated_hours && <Badge color="gray">{module.estimated_hours}h</Badge>}
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="border-b border-slate-200">
            <nav className="-mb-px flex space-x-8">
                <button
                    onClick={() => setActiveTab('content')}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'content'
                        ? 'border-brand-500 text-brand-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }`}
                >
                    <BookOpen size={16} className="inline mr-2" />
                    Lesson Content
                </button>
                <button
                    onClick={() => setActiveTab('exercise')}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'exercise'
                        ? 'border-brand-500 text-brand-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }`}
                >
                    <Code2 size={16} className="inline mr-2" />
                    Exercises
                </button>
            </nav>
        </div>

        {activeTab === 'content' && (
            <Card className="prose prose-slate max-w-none">
                <div dangerouslySetInnerHTML={{ __html: module.content || '<p>No content available.</p>' }} />
                {/* Fallback if content is empty but description exists */}
                {!module.content && module.description && <p>{module.description}</p>}
            </Card>
        )}

        {activeTab === 'exercise' && (
            <div className="space-y-6">
                {module.exercises && module.exercises.length > 0 ? (
                    module.exercises.map((ex: any, i: number) => (
                        <Card key={ex.exercise_id || i} title={ex.title || `Exercise ${i+1}`}>
                             <p className="mb-4 text-slate-700">{ex.prompt || "Solve the problem below."}</p>
                             <textarea 
                                className="w-full h-48 p-4 bg-slate-900 text-slate-100 font-mono text-sm rounded-lg mb-4"
                                placeholder="// Write your solution code here..."
                                value={exerciseInput}
                                onChange={(e) => setExerciseInput(e.target.value)}
                             />
                             <div className="flex justify-between items-center">
                                 <Button onClick={submitExercise}>Run Code</Button>
                                 {exerciseResult && (
                                     <span className={exerciseResult.success ? "text-green-600" : "text-red-600"}>
                                         {exerciseResult.success ? "Passed!" : "Failed"}
                                     </span>
                                 )}
                             </div>
                        </Card>
                    ))
                ) : (
                    <Card>
                        <p className="text-slate-500 text-center">No exercises available for this module yet.</p>
                    </Card>
                )}
            </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-4 xl:col-span-3 space-y-6">
         <Card title="Module Info">
             <p className="text-sm text-slate-600 mb-4">{module.description}</p>
             <Button variant="outline" className="w-full" onClick={() => setActiveTab(activeTab === 'content' ? 'exercise' : 'content')}>
                 {activeTab === 'content' ? 'Go to Exercises' : 'Back to Lesson'}
             </Button>
         </Card>
      </div>
    </div>
  );
};

export default LearningModule;

```

## `src/pages/Login.tsx`

```tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Input } from '../components/ui/Common';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.formattedMessage || err?.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
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
              Welcome back
            </h2>
            <p className="mt-2 text-slate-500">
              Please enter your details to sign in.
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Input 
                label="Email address" 
                type="email" 
                placeholder="john@example.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input 
                label="Password" 
                type="password" 
                placeholder="••••••••" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" type="checkbox" className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-slate-300 rounded" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm font-medium text-brand-600 hover:text-brand-500">
                Forgot password?
              </a>
            </div>

            <Button type="submit" variant="primary" className="w-full py-3" isLoading={isLoading}>
              Sign in
            </Button>
            

          </form>

          <p className="text-center text-sm text-slate-600">
            Don't have an account?
            <Link 
              to="/register"
              className="ml-1 font-semibold text-brand-600 hover:text-brand-500 focus:outline-none focus:underline"
            >
              Sign up
            </Link>
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
                Join thousands of developers and designers accelerating their careers with SkillSync's adaptive learning paths.
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

## `src/pages/Register.tsx`

```tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Card } from '../components/ui/Common';
import { UserPlus, Mail, Lock, User, AlertCircle } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    setIsLoading(true);
    try {
      await register({
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-500 text-white mb-4 shadow-lg shadow-brand-500/30">
            <span className="text-xl font-bold">L</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Create Account</h1>
          <p className="text-slate-500 mt-2">Join SkillSync Learning today</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
             <User className="absolute left-3 top-9 text-slate-400" size={18} />
             <Input 
               label="Full Name" 
               type="text" 
               name="full_name"
               required
               placeholder="John Doe"
               className="pl-10"
               value={formData.full_name}
               onChange={handleChange}
             />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-9 text-slate-400" size={18} />
            <Input 
              label="Email Address" 
              type="email" 
              name="email"
              required
              placeholder="you@example.com"
              className="pl-10"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-9 text-slate-400" size={18} />
            <Input 
              label="Password" 
              type="password" 
              name="password"
              required
              placeholder="••••••••"
              className="pl-10"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-9 text-slate-400" size={18} />
            <Input 
              label="Confirm Password" 
              type="password" 
              name="confirmPassword"
              required
              placeholder="••••••••"
              className="pl-10"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full mt-2" 
            isLoading={isLoading}
            icon={<UserPlus size={18} />}
          >
            Create Account
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-600 hover:text-brand-700 font-medium hover:underline">
            Sign in
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Register;

```

## `src/pages/RoadmapDetail.tsx`

```tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, ProgressBar } from '../components/ui/Common';
import { CheckCircle2, Lock, PlayCircle, BookOpen, Clock } from 'lucide-react';
import api from '../services/api';

const RoadmapDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [roadmap, setRoadmap] = useState<any>(null);
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      // Parallel fetch: Roadmap Definition + User Progress
      const [roadmapRes, progressRes] = await Promise.all([
        api.get(`/roadmaps/${id}`),
        api.get(`/progress/roadmaps/${id}`).catch(err => ({ data: { success: false, data: null } })) // Allow progress fetch to fail (e.g. not enrolled)
      ]);

      if (roadmapRes.data.success) {
        setRoadmap(roadmapRes.data.data);
      }
      
      if (progressRes.data?.success) {
        setProgress(progressRes.data.data);
      }
    } catch (error) {
      console.error("Failed to load roadmap data", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-12 text-center text-slate-500">Loading roadmap...</div>;
  if (!roadmap) return <div className="p-12 text-center text-red-500">Roadmap not found or failed to load.</div>;

  // Merge Data
  const modules = roadmap.modules || [];
  const progressMap = new Map();
  if (progress && progress.modules) {
    progress.modules.forEach((pm: any) => progressMap.set(pm.module_id, pm));
  }

  // Calculate completion
  const completionPercentage = progress?.overall_progress || 0;
  const isEnrolled = !!progress;

  const handleEnroll = async () => {
    try {
      await api.post(`/roadmaps/${id}/enroll`);
      loadData(); // Reload to get progress structure
    } catch (e) {
      console.error("Enrollment failed", e);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content - Modules */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
           <div className="h-48 bg-gradient-to-r from-brand-600 to-indigo-900 relative p-8 flex flex-col justify-end">
              <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
              <h1 className="text-3xl font-bold text-white relative z-10 capitalize">{roadmap.title}</h1>
              <p className="text-indigo-100 relative z-10 mt-2">{roadmap.description || 'Master this skill path.'}</p>
           </div>
           
           <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                 <h2 className="text-lg font-bold text-slate-900">Course Content</h2>
                 {isEnrolled ? (
                    <span className="text-sm text-slate-500">{progress?.modules?.filter((m: any) => m.status === 'completed').length || 0} / {modules.length} Completed</span>
                 ) : (
                    <span className="text-sm text-slate-500">{modules.length} Modules</span>
                 )}
              </div>
              
              <div className="space-y-3">
                 {modules.map((module: any, idx: number) => {
                    const p = progressMap.get(module.module_id);
                    const status = p?.status || (isEnrolled ? 'not_started' : 'locked');
                    const isLocked = !isEnrolled; // Simple logic: fail to view if not enrolled? Or open view but track status? 
                    // Better: If not enrolled, show as locked or just 'view'. 
                    // But typically you enroll to track.
                    
                    return (
                        <div 
                          key={module.module_id} 
                          onClick={() => {
                              if (isEnrolled) {
                                module.status !== 'locked' && navigate(`/roadmaps/${id}/modules/${module.module_id}`);
                              } else {
                                handleEnroll(); // Or prompt
                              }
                          }}
                          className={`group border rounded-lg p-4 flex items-center gap-4 transition-all ${
                            isLocked 
                              ? 'bg-slate-50 border-slate-200 cursor-pointer hover:border-brand-300' 
                              : 'bg-white border-slate-200 hover:border-brand-300 hover:shadow-md cursor-pointer'
                          } ${status === 'in_progress' ? 'ring-2 ring-brand-100 border-brand-500' : ''}`}
                        >
                           <div className="flex-shrink-0">
                              {status === 'completed' ? (
                                <CheckCircle2 className="text-emerald-500 w-6 h-6" />
                              ) : status === 'locked' || !isEnrolled ? (
                                <Lock className="text-slate-400 w-6 h-6" />
                              ) : status === 'in_progress' ? (
                                <div className="w-6 h-6 rounded-full border-2 border-brand-500 flex items-center justify-center">
                                   <div className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-pulse"></div>
                                </div>
                              ) : (
                                <div className="w-6 h-6 rounded-full border-2 border-slate-300"></div>
                              )}
                           </div>
                           <div className="flex-1">
                              <h3 className={`font-semibold ${status === 'in_progress' ? 'text-brand-700' : 'text-slate-800'}`}>
                                {idx + 1}. {module.title}
                              </h3>
                              <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                                 {module.estimated_hours && (
                                     <span className="flex items-center gap-1"><Clock size={12} /> {module.estimated_hours}h</span>
                                 )}
                                 <span className="flex items-center gap-1"><BookOpen size={12} /> Module</span>
                              </div>
                           </div>
                           {status === 'in_progress' && (
                             <Button size="sm">Continue</Button>
                           )}
                           {!isEnrolled && (
                             <Button size="sm" variant="outline">Start</Button>
                           )}
                        </div>
                    );
                 })}
              </div>
           </div>
        </div>
      </div>

      {/* Sidebar - Progress & Info */}
      <div className="space-y-6">
        <Card title="Your Progress">
           {isEnrolled ? (
               <>
               <div className="flex items-center justify-center py-6">
                  <div className="relative w-32 h-32">
                     <svg className="w-full h-full transform -rotate-90">
                        <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
                        <circle 
                            cx="64" cy="64" r="56" 
                            stroke="currentColor" strokeWidth="8" fill="transparent" 
                            strokeDasharray={351.86} 
                            strokeDashoffset={351.86 * (1 - (completionPercentage / 100))} 
                            className="text-brand-500 transition-all duration-1000" 
                        />
                     </svg>
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-slate-900">{Math.round(completionPercentage)}%</span>
                     </div>
                  </div>
               </div>
               <p className="text-center text-sm text-slate-600 mb-6">Keep it up! You're on track.</p>
               </>
           ) : (
               <div className="text-center py-6">
                   <p className="text-slate-600 mb-4">Join this roadmap to track your progress and earn a certificate.</p>
                   <Button className="w-full" onClick={handleEnroll}>Enroll Now</Button>
               </div>
           )}
        </Card>

        {/* AI Tutor Card - Kept as per user preference (Help button kept, so this is consistent) */}
        <div className="bg-indigo-900 rounded-xl p-6 text-white relative overflow-hidden">
           <div className="relative z-10">
             <h3 className="font-bold text-lg">Need Help?</h3>
             <p className="text-indigo-200 text-sm mt-2 mb-4">Ask our AI tutor for instant clarification on any topic.</p>
             <Button size="sm" className="bg-white text-indigo-900 border-none hover:bg-indigo-50">Ask AI Tutor</Button>
           </div>
           <div className="absolute -bottom-4 -right-4 text-indigo-800 opacity-50">
             <BookOpen size={120} />
           </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapDetail;

```

## `src/pages/Roadmaps.tsx`

```tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Badge, ProgressBar } from '../components/ui/Common';
import { Search, Filter, Book, CheckCircle, Code, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Roadmaps = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [roadmaps, setRoadmaps] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const response = await import('../services/api').then(m => m.default.get('/roadmaps'));
        setRoadmaps(response.data.data);
      } catch (e) {
        console.error("Failed to fetch roadmaps", e);
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmaps();
  }, []);

  const getCategoryColor = (cat: string) => {
     const map: any = { 'Frontend': 'blue', 'Backend': 'green', 'DevOps': 'orange', 'Design': 'pink', 'Data Science': 'purple' };
     return map[cat] || 'indigo';
  };
  
  const getIcon = (cat: string) => {
      // Return appropriate icon
      return <Book />;
  };

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
          {(user?.role === 'admin' || user?.role === 'creator') && (
            <Button icon={<Plus size={18} />} onClick={() => navigate('/admin')}>Create Path</Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? <p>Loading roadmaps...</p> : roadmaps.map((map) => (
          <div 
            key={map.roadmap_id}
            onClick={() => navigate(`/roadmaps/${map.roadmap_id}`)}
            className="group relative bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1"
          >
            <div className={`w-12 h-12 rounded-lg bg-${getCategoryColor(map.category)}-50 text-${getCategoryColor(map.category)}-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              {getIcon(map.category)}
            </div>
            
            <div className="mb-4">
              <Badge color="blue">
                {map.category}
              </Badge>
              <h3 className="text-xl font-bold text-slate-900 mt-2 group-hover:text-brand-600 transition-colors">{map.title}</h3>
              <p className="text-slate-500 text-sm mt-1">{map.module_count || 0} Modules • Est. {map.module_count ? Math.ceil(map.module_count * 1.5) : 0} Hours</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium text-slate-600">
                <span>0% Completed</span>
                <span>0/{map.module_count || 0}</span>
              </div>
              <ProgressBar progress={0} />
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
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

## `src/pages/Settings.tsx`

```tsx
import React, { useState } from 'react';
import { Card, Button, Input } from '../components/ui/Common';
import { Lock, User, Bell, Shield, Save } from 'lucide-react';
import api from '../services/api';

const Settings = () => {
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (passwordData.new_password !== passwordData.confirm_password) {
      setMessage({ type: 'error', text: "New passwords don't match" });
      return;
    }

    if (passwordData.new_password.length < 8) {
      setMessage({ type: 'error', text: "Password must be at least 8 characters long" });
      return;
    }

    try {
      setLoading(true);
      await api.put('/users/me/password', {
        old_password: passwordData.old_password,
        new_password: passwordData.new_password
      });
      setMessage({ type: 'success', text: "Password updated successfully" });
      setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
    } catch (err: any) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.error || "Failed to update password" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
       <div>
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-500 mt-1">Manage your account preferences and security.</p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar Navigation */}
          <div className="space-y-2">
             <button className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-lg text-brand-600 font-medium shadow-sm">
                <Shield size={20} />
                Security
             </button>
             <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                <User size={20} />
                Profile
             </button>
             <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                <Bell size={20} />
                Notifications
             </button>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-2 space-y-6">
             <Card title="Change Password">
                <form onSubmit={handlePasswordChange} className="space-y-4">
                   <Input 
                      label="Current Password" 
                      type="password"
                      value={passwordData.old_password}
                      onChange={(e) => setPasswordData({...passwordData, old_password: e.target.value})}
                      required
                   />
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input 
                         label="New Password" 
                         type="password"
                         value={passwordData.new_password}
                         onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                         required
                      />
                      <Input 
                         label="Confirm New Password" 
                         type="password"
                         value={passwordData.confirm_password}
                         onChange={(e) => setPasswordData({...passwordData, confirm_password: e.target.value})}
                         required
                      />
                   </div>

                   {message && (
                      <div className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                         {message.text}
                      </div>
                   )}

                   <div className="flex justify-end pt-2">
                      <Button type="submit" isLoading={loading} icon={<Save size={18} />}>
                         Update Password
                      </Button>
                   </div>
                </form>
             </Card>
          </div>
       </div>
    </div>
  );
};

export default Settings;

```

## `src/services/api.ts`

```typescript
import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: '/api', // Vite proxy will handle forwarding to http://localhost:3000
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for handling HTTP-only cookies
});

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized globally if needed (e.g., redirect to login)
    // We avoid infinite loops by checking a flag
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Optional: Clear any local state if you stored user info
      // window.location.href = '/login'; 
      // Note: Redirecting here might be abrupt, better handled in AuthContext or components
    }
    
    // Normalize error message
    const errorMessage = 
      error.response?.data?.error || 
      error.response?.data?.message || 
      error.message || 
      'Something went wrong';
      
    // You could attach the normalized message to the error object
    error.formattedMessage = errorMessage;

    return Promise.reject(error);
  }
);

export default api;

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

## `src/types/index.ts`

```typescript
export type Role = 'user' | 'admin' | 'creator';
export type Level = 'beginner' | 'intermediate' | 'advanced';
export type Status = 'draft' | 'published' | 'archived';
export type ProgressStatus = 'not_started' | 'in_progress' | 'completed';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type InterviewType = 'simulated' | 'prep_feedback';
export type EventStatus = 'planned' | 'done' | 'missed' | 'cancelled';
export type TemplateStyle = 'modern' | 'classic' | 'minimal';

export interface User {
  user_id: string;
  email: string;
  full_name: string;
  current_level: Level;
  role: Role;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Roadmap {
  roadmap_id: string;
  title: string;
  description: string | null;
  category: string;
  image_url: string | null;
  status: Status;
  created_at: string;
  updated_at: string;
  module_count?: number; // From list view
  modules?: Module[];    // From detail view
  created_by?: string;
}

export interface Module {
  module_id: string;
  roadmap_id: string;
  title: string;
  description: string | null;
  content: string | null;
  order_index: number;
  estimated_hours: number;
  created_at: string;
  updated_at: string;
}

export interface UserProgress {
  progress_id: string;
  user_id: string;
  module_id: string;
  status: ProgressStatus;
  completion_percentage: number;
  started_at: string | null;
  completed_at: string | null;
  last_accessed_at: string;
  created_at: string;
  updated_at: string;
}

export interface LearningEvent {
  event_id: string;
  user_id: string;
  title: string;
  description: string | null;
  start_time: string; // ISO
  end_time: string;   // ISO
  status: EventStatus;
  all_day?: boolean;
  color?: string;
  created_at: string;
  updated_at: string;
}

// Interview Interfaces
export interface InterviewSession {
  session_id: string;
  user_id: string;
  session_name: string;
  interview_type: InterviewType;
  questions: any; // JSON
  user_answers: any | null; // JSON
  ai_feedback: any | null; // JSON
  score: number | null;
  created_at: string;
}

// API Response Wrappers
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error: string | null;
}

export interface AuthResponse {
  user_id: string;
  email: string;
  full_name: string;
  current_level: Level;
  role: Role;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface DashboardOverview {
  enrolled_roadmaps: number;
  completed_modules: number;
  average_completion: string; // "0.00"
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
        port: 5173,
        host: '0.0.0.0',
        proxy: {
          '/api': {
            target: 'http://localhost:3000',
            changeOrigin: true,
            secure: false,
          },
          '/interviews': {
            target: 'http://localhost:3000',
            changeOrigin: true,
            ws: true,
            secure: false
          }
        }
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

---

*Total files included: 30*