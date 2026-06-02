import axios from 'axios';

const BACKEND_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1/';

const api = axios.create({
  baseURL: BACKEND_URL,
  timeout: 10000,
});

export default api;