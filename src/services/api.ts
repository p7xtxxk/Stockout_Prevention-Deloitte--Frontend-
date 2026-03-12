import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: '/api' // This will be intercepted/mocked
});

// A simple utility to simulate network latency
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default api;
