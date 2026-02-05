import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header'; 
import Table from '../components/Table'; 
import api from '../services/api';   
import { usePorts } from '../hooks/usePorts';
import Modal from '../components/Modal';

function ClearPort() {
  const { data, clearPorts, loading } = usePorts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
     <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-8">
          <div className='mb-4'>
            {/* Vinculamos la función al botón */}
            
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={clearPorts} disabled={loading}>
              {loading ? 'Procesando...' : 'Limpiar Todos los Puertos'}
            </button>

            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2" onClick={() => setIsModalOpen(true)}>
              Registrar Ip
            </button>
          </div>
          <div className="grid ">
            {/* Pasamos los datos del GET a la tabla */}
            <Table data={data} />
          </div>
        </main>
      </div>
       
       {/* --- ESTA ES LA PARTE QUE TE FALTABA --- */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Registrar Nueva IP"
      >
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Dirección IP</label>
            <input type="text" className="mt-1 block w-full border rounded-md p-2" placeholder="192.168.1.1" />
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-700">Nombre switch</label>
            <input type="text" className="mt-1 block w-full border rounded-md p-2" placeholder="Switch 1" />
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-700">usuario switch</label>
            <input type="text" className="mt-1 block w-full border rounded-md p-2" placeholder="Lperez" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">contraseña switch</label>
            <input type="password" className="mt-1 block w-full border rounded-md p-2" placeholder="Contraseña del switch" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Marca del switch</label>
            <input type="text" className="mt-1 block w-full border rounded-md p-2" placeholder="Marca del switch" />
          </div>

          <button 
            type="button"
            className="w-full bg-green-500 text-white py-2 rounded font-bold"
            onClick={() => {
                alert("IP Registrada (Simulación)");
                setIsModalOpen(false);
            }}
          >
            Guardar IP
          </button>
        </form>
      </Modal>
      {/* --------------------------------------- */}
      

    </div>
  );
}

export default ClearPort;