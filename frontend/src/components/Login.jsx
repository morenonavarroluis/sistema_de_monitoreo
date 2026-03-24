import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';
function Login() {
  const baseUrl = import.meta.env.VITE_API_URL;
  const [usuario, setUsuario] = useState(''); // Cambiado de email a usuario
  const { setUser } = useAuth();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

 const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  
  try {
    const response = await api.post(`auth/login`, { 
      usuario: usuario, 
      password: password 
    });
    
    console.log("Data recibida:", response.data);
    const token = response.data.access_token;

    if (token) {
      // 1. Objeto con la información del usuario
      const userData = {
        username: response.data.user_name,
        permisos: response.data.permissions
      };

      // 2. Guardar en localStorage (El token y el objeto de usuario)
      localStorage.setItem('token', token); 
      localStorage.setItem('user_data', JSON.stringify(userData)); // <--- CRUCIAL para la recarga

      // 3. Configurar el header de la instancia de API inmediatamente
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // 4. Actualizar el estado global del contexto
      setUser(userData);

      // 5. Navegar a la ruta protegida
      navigate('/clear_port', { replace: true });
    }

  } catch (error) {
    console.error('Error:', error);
    // Manejo de errores con SweetAlert
    Swal.fire({
      icon: "error",
      title: "Error de acceso",
      text: error.response?.data?.detail || "Usuario o contraseña incorrectos",
    });
  } finally {
    setIsLoading(false); 
  }
};

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center sm:py-12">
      <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
        
        <div className="bg-white shadow-xl w-full rounded-lg divide-y divide-gray-200">
          {/* 3. Agregamos el onSubmit al formulario */}
          <form className="px-5 py-7" onSubmit={handleSubmit}>
        <h1 className="font-bold text-center text-2xl mb-5 text-gray-800">Sistema de Monitoreo</h1>  
            <label className="font-semibold text-sm text-gray-600 pb-1 block">Usuario</label>
            <input 
              type="text" 
              required
              className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full focus:ring-blue-500 focus:border-blue-500 outline-none" 
              placeholder="Pmoreno"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)} 
            />
            
            <label className="font-semibold text-sm text-gray-600 pb-1 block">Contraseña</label>
            <input 
              type="password" 
              required
              className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full focus:ring-blue-500 focus:border-blue-500 outline-none" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // 4. Sincronizamos el estado
            />
            
            {/* El botón debe ser tipo 'submit' */}
            <button 
              type="submit" 
              className="transition duration-200 bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
            disabled={isLoading}>
              
              {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
            </button>
          </form>
          

        </div>
      </div>
    </div>
  );
}

export default Login;