"use client";

import { useAuthStore } from '@saloon/store';
import { useEffect, useState } from 'react';

// This hook provides a safe way to access authentication state on the client,
// ensuring it doesn't cause hydration mismatches with server-rendering.
export const useAuth = () => {
  const { user, token, isAuthenticated } = useAuthStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This effect runs only on the client, after the initial render.
    setIsClient(true);
  }, []);

  return {
    user: isClient ? user : null,
    token: isClient ? token : null,
    isAuthenticated: isClient ? isAuthenticated : false,
  };
};
