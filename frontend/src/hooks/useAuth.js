import { useEffect } from 'react';
import { useAuthStore } from '../context/store.js';
import { authService } from '../services/index.js';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const store = useAuthStore();

  const loginUser = async (email, password) => {
    store.setLoading(true);
    try {
      const { data } = await authService.login({ email, password });
      store.login(data.user, data.token);
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    } finally {
      store.setLoading(false);
    }
  };

  const registerUser = async (name, email, password) => {
    store.setLoading(true);
    try {
      const { data } = await authService.register({ name, email, password });
      // Don't login automatically since signup doesn't return token
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    } finally {
      store.setLoading(false);
    }
  };

  const logoutUser = () => {
    store.logout();
  };

  return {
    ...store,
    loginUser,
    registerUser,
    logoutUser,
  };
};

export const useAuthCheck = () => {
  const { user, isAuthenticated, setUser, token } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      // Check if we have a token in localStorage or store
      const storedToken = token || localStorage.getItem('token');
      
      if (storedToken && !user) {
        try {
          // Set token in localStorage for API calls
          if (!token) {
            localStorage.setItem('token', storedToken);
          }
          
          // Fetch user profile with the token
          const { data } = await authService.getProfile();
          setUser(data.user);
        } catch (error) {
          console.error('Failed to fetch profile:', error);
          // If token is invalid, clear it
          localStorage.removeItem('token');
          // This will trigger logout in the store
        }
      }
    };

    initializeAuth();
  }, [user, isAuthenticated, setUser, token]);
};
