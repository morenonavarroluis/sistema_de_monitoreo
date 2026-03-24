// src/routes/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ requiredPermission }) => {
  const { hasPermission, user, loading } = useAuth(); //

  // Mientras se recupera el usuario del localStorage, no hacemos nada
  if (loading) {
    return <div>Cargando...</div>; 
  }

  // Si después de cargar no hay usuario, al login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Si no tiene el permiso exacto (ej: "limpiar_port"), a unauthorized
  if (!hasPermission(requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};