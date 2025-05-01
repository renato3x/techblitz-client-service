import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_MAIN_SERVER_URL,
  withCredentials: true,
});
