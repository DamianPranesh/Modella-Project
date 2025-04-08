import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: (import.meta.env.MODE === "development" || import.meta.env.DEV) 
    ? "http://localhost:5001/api" 
    : "https://modella-project.up.railway.app/api/v1",  // Explicit HTTPS URL
  withCredentials: true,
});
