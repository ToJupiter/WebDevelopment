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