import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useContexts';

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();

    console.log("Admin Guard Status:", { loading, user });

    if (loading) {
        return <div className="h-screen bg-[#0b141a] text-white flex items-center justify-center font-bold">Checking Admin Rights...</div>;
    }

    if (user && user.isAdmin === true) {
        console.log("Access Granted to Admin");
        return children;
    }

    console.log("Access Denied: Redirecting to Home");
    return <Navigate to="/" replace />;
};

export default AdminRoute;