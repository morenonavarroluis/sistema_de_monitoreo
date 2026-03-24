import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api'; // Asegúrate de importar tu instancia de axios

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Usamos useCallback para que la función sea estable y no cause re-renders infinitos
  const hasPermission = useCallback((permission) => {
    return user?.permisos?.includes(permission);
  }, [user]);

  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user_data');

      if (token && savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          
          // Configuramos el header de axios para que las peticiones 
          // que ocurran tras la recarga ya lleven el token
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } catch (e) {
          console.error("Error parseando user_data", e);
          localStorage.removeItem('token');
          localStorage.removeItem('user_data');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Función para cerrar sesión (útil tenerla aquí)
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_data');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, hasPermission, loading, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};