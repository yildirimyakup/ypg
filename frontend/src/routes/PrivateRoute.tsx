import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type {JSX} from "react";

const PrivateRoute = ({
                          children,
                          requiredRole
                      }: {
    children: JSX.Element;
    requiredRole: 'ogretmen' | 'ogrenci';
}) => {
    const { isAuthenticated, rol } = useAuth();
    console.log("Burası :   " ,isAuthenticated, rol);
    if (!isAuthenticated) return <Navigate to="/" />;
    if (rol !== requiredRole) return <Navigate to="/" />;

    return children;
};

export default PrivateRoute;
