// AuthContext.js
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    // Aquí recibes el objeto 'data[0]' de tu backend
    setUser(userData);
  };

  const hasPermission = (permission) => {
    return user?.permisos?.includes(permission);
  };

  return (
    <AuthContext.Provider value={{ user, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);