import axios from 'axios';

export const apiClient = axios.create({
  // Use the root URL, we will include /api in the requests
  baseURL: '/',
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  // Extract token from localStorage (if running in browser)
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized errors
      console.warn('Unauthorized request');
      
      // If we get a 401, the token is likely invalid/expired. Clean it up.
      if (typeof window !== 'undefined') {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('username');
        // In a real app, you might want to redirect to /signin here using window.location.href
      }
    }
    return Promise.reject(error);
  }
);
