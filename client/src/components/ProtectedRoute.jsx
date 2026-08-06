import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useContexts';

const ProtectedRoute = () => {
    const { user, loading } = useAuth();

    // 1. While checking the server, show a spinner (not a blank screen)
    if (loading) {
        return (
            <div className="h-screen w-screen bg-[#0b141a] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // 2. If no user, redirect to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;