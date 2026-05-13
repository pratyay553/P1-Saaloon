import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      // Token is now in HttpOnly cookie, so we don't store it in Zustand directly
      // token: null, 
      isAuthenticated: false,
      
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      // setToken: (token) => set({ token }), // No longer needed as token is HttpOnly
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
        // Clear client-side storage that might hold old data
        if (typeof window !== 'undefined') {
             localStorage.removeItem('jwt_token'); // Clear old localStorage token if it exists
             localStorage.removeItem('username'); // Clear old localStorage username if it exists
             // Invalidate the is_auth cookie by setting its expiration to a past date
             document.cookie = "is_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        }
      },
    }),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
      // Only persist the user object, not the token
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
