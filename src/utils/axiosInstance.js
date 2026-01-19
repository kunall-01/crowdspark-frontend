import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND, // No need to add `/api` if not used in routes
  withCredentials: true, // Ensures cookies are sent with every request
});

export default instance;
