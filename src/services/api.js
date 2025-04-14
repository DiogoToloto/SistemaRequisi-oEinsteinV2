import axios from 'axios';

const api = axios.create({
  baseURL: 'https://backendsistemaeinsteinv2.onrender.com'
});

export default api;
