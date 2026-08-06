import axios from 'axios';
import toast from 'react-hot-toast';

const API = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1`,
    withCredentials: true
});

API.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const message = error.response?.data?.message || "Something went wrong";

        // SILENCE ONLY the initial auto-login check
        if (status === 401 && error.config.url.includes('/users/me')) {
            return Promise.reject(error);
        }

        // SHOW TOAST for everything else (including wrong passwords on /login)
        toast.error(message); 
        return Promise.reject(error);
    }
);

export default API;