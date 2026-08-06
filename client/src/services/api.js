import axios from 'axios';
import toast from 'react-hot-toast';

const API = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL 
        ? `${import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "")}/api/v1` 
        : 'http://localhost:5000/api/v1',
    withCredentials: true
});

API.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const url = error.config?.url || "";

        // 1. SILENCE: Initial auth check should NOT show a popup.
        // If the user isn't logged in, it's not a "failure", it's just a state.
        if (status === 401 && url.includes('/users/me')) {
            return Promise.reject(error);
        }

        // 2. Handle Network Errors (Server offline)
        if (!error.response) {
            // Only show this once
            toast.error("Network error: Server may be starting up...");
            return Promise.reject(error);
        }

        // 3. SILENCE: 401s on other routes (handled by ProtectedRoute/Redirects)
        if (status === 401) {
            return Promise.reject(error);
        }

        // 4. SHOW TOAST: Only for real errors (Wrong password, 500, etc.)
        const message = error.response.data?.message || "Something went wrong";
        toast.error(message); 
        
        return Promise.reject(error);
    }
);

export default API;