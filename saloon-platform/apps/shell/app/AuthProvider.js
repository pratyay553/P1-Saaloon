"use client";

import { useEffect } from 'react';
import { useAuthStore } from '@saloon/store';
import { apiClient } from '@saloon/network';
import { useRouter } from 'next/navigation';

export function AuthProvider({ children }) {
  const { user, setUser, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // When using HttpOnly cookies, the frontend cannot directly read the JWT token.
    // The presence of the 'is_auth' cookie (checked by middleware) and a successful call to /api/users/me
    // is how we determine authentication status and hydrate the user state.

    // If there's no user in the Zustand store, try to fetch it from the backend.
    // This handles initial load and refreshes.
    if (!user) {
      const fetchProfile = async () => {
        try {
          // The browser will automatically send the HttpOnly 'jwt_token' cookie with this request.
          const response = await apiClient.get('/api/users/me');
          setUser(response.data.data); // ApiResponse wraps the data
        } catch (error) {
          console.error("Failed to fetch user profile, logging out.", error);
          logout();
          // If /me fails, it means the token is invalid/expired. Redirect to login.
          router.push('/signin');
        }
      };

      // Only attempt to fetch profile if we are on the client side
      // and not already on a signin/signup page (to avoid infinite redirects)
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/signin') && !window.location.pathname.startsWith('/signup')) {
        fetchProfile();
      }
    }
  }, [user, setUser, logout, router]);

  return <>{children}</>;
}
