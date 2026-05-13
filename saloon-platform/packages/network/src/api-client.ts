import axios from 'axios';

export const apiClient = axios.create({
  baseURL: '/',
  withCredentials: true, // Crucial for sending HttpOnly cookies
});

apiClient.interceptors.request.use((config) => {
  // With HttpOnly cookies, the browser automatically sends the 'jwt_token' cookie.
  // We no longer need to manually add the Authorization header from localStorage.
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized request. HttpOnly cookie likely expired or invalid.');
      // When using HttpOnly cookies, the frontend cannot directly clear the cookie.
      // The backend should handle clearing it on logout, or the cookie will naturally expire.
      // For client-side state, we still need to clear local storage and Zustand.
      if (typeof window !== 'undefined') {
        localStorage.removeItem('jwt_token'); // Clear old localStorage token if it exists
        localStorage.removeItem('username'); // Clear old localStorage username if it exists
        // The useAuthStore logout function will also handle clearing its state.
      }
      // A full page reload or redirect to login might be necessary here
      // window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);
