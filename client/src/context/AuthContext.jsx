import { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // 1. Initial Authentication Check
  useEffect(() => {
    const checkAuth = async () => {
        try {
            const { data } = await API.get('/users/me');
            if (data.success) {
                setUser(data.user);
            }
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false); 
        }
    };
    checkAuth();
}, []);

    // 2. Login Logic
    const login = async (email, password) => {
        try {
            const { data } = await API.post('/auth/login', { email, password });
            if (data.success) {
                setUser(data.user);
                toast.success(`Welcome back, ${data.user.firstName}!`);
                return data;
            }
        } catch (error) {
            // Error toast is handled by services/api.js (Axios Interceptor)
            throw error; 
        }
    };

    // 3. Logout Logic
    const logout = async () => {
        const loadingToast = toast.loading("Logging out...");
        try {
            await API.get('/auth/logout'); // Clear cookie on server
            setUser(null); // Reset local state
            toast.success("See you soon!", { id: loadingToast });
            
            // Note: App.jsx ProtectedRoute will auto-redirect to /login
        } catch (error) {
            setUser(null); // Clear local state anyway for security
            toast.dismiss(loadingToast);
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
            {!loading ? (
                children
            ) : (
                /* Premium Dark Loading Screen to match the theme */
                <div className="h-screen w-full bg-[#0b141a] flex flex-col items-center justify-center">
                    <div className="relative">
                        {/* Animated Glow */}
                        <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse"></div>
                        {/* Spinner */}
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin relative z-10"></div>
                    </div>
                    <p className="mt-4 text-slate-500 text-xs font-bold uppercase tracking-[0.3em] animate-pulse">
                        Securing Session
                    </p>
                </div>
            )}
        </AuthContext.Provider>
    );
};

// Custom Hook for easier access
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};