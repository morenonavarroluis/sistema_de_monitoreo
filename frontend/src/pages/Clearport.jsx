import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header'; 
import Table from '../components/Table'; 
import Modal from '../components/Modal';
import { ProgressBar } from '../components/ProgressBar';

// Hooks
import { usePorts } from '../hooks/usePorts';
import { useIpsUser } from '../hooks/ipsUser'; 
import { usePortScanner } from '../hooks/usePortScanner'; 

// Sub-componentes extraídos
import { RegisterIpForm } from '../components/RegisterIpForm';
import { PortTableRow } from '../components/PortTableRow';
import { EditIpForm } from '../components/EditIpForm';


function ClearPort() {
  const { data, loading: loadingPorts } = usePorts();
  const { registrarNuevaIp, actualizarIp,EditarSwitch,eliminarIp } = useIpsUser();
  const { progress, loading, currentDevice, startScanning } = usePortScanner();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSwitch, setSelectedSwitch] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const handleOpenEdit = (item) => {
  setSelectedSwitch(item);
  setIsEditModalOpen(true);
};
  const handleRegisterSubmit = async (formData) => {
    const success = await registrarNuevaIp(formData);
    if (success) setIsModalOpen(false);
  };


  const columnsPuertos = [
  { label: 'Dirección IP', key: 'ip_port' }, 
  { label: 'Nombre del Switch', key: 'nombre' }, 
  {
    label: 'Acciones',
    className: 'text-center',
    render: (item) => (
      <div className="flex gap-2 justify-center">
        <button 
          onClick={() => startScanning(item.ip_port)} // Antes handleClean
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-md text-xs font-bold transition-colors"
        >
          Limpiar Puerto
        </button>
        <button 
          onClick={() => handleOpenEdit(item)} // Antes handleEdit
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md text-xs font-bold transition-colors"
        >
          Editar
        </button>
        <button 
          onClick={() => eliminarIp(item.id)} 
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-xs font-bold transition-colors"
        >
          eliminar
        </button>
      </div>
    )
  }
];
   
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col">
        <Header onMenuOpen={() => setIsSidebarOpen(true)}/>
        <main className="p-8">
          
          <ActionHeader 
            loading={loading} 
            currentDevice={currentDevice} 
            onScanAll={startScanning} 
            onOpenModal={() => setIsModalOpen(true)} 
          />

          {(loading || progress > 0) && (
            <ProgressSection progress={progress} loading={loading} />
          )}

          <div className="grid">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Inventario de Dispositivos</h3>
            <Table 
              data={data} 
              columns={columnsPuertos} 
              renderRow={(item, index) => (
                <PortTableRow columns={columnsPuertos} key={index} item={item} onScan={startScanning} onEdit={handleOpenEdit} onDelete={eliminarIp}/>
              )} 
              loading={loadingPorts || loading}
            />
          </div>
        </main>
      </div>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Registrar Nueva IP">
        <RegisterIpForm 
          onSubmit={handleRegisterSubmit} 
          onCancel={() => setIsModalOpen(false)} 
        />
      </Modal>
      <Modal 
  isOpen={isEditModalOpen} 
  onClose={() => setIsEditModalOpen(false)} 
  title="Editar Dispositivo"
>
  <EditIpForm 
    onSubmit={EditarSwitch} 
    onCancel={() => setIsEditModalOpen(false)}
    initialData={selectedSwitch}
  />
</Modal>
    </div>
  );
}

// Puedes dejar componentes pequeños aquí abajo o en archivos separados
const ActionHeader = ({ loading, currentDevice, onScanAll, onOpenModal }) => (
  <div className='mb-6 flex flex-col md:flex-row md:items-center justify-between bg-white p-4 rounded-lg shadow-sm gap-4'>
    {/* Contenedor de Botones */}
    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
      <button 
        className={`font-bold py-2 px-6 rounded shadow-md transition-all w-full sm:w-auto ${
          loading ? 'bg-gray-400' : 'bg-blue-600 text-white hover:bg-blue-700'
        }`} 
        onClick={() => onScanAll()} 
        disabled={loading}
      >
        {loading ? 'Procesando...' : 'Limpiar Todos'}
      </button>
      
      <button 
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded w-full sm:w-auto transition-colors" 
        onClick={onOpenModal}
      >
        + Registrar IP
      </button>
    </div>

    {/* Estado de Conexión */}
    {loading && (
      <div className="flex items-center justify-center md:justify-end bg-blue-50 md:bg-transparent p-2 md:p-0 rounded-md">
        <span className="text-blue-600 animate-pulse text-sm font-medium">
          <span className="md:hidden">Estado: </span>Conectando: {currentDevice}
        </span>
      </div>
    )}
  </div>
);

const ProgressSection = ({ progress, loading }) => (
  <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-blue-100">
    <div className="flex justify-between mb-2">
      <span className="text-sm font-bold text-gray-700">Progreso de Tarea</span>
      <span className="text-sm font-bold text-blue-600">{progress}%</span>
    </div>
    <ProgressBar progress={progress} />
    
    {loading && (
      <p className="text-xs text-gray-500 mt-2 italic">
        No cierre esta ventana hasta finalizar el proceso SSH.
      </p>
    )}
  </div>
);

export default ClearPort;