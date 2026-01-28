import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      login: (userData, token) => {
        // Store token in localStorage for API calls
        if (token) {
          localStorage.setItem('token', token);
        }
        set({ user: userData, token, isAuthenticated: true });
      },
      logout: () => {
        // Remove token from localStorage
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
      },
      setLoading: (loading) => set({ loading }),
      setUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage', // name of the item in localStorage
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }), // only persist these fields
    }
  )
);
