import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Swal from 'sweetalert2';
function Login() {
  const baseUrl = import.meta.env.VITE_API_URL;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Para feedback visual
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      const response = await api.post(`${baseUrl}auth/login`, { email, password });

      const data = response.data;

      if (data.status === "success") {
        // localStorage.setItem('token', data.token); 

        // 4. REDIRECCIONAR AL DASHBOARD
          navigate('/clear_port'); 
      } else {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Usuario o contraseña incorrectos",
            // footer: '<a href="">¿Olvidaste tu contraseña?</a>'
          });
      }
    } catch (error) {
      console.error('Error:', error);
    }finally {
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
            <label className="font-semibold text-sm text-gray-600 pb-1 block">Correo Electrónico</label>
            <input 
              type="email" 
              required
              className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full focus:ring-blue-500 focus:border-blue-500 outline-none" 
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // 4. Sincronizamos el estado
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
          
          {/* <div className="py-5">
            <div className="grid grid-cols-2 gap-1">
              <div className="text-center sm:text-left whitespace-nowrap">
                <button className="transition duration-200 mx-5 px-5 py-4 cursor-pointer font-normal text-sm rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none">
                  <span className="inline-block ml-1">¿Olvidaste tu contraseña?</span>
                </button>
              </div>
              <div className="text-center sm:text-right whitespace-nowrap">
                <button className="transition duration-200 mx-5 px-5 py-4 cursor-pointer font-normal text-sm rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none">
                  <span className="inline-block ml-1">Registrarse</span>
                </button>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default Login;