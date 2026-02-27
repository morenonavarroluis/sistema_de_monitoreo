// src/routes/AppRouter.js
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute'; // Tu componente de validación

// Importación de componentes
import Login from '../components/Login';
import Dashboard from '../pages/Dashboard';
import Monitoreo from '../pages/Monitoreo';
import ClearPort from '../pages/Clearport';
import Reportes from '../pages/Reportes';
import Usuarios from '../pages/Usuarios';
import Unauthorized from '../pages/Unauthorized';

export const AppRouter = () => {
  return (
    <Routes>
      {/* RUTAS PÚBLICAS */}
      <Route path="/" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* RUTAS PROTEGIDAS */}
      
      {/* Grupo: Gestión de Usuarios */}
      <Route element={<ProtectedRoute requiredPermission="ver_usuarios" />}>
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      {/* Grupo: Puertos e Infraestructura */}
      <Route element={<ProtectedRoute requiredPermission="gestionar_puertos" />}>
        <Route path="/clear_port" element={<ClearPort />} />
      </Route>

      {/* Grupo: Monitoreo y Reportes */}
      <Route element={<ProtectedRoute requiredPermission="ver_reportes_ping" />}>
        <Route path="/reportes" element={<Reportes />} />
        <Route path="/monitoreo" element={<Monitoreo />} />
      </Route>

      {/* Catch-all: Si la ruta no existe, al Login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};