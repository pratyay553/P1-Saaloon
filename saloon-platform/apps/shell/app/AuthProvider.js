"use client";

import { useEffect } from 'react';
import { useAuthStore } from '@saloon/store';
import { apiClient } from '@saloon/network';

export function AuthProvider({ children }) {
  const { token, user, setUser, logout } = useAuthStore();

  useEffect(() => {
    // If we have a token but no user, try to fetch the profile
    if (token && !user) {
      const fetchProfile = async () => {
        try {
          // Temporarily set the token on the apiClient so it's included in this request
          // Our interceptor will handle this for future requests, but we need it here initially
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          const response = await apiClient.get('/api/users/me');
          setUser(response.data);
        } catch (error) {
          console.error("Failed to fetch user profile, logging out.", error);
          logout();
        }
      };

      fetchProfile();
    }
  }, [token, user, setUser, logout]);

  return <>{children}</>;
}
