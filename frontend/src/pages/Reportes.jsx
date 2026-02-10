import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header'; 
import Table from '../components/Table'; 
import api from '../services/api';   
import Modal from '../components/Modal';
import { usePortScanner } from '../hooks/usePortScanner'; 
import { IpStatus } from '../hooks/ipStatus';
import Swal from 'sweetalert2';

function Reportes() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data,fetchData, configBot,historialIps, registrarBot } = IpStatus();
  const { progress, loading, currentDevice } = usePortScanner();

  const [formData, setFormData] = useState({ chat_id: '', token: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await registrarBot(formData);
    if (success) {
      setIsModalOpen(false);
      setFormData({ chat_id: '', token: '' });
    }
  };
  const columnsReporte = [
  { label: 'Estado' },
  { label: 'Dispositivo' },
  { label: 'IP' },
  { label: 'Categoría' }
];
  const enviarPruebaTelegram = async () => {
  // Opcional: Podrías poner un estado 'loading' para deshabilitar el botón
  try {
    const response = await api.post('/send-test-telegram');
    if (response.status === 200) {
      Swal.fire({
        title: "Prueba Exitosa",
        text: "este es el mensaje de validacion desde tu panel de reportes!",
        icon: "success"
      });
    } else {
      Swal.fire({
        title: "Error al Enviar",
        text: "No se pudo enviar el mensaje de prueba. Revisa la configuración del bot",
        icon: "error"
      });
     
    }
  } catch (error) {
    const errorMsg = error.response?.data?.message || "Error de conexión con el servidor";
     Swal.fire({
        title: "Error",
        text: errorMsg,
        icon: "error"
      });
    
    console.error("Test Error:", error);
  }
};
const renderRowReporte = (item, index) => (
      <tr key={item.id_ip || index} className="hover:bg-gray-50 transition-colors border-b border-gray-100">
        <td className="px-6 py-4">
          {/* Estado con bolita de color */}
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
            item.status === 'Online' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            <span className={`w-2 h-2 mr-1.5 rounded-full ${
              item.status === 'Online' ? 'bg-green-500' : 'bg-red-500'
            }`}></span>
            {item.status.toUpperCase()}
          </span>
        </td>
        
        {/* item.name debe existir en tu objeto JSON */}
        <td className="px-6 py-4 font-medium text-gray-900">
          {item.name || 'Sin Nombre'}
        </td>
        
        {/* item.ip debe existir en tu objeto JSON */}
        <td className="px-6 py-4 font-mono text-sm text-blue-600 bg-blue-50/30">
          {item.ip}
        </td>
        
        {/* item.categoria debe existir en tu objeto JSON */}
        <td className="px-6 py-4">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {item.categoria}
          </span>
        </td>
      </tr>
);
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-8">
          
          {/* HEADER DE LA SECCIÓN */}
          <div className='mb-6 flex items-center justify-between bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500'>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Gestión de Bot Telegram</h2>
              <p className="text-sm text-gray-500">Configuración de notificaciones y monitoreo en tiempo real</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={enviarPruebaTelegram}
                className="bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold py-2 px-4 rounded transition-all border border-blue-200"
              >
                 Probar Conexión
              </button>
              <button 
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded shadow-md transition-all" 
                onClick={() => setIsModalOpen(true)}
              >
                 Configurar Bot
              </button>
            </div>
          </div>

          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <span className="text-gray-400 text-sm font-medium">Estado del Bot</span>
              <div className="flex items-center mt-2">
                <div className={`h-3 w-3 rounded-full mr-2 ${configBot?.token ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-lg font-bold text-gray-700">
                  {configBot?.token ? 'Configurado' : 'Sin configurar'}
                </span>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <span className="text-gray-400 text-sm font-medium">IPs en Monitoreo</span>
              <div className="text-2xl font-bold text-gray-700 mt-1">{historialIps?.length || 0}</div>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <span className="text-gray-400 text-sm font-medium">Última Alerta de falla</span>
              <div className="text-sm font-bold text-orange-500 mt-2 italic text-ellipsis overflow-hidden">
                {historialIps?.find(i => i.status === 'Offline')?.ip || "Todo estable"}
              </div>
            </div>
          </div>

          {/* 2. TABLA DE MONITOREO (Lo que el bot reporta) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                <h3 className="font-bold text-gray-700">Estado Actual de Infraestructura</h3>
            </div>
            <Table 
              data={data} 
              columns={columnsReporte} 
              renderRow={renderRowReporte}
              emptyMessage="No hay resultados de ping todavía."
            />
          </div>

        </main>
      </div>
      
      {/* MODAL DE CONFIGURACIÓN */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Configuración de Telegram"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-xs text-gray-500 mb-4">Introduce las credenciales de tu BotFather para recibir alertas.</p>
          <div>
            <label className="block text-sm font-semibold text-gray-700">Chat ID</label>
            <input 
              name="chat_id"
              value={formData.chat_id}
              onChange={handleChange}
              type="text" 
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500 outline-none" 
              placeholder="Ej: 12345678" 
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">Bot Token</label>
            <input 
              name="token"
              value={formData.token}
              onChange={handleChange}
              type="password" 
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500 outline-none" 
              placeholder="7123456:ABC-DEF..." 
              required
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded font-bold shadow-sm">Guardar Configuración</button>
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 py-2 rounded font-bold">Cancelar</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Reportes;