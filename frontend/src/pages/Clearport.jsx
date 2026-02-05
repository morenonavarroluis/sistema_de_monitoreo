import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header'; 
import Table from '../components/Table'; 
import api from '../services/api';   
import { usePorts } from '../hooks/usePorts';
import { useIpsUser } from '../hooks/ipsUser'; 
import Modal from '../components/Modal';

function ClearPort() {
  const { data, clearPorts, clearPortIndividual, loading } = usePorts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: ipsRegistradas, registrarNuevaIp } = useIpsUser();

  // 1. Definimos el estado inicial del formulario
  const [formData, setFormData] = useState({
    ip: '',
    nombre: '',
    user_ip: '',
    pass_ip: '',
    description: ''
  });

  // 2. Función para actualizar el estado cuando el usuario escribe
  const handleChange = (e) => {
    const { name, value } = e.target;
    
      setFormData({ ...formData, [e.target.name]: e.target.value });
    
  };

  // 3. Función que maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    // PASAMOS LOS DATOS AQUÍ
    const success = await registrarNuevaIp(formData);
    
    if (success) {
      setIsModalOpen(false);
      setFormData({ ip: '', nombre: '', user_ip: '', pass_ip: '', description: '' });
    }
  };

  return (
     <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-8">
          <div className='mb-4'>
            <button 
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
              onClick={clearPorts} 
              disabled={loading}
            >
              {loading ? 'Procesando...' : 'Limpiar Todos los Puertos'}
            </button>

            <button 
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2" 
              onClick={() => setIsModalOpen(true)}
            >
              Registrar Ip
            </button>
          </div>
          <div className="grid ">
            <Table data={data} clearPortIndividual={clearPortIndividual} />
          </div>
        </main>
      </div>
       
     <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Registrar Nueva IP"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Dirección IP</label>
            <input 
              name="ip"
              value={formData.ip}
              onChange={handleChange}
              type="text" 
              className="mt-1 block w-full border rounded-md p-2" 
              placeholder="192.168.1.1" 
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre Switch</label>
            <input 
              name="nombre"
              value={formData.nombreSwitch}
              onChange={handleChange}
              type="text" 
              className="mt-1 block w-full border rounded-md p-2" 
              placeholder="Switch Principal" 
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Usuario</label>
            <input 
              name="user_ip"
              value={formData.usuario}
              onChange={handleChange}
              type="text" 
              className="mt-1 block w-full border rounded-md p-2" 
              placeholder="admin" 
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña switch</label>
            <input 
              name="pass_ip"
              value={formData.password}
              onChange={handleChange}
              type="password" 
              className="mt-1 block w-full border rounded-md p-2" 
              placeholder="********" 
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Marca</label>
            <input 
              name="description"
              value={formData.marca}
              onChange={handleChange}
              type="text" 
              className="mt-1 block w-full border rounded-md p-2" 
              placeholder="Cisco, HP, etc." 
              required
            />
          </div>

          <div className="flex gap-2">
            <button 
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded font-bold transition-colors"
            >
              Guardar IP
            </button>
            
            <button 
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="w-full bg-gray-200 text-gray-700 py-2 rounded font-bold"
            >
              Cancelar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default ClearPort;