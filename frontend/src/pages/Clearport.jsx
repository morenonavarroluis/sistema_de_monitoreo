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
  const handleOpenEdit = (item) => {
  setSelectedSwitch(item);
  setIsEditModalOpen(true);
};
  const handleRegisterSubmit = async (formData) => {
    const success = await registrarNuevaIp(formData);
    if (success) setIsModalOpen(false);
  };

  const columnsPuertos = [{ label: 'Dirección IP' }, { label: 'Nombre del Switch' }, { label: 'Acciones SSH', className: 'text-center' }];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
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
                <PortTableRow key={index} item={item} onScan={startScanning} onEdit={handleOpenEdit} onDelete={eliminarIp}/>
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
  <div className='mb-6 flex items-center justify-between bg-white p-4 rounded-lg shadow-sm'>
    <div>
      <button 
        className={`font-bold py-2 px-6 rounded shadow-md transition-all ${loading ? 'bg-gray-400' : 'bg-blue-600 text-white'}`} 
        onClick={() => onScanAll()} 
        disabled={loading}
      >
        {loading ? 'Procesando...' : 'Limpiar Todos'}
      </button>
      <button className="bg-green-500 text-white font-bold py-2 px-6 rounded ml-3" onClick={onOpenModal}>
        + Registrar IP
      </button>
    </div>
    {loading && <span className="text-blue-600 animate-pulse text-sm">Conectando: {currentDevice}</span>}
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