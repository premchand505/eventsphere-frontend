import axios from 'axios';

const apiClient = axios.create({
  // This points to the address of our running NestJS backend
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;