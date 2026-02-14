import axios from 'axios';

export const backendApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);