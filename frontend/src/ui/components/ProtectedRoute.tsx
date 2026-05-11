import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface ProtectedRouteProps {
    allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
    const token = sessionStorage.getItem('jwt_token');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    try {
        const decodedToken: any = jwtDecode(token);

        if (decodedToken.exp && decodedToken.exp * 1000 < Date.now()) {
            console.warn("Токенот е временски истечен. Ве одјавуваме...");
            sessionStorage.removeItem('jwt_token');
            return <Navigate to="/login" replace />;
        }

        const userRole = decodedToken.role || decodedToken.authorities?.[0] || 'USER';

        if (allowedRoles && !allowedRoles.includes(userRole)) {
            return <Navigate to="/" replace />;
        }

        return <Outlet />;

    } catch (error) {
        console.error("Невалиден токен:", error);
        sessionStorage.removeItem('jwt_token');
        return <Navigate to="/login" replace />;
    }
};

export default ProtectedRoute;