// src/context/AuthContext.jsx
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Función para validar si el permiso existe en el array que viene del backend
  const hasPermission = (permission) => {
    return user?.permisos?.includes(permission);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);