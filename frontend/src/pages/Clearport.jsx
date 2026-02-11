import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header'; 
import Table from '../components/Table'; 
import api from '../services/api';   
import { usePorts } from '../hooks/usePorts';
import { useIpsUser } from '../hooks/ipsUser'; 
import Modal from '../components/Modal';
import { usePortScanner } from '../hooks/usePortScanner'; 
import { ProgressBar } from '../components/ProgressBar';

function ClearPort() {
  const { data, clearPorts, clearPortIndividual } = usePorts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: ipsRegistradas, registrarNuevaIp } = useIpsUser();
  const { progress, log, loading, currentDevice, startScanning } = usePortScanner();
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

const columnsPuertos = [
  { label: 'Dirección IP' },
  { label: 'Nombre del Switch' },
  { label: 'Acciones SSH', className: 'text-center' }
];

const renderRowPuertos = (item, index) => (
  <tr key={index} className="hover:bg-blue-50/50">
    <td className="px-6 py-4 font-mono text-blue-600">{item.ip_port}</td>
    <td className="px-6 py-4 font-medium text-gray-900">{item.nombre}</td>
    <td className="px-6 py-4 text-center">
      <button 
        onClick={() => startScanning(item.ip_port)}
        className="bg-indigo-600 text-white px-4 py-2 rounded text-xs font-bold"
      >
        Limpiar Puerto
      </button>
    </td>
  </tr>
);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-8">
          
          {/* SECCIÓN DE ACCIONES */}
          <div className='mb-6 flex items-center justify-between bg-white p-4 rounded-lg shadow-sm'>
            <div>
              <button 
                className={`font-bold py-2 px-6 rounded shadow-md transition-all ${
                  loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`} 
                onClick={startScanning} // 3. Conectamos la función del hook
                disabled={loading}
              >
                {loading ? 'Procesando Switches...' : 'Limpiar Todos los Puertos'}
              </button>

              <button 
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded shadow-md ml-3 transition-all" 
                onClick={() => setIsModalOpen(true)}
              >
                + Registrar IP
              </button>
            </div>

            {/* Indicador visual de estado */}
            {loading && (
              <div className="text-right">
                <span className="text-sm font-medium text-blue-600 animate-pulse">
                  Conectando a: {currentDevice || 'Iniciando...'}
                </span>
              </div>
            )}
          </div>

          {/* 4. BARRA DE PROGRESO (Solo visible si hay progreso o carga) */}
          {(loading || progress > 0) && (
            <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-blue-100">
                <div className="flex justify-between mb-2">
                    <span className="text-sm font-bold text-gray-700">Progreso de Tarea Masiva</span>
                    <span className="text-sm font-bold text-blue-600">{progress}%</span>
                </div>
                <ProgressBar progress={progress} />
                
                {/* Opcional: Mini Log debajo de la barra */}
                {loading && (
                    <p className="text-xs text-gray-500 mt-2 italic">
                        No cierre esta ventana hasta finalizar el proceso SSH.
                    </p>
                )}
            </div>
          )}

          {/* TABLA DE RESULTADOS */}
          <div className="grid">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Inventario de Dispositivos</h3>
            <Table 
            data={data} 
            clearPortIndividual={(ip) => startScanning(ip)} 
            columns={columnsPuertos} 
            renderRow={renderRowPuertos} 
            loading={loading}
          />
          </div>

        </main>
      </div>
      
      {/* MODAL DE REGISTRO (Sin cambios significativos) */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Registrar Nueva IP"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ... tus campos de input actuales ... */}
          {/* Nota: Asegúrate que el value coincida con la key del formData, ej: value={formData.nombre} */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre Switch</label>
            <input 
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              type="text" 
              className="mt-1 block w-full border rounded-md p-2" 
              placeholder="Switch Principal" 
              required
            />
          </div>
          {/* ... resto de campos ... */}
          <div className="flex gap-2 pt-4">
            <button type="submit" className="w-full bg-green-500 text-white py-2 rounded font-bold">Guardar</button>
            <button type="button" onClick={() => setIsModalOpen(false)} className="w-full bg-gray-200 py-2 rounded font-bold">Cancelar</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default ClearPort;