import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { GlassCard, Button, Input } from '@/components/common/UIComponents';
import { containerVariants, itemVariants } from '@/utils/animations';
import { authService, urlService } from '@/services';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [urls, setUrls] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [formData, setFormData] = useState({ name: user?.name || '' });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Fetch user URLs and calculate stats
    const fetchUserStats = async () => {
      setStatsLoading(true);
      try {
        const { data } = await urlService.getUserUrls({ page: 1, limit: 1000 }); // Get all URLs
        setUrls(data.urls || []);
      } catch (error) {
        console.error('Failed to fetch user URLs:', error);
        toast.error('Failed to fetch user data');
      } finally {
        setStatsLoading(false);
      }
    };
    
    fetchUserStats();
  }, [isAuthenticated, navigate]);

  // Calculate stats from URLs data
  const totalLinks = urls.length;
  const totalClicks = urls.reduce((sum, url) => sum + (url.totalClicks || 0), 0);
  const avgClicks = totalLinks > 0 ? Math.round(totalClicks / totalLinks) : 0;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await authService.updateProfile(formData);
      setUser(data.user);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div className="max-w-4xl mx-auto space-y-8" variants={containerVariants} initial="initial" animate="animate">
      {/* Header Section */}
      <motion.div variants={itemVariants}>
        <GlassCard className="bg-gradient-to-br from-indigo-500/10 to-purple-600/10 border border-indigo-400/30">
          <div className="text-center py-8">
            <motion.div 
              className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-2xl shadow-purple-500/30"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ duration: 0.3 }}
            >
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </motion.div>
            <motion.h1 
              className="text-4xl font-bold text-white mb-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {user?.name || 'User'}
            </motion.h1>
            <motion.p 
              className="text-gray-300 text-lg"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {user?.email}
            </motion.p>
            <motion.div 
              className="flex items-center justify-center gap-2 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm text-green-400 font-medium">Active</span>
            </motion.div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Stats Section */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5, scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <GlassCard className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-400/30 text-center py-8">
            {statsLoading ? (
              <div className="flex justify-center items-center h-16">
                <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                <motion.div 
                  className="text-5xl mb-4"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  🔗
                </motion.div>
                <motion.h3 
                  className="text-3xl font-bold text-blue-400 mb-2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {totalLinks}
                </motion.h3>
                <p className="text-gray-300 font-medium">Total Links</p>
              </>
            )}
          </GlassCard>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5, scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <GlassCard className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-400/30 text-center py-8">
            {statsLoading ? (
              <div className="flex justify-center items-center h-16">
                <div className="w-8 h-8 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                <motion.div 
                  className="text-5xl mb-4"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  📊
                </motion.div>
                <motion.h3 
                  className="text-3xl font-bold text-green-400 mb-2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  {totalClicks}
                </motion.h3>
                <p className="text-gray-300 font-medium">Total Clicks</p>
              </>
            )}
          </GlassCard>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5, scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <GlassCard className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30 text-center py-8">
            {statsLoading ? (
              <div className="flex justify-center items-center h-16">
                <div className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                <motion.div 
                  className="text-5xl mb-4"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  ⚡
                </motion.div>
                <motion.h3 
                  className="text-3xl font-bold text-purple-400 mb-2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  {avgClicks}
                </motion.h3>
                <p className="text-gray-300 font-medium">Avg. Clicks</p>
              </>
            )}
          </GlassCard>
        </motion.div>
      </motion.div>

      {/* Profile Management Section */}
      <motion.div variants={itemVariants}>
        <GlassCard>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Profile Settings</h2>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {!isEditing ? (
                <Button 
                  variant="primary" 
                  onClick={() => setIsEditing(true)}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                >
                  ✏️ Edit Profile
                </Button>
              ) : (
                <Button 
                  variant="secondary" 
                  onClick={() => setIsEditing(false)}
                  className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700"
                >
                  ❌ Cancel
                </Button>
              )}
            </motion.div>
          </div>

          {!isEditing ? (
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-gradient-to-r from-slate-700/30 to-slate-800/30 rounded-xl border border-white/10">
                  <p className="text-sm text-gray-400 mb-2 font-medium">Full Name</p>
                  <p className="text-xl font-semibold text-white">{user?.name || 'Not set'}</p>
                </div>
                <div className="p-6 bg-gradient-to-r from-slate-700/30 to-slate-800/30 rounded-xl border border-white/10">
                  <p className="text-sm text-gray-400 mb-2 font-medium">Email Address</p>
                  <p className="text-xl font-semibold text-white">{user?.email}</p>
                </div>
                <div className="p-6 bg-gradient-to-r from-slate-700/30 to-slate-800/30 rounded-xl border border-white/10">
                  <p className="text-sm text-gray-400 mb-2 font-medium">Account Status</p>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                    <p className="text-xl font-semibold text-green-400">Active</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.form 
              onSubmit={handleSubmit} 
              className="space-y-6"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  name="name"
                  label="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600/30"
                />
                <div className="p-6 bg-gradient-to-r from-slate-700/30 to-slate-800/30 rounded-xl border border-white/10">
                  <p className="text-sm text-gray-400 mb-2 font-medium">Email Address</p>
                  <p className="text-lg font-semibold text-white">{user?.email}</p>
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>
              </div>
              
              <div className="flex gap-4 pt-6">
                <motion.div 
                  className="flex-1"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    type="submit" 
                    variant="primary" 
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700" 
                    disabled={isLoading}
                  >
                    {isLoading ? '⏳ Saving...' : '💾 Save Changes'}
                  </Button>
                </motion.div>
                <motion.div 
                  className="flex-1"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    type="button" 
                    variant="secondary" 
                    className="w-full bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700"
                    onClick={() => setIsEditing(false)}
                  >
                    ❌ Cancel
                  </Button>
                </motion.div>
              </div>
            </motion.form>
          )}
        </GlassCard>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <GlassCard>
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="secondary" 
                className="w-full bg-gradient-to-r from-blue-500/30 to-indigo-500/30 hover:from-blue-500/40 hover:to-indigo-500/40 border-blue-400/30"
                onClick={() => navigate('/dashboard')}
              >
                📊 Dashboard
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="secondary" 
                className="w-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 hover:from-purple-500/40 hover:to-pink-500/40 border-purple-400/30"
                onClick={() => navigate('/create')}
              >
                🔗 Create Link
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="danger" 
                className="w-full bg-gradient-to-r from-red-500/30 to-rose-500/30 hover:from-red-500/40 hover:to-rose-500/40 border-red-400/30"
                onClick={() => {
                  if (confirm('Are you sure you want to logout?')) {
                    navigate('/login');
                  }
                }}
              >
                🚪 Logout
              </Button>
            </motion.div>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
};

export default ProfilePage;
