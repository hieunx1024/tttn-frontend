import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const useRoleRedirect = () => {
    const { user, isAuthenticated, isLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // If logged in, but role is null or 'USER' (default/no role), force redirect to select-role
        // specific check to avoid loop if already on select-role
        if (
            !isLoading &&
            isAuthenticated &&
            (!user?.role || user?.role?.name === 'USER') &&
            location.pathname !== '/select-role'
        ) {
            navigate('/select-role', { replace: true });
        }
    }, [isLoading, isAuthenticated, user, navigate, location]);
};

export default useRoleRedirect;
