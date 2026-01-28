import './styles/globals.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthCheck } from './hooks/useAuth.js';
import { MainLayout } from './components/Layout/MainLayout.jsx';
import HomePage from './pages/HomePage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import CreatePage from './pages/CreatePage.jsx';
import AnalyticsPage from './pages/AnalyticsPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import { useAuthStore } from './context/store.js';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuthStore();
  
  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }
  
  return isAuthenticated ? <MainLayout>{children}</MainLayout> : <Navigate to="/login" />;
};

function App() {
  useAuthCheck();

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
          <Route path="/login" element={<AuthPage isLogin={true} />} />
          <Route path="/register" element={<AuthPage isLogin={false} />} />
          <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/create" element={<PrivateRoute><CreatePage /></PrivateRoute>} />
          <Route path="/edit/:id" element={<PrivateRoute><CreatePage /></PrivateRoute>} />
          <Route path="/analytics/:id" element={<PrivateRoute><AnalyticsPage /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="/404" element={<MainLayout><NotFoundPage /></MainLayout>} />
          <Route path="*" element={<MainLayout><NotFoundPage /></MainLayout>} />
        </Routes>
        <Toaster position="bottom-right" />
      </Router>
    </div>
  );
}

export default App;
