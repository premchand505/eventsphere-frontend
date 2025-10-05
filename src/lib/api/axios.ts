import axios from 'axios';

const apiClient = axios.create({
  // This points to the address of our running NestJS backend
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;