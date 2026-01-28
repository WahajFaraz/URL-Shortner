import { motion } from 'framer-motion';
import { slideUp } from '../../utils/animations.js';
import { useState } from 'react';

export const GlassCard = ({ children, className = '', ...props }) => (
  <motion.div
    className={`backdrop-blur-lg bg-gradient-to-br from-white/8 to-white/3 border border-white/10 rounded-2xl p-8 shadow-xl transition-all duration-300 relative overflow-hidden ${className}`}
    {...slideUp}
    {...props}
  >
    {children}
  </motion.div>
);

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  ...props
}) => {
  const baseClasses = 'font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 border border-white/10',
    secondary: 'bg-gradient-to-r from-white/15 to-white/5 text-white border border-white/20 hover:from-white/25 hover:to-white/10 hover:border-white/30 backdrop-blur-sm',
    danger: 'bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-500 hover:to-rose-500 border border-red-400/20',
    success: 'bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-500 hover:to-green-500 border border-green-400/20',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.01 }}
      whileTap={{ scale: disabled ? 1 : 0.99 }}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

export const Input = ({ label, error, className = '', ...props }) => (
  <div className="space-y-3">
    {label && <label className="block text-sm font-semibold text-gray-200 tracking-wide">{label}</label>}
    <motion.input
      className={`w-full px-5 py-4 bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-600/40 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm hover:border-slate-500/50 ${className}`}
      whileFocus={{ scale: 1.01, y: -2 }}
      transition={{ duration: 0.2 }}
      {...props}
    />
    {error && <p className="text-red-400 text-sm font-medium animate-pulse">{error}</p>}
  </div>
);

export const PasswordInput = ({ label, error, className = '', ...props }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="space-y-3">
      {label && <label className="block text-sm font-semibold text-gray-200 tracking-wide">{label}</label>}
      <div className="relative">
        <motion.input
          className={`w-full px-5 py-4 pr-12 bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-600/40 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 focus:border-transparent transition-all duration-300 backdrop-blur-sm hover:border-slate-500/50 ${className}`}
          whileFocus={{ scale: 1.01, y: -2 }}
          transition={{ duration: 0.2 }}
          type={visible ? 'text' : 'password'}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? (
            // Eye-off
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 10.677A2 2 0 0012 14a2 2 0 001.323-.5" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7.362 7.561C5.68 8.738 4.279 10.418 3.5 12c1.5 3 5 7 8.5 7 1.442 0 2.806-.476 4.02-1.2" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.88 5.082A8.09 8.09 0 0112 4c3.5 0 7 4 8.5 8-.57 1.139-1.47 2.34-2.6 3.44" />
            </svg>
          ) : (
            // Eye
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          )}
        </button>
      </div>
      {error && <p className="text-red-400 text-sm font-medium animate-pulse">{error}</p>}
    </div>
  );
};

export const Select = ({ label, className = '', children, ...props }) => (
  <div className="space-y-3">
    {label && <label className="block text-sm font-semibold text-gray-200 tracking-wide">{label}</label>}
    <div className="relative">
      <motion.select
        className={`w-full px-5 py-4 bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-600/40 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 appearance-none cursor-pointer transition-all duration-300 backdrop-blur-sm hover:border-slate-500/50 ${className}`}
        whileFocus={{ scale: 1.01, y: -2 }}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {children}
      </motion.select>
      {/* Custom dropdown arrow */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  </div>
);

export const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-gradient-to-r from-indigo-500/30 to-purple-500/30 text-indigo-100 border border-indigo-400/40 shadow-lg shadow-indigo-500/20',
    success: 'bg-gradient-to-r from-emerald-500/30 to-green-500/30 text-emerald-100 border border-emerald-400/40 shadow-lg shadow-emerald-500/20',
    warning: 'bg-gradient-to-r from-yellow-500/30 to-amber-500/30 text-yellow-100 border border-yellow-400/40 shadow-lg shadow-yellow-500/20',
    danger: 'bg-gradient-to-r from-red-500/30 to-rose-500/30 text-red-100 border border-red-400/40 shadow-lg shadow-red-500/20',
  };

  return (
    <span className={`inline-block px-4 py-2 rounded-full text-xs font-bold tracking-wide uppercase ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

export const Spinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = { sm: 'w-6 h-6', md: 'w-10 h-10', lg: 'w-14 h-14' };
  
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        className={`${sizeClasses[size]} border-3 border-white/10 border-t-purple-500 rounded-full shadow-lg shadow-purple-500/20`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
};
