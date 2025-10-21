// API service for backend communication
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
VITE_API_URL = https://time-adventures-backend.vercel.app/api

const api = {
  // User APIs
  userAPI: {
    login: async (username, email) => {
      const response = await fetch(`${API_URL}users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email }),
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      
      return response.json();
    },
  },

  // Stories APIs
  storiesAPI: {
    getAllStories: async () => {
      const response = await fetch(`${API_URL}stories`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch stories');
      }
      
      return response.json();
    },
  },

  // Progress APIs
  progressAPI: {
    getUserProgress: async (userId) => {
      const response = await fetch(`${API_URL}progress/${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch progress');
      }
      
      return response.json();
    },

    updateProgress: async (data) => {
      const response = await fetch(`${API_URL}progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update progress');
      }
      
      return response.json();
    },

    getUserStats: async (userId) => {
      const response = await fetch(`${API_URL}progress/${userId}stats`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }
      
      return response.json();
    },
  },
};

export default api;
