import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth.js';
import { Button } from '../common/UIComponents.jsx';
import { slideDown } from '../../utils/animations.js';

export const Navbar = ({ onMenuToggle }) => {
  const { user, logoutUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled ? 'backdrop-blur-xl bg-white/10 dark:bg-white/5 border-b border-white/20' : ''
      }`}
      variants={slideDown}
      initial="initial"
      animate="animate"
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
            URLShort
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <motion.div 
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full border border-indigo-400/30"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse" />
                <motion.span 
                  className="text-sm font-medium text-white"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {user?.name}
                </motion.span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="sm" 
                  variant="secondary" 
                  onClick={() => navigate('/profile')}
                  className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 hover:from-purple-500/40 hover:to-pink-500/40 border-purple-400/40"
                >
                  👤 Profile
                </Button>
              </motion.div>
              <Button size="sm" variant="danger" onClick={logoutUser}>
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button size="sm" variant="secondary" onClick={() => navigate('/register')}>
                Sign Up
              </Button>
              <Button size="sm" variant="primary" onClick={() => navigate('/login')}>
                Login
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export const Sidebar = ({ isOpen, onClose }) => {
  const { isAuthenticated } = useAuth();
  const navigation = isAuthenticated
    ? [
        { name: 'Dashboard', href: '/dashboard', icon: '📊' },
        { name: 'Create Link', href: '/create', icon: '🔗' },
        { name: 'Analytics', href: '/analytics', icon: '📈' },
        { name: 'Profile', href: '/profile', icon: '👤' },
      ]
    : [
        { name: 'Home', href: '/', icon: '🏠' },
        { name: 'Login', href: '/login', icon: '🔓' },
      ];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 md:hidden z-30"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      <motion.aside
        className={`fixed md:relative left-0 top-0 h-screen w-64 bg-gradient-to-b from-gray-900 to-black border-r border-white/10 pt-20 md:pt-0 transform transition-transform md:translate-x-0 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        initial={false}
        animate={{ x: isOpen ? 0 : -256 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <nav className="p-4 space-y-2">
          {navigation.map(item => (
            <a
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors group"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
              <span className="font-medium group-hover:text-indigo-400">{item.name}</span>
            </a>
          ))}
        </nav>
      </motion.aside>
    </>
  );
};

export const Footer = () => (
  <footer className="border-t border-white/20 bg-white/5 backdrop-blur-sm mt-20">
    <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-300 text-sm">
      <p>&copy; 2026 URLShort. Built By Wahaj Faraz.</p>
    </div>
  </footer>
);
