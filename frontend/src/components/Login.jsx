import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Swal from 'sweetalert2';
function Login() {
  const baseUrl = import.meta.env.VITE_API_URL;
  const [usuario, setUsuario] = useState(''); // Cambiado de email a usuario
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
 const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Nota: Si 'api' ya tiene baseURL, no necesitas `${baseUrl}`
      const response = await api.post(`auth/login`, { 
        usuario: usuario, 
        password: password 
      });

      const data = response.data;

      // IMPORTANTE: FastAPI devuelve 'access_token', no 'token' ni 'status'
      // Si usas la lógica de OAuth2 que armamos antes, el check es así:
      if (data.access_token) {
        localStorage.setItem('token', data.access_token); 
        navigate('/clear_port'); 
      } else {
        throw new Error("No se recibió el token");
      }

    } catch (error) {
      console.error('Error:', error);
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