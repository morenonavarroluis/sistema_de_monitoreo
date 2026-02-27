// src/routes/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ requiredPermission }) => {
  const { hasPermission, user } = useAuth();

  // Si no hay usuario (no está logueado), al login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Si no tiene el permiso, a unauthorized
  if (!hasPermission(requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Si todo está bien, renderiza la ruta hija
  return <Outlet />;
};