import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: '/api', // Vite proxy will handle forwarding to http://localhost:3000
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for handling HTTP-only cookies
});

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized globally if needed (e.g., redirect to login)
    // We avoid infinite loops by checking a flag
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Optional: Clear any local state if you stored user info
      // window.location.href = '/login'; 
      // Note: Redirecting here might be abrupt, better handled in AuthContext or components
    }
    
    // Normalize error message
    const errorMessage = 
      error.response?.data?.error || 
      error.response?.data?.message || 
      error.message || 
      'Something went wrong';
      
    // You could attach the normalized message to the error object
    error.formattedMessage = errorMessage;

    return Promise.reject(error);
  }
);

export default api;
