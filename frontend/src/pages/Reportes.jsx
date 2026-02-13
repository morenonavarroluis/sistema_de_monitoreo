import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header'; 
import Table from '../components/Table'; 
import api from '../services/api';   
import Modal from '../components/Modal';
import { usePortScanner } from '../hooks/usePortScanner'; 
import { IpStatus } from '../hooks/ipStatus';
import Swal from 'sweetalert2';
import { useProbarbot } from '../hooks/enviarTelegram';
import { renderRowReporte } from '../components/ReporteIP';

function Reportes() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data,fetchData, configBot,historialIps, registrarBot } = IpStatus();
  const { progress, loading, currentDevice } = usePortScanner();
  const { horasdata, botloading, enviarPruebaTelegram } = useProbarbot();
  const [formData, setFormData] = useState({ chat_id: '', token: '' });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
  { label: 'Nombre', key: 'name' }, 
  { label: 'Status', key: 'status', render: (item) => (
    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
      {item.status}
    </span>
  )},
   { label: 'Ip', key: 'ip' },
   { label: 'Categoria', key: 'name'}
 
];


  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col">
        <Header onMenuOpen={() => setIsSidebarOpen(true)} />
        <main className="p-8">
          
          {/* HEADER DE LA SECCIÓN */}
       <div className='mb-6 flex flex-col md:flex-row items-center justify-between bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500 gap-4'>
          {/* Sección de Título */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800">Gestión de Bot Telegram</h2>
            <p className="text-sm text-gray-500">Configuración de notificaciones y monitoreo</p>
          </div>

          {/* Sección del Selector con estilo mejorado */}
          <div className="flex flex-col min-w-[200px]">
           
            <div className="relative">
              <select
                name="alert_time"
                id="alert_time"
                className="block w-full pl-10 pr-10 py-2.5 text-sm border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50 border appearance-none transition-all cursor-pointer text-gray-700 font-medium"
              >
                <option value="">
                    {botloading ? "Cargando..." : "Selecciona una hora"}
                  </option>
                {data && data.length > 0 ? (
                  horasdata.map((item) => (
                    <option key={item.id} value={item.time}>
                      {item.time < 10 ? `0${item.time}` : item.time}:00 {item.time < 12 ? 'AM' : 'PM'}
                    </option>
                  ))
                ) : (
                  <option disabled>Sin registros</option>
                )}
              </select>
              
              {/* Icono de Reloj a la izquierda */}
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              {/* Flecha a la derecha */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex gap-3 shrink-0">
            <button 
              onClick={enviarPruebaTelegram}
              className="flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 font-semibold py-2.5 px-4 rounded-lg transition-all border border-blue-200 shadow-sm text-sm"
            >
              <span className="hidden sm:inline">Probar Conexión</span>
              <span className="sm:hidden">Probar</span>
            </button>
            <button 
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all text-sm" 
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
              renderRow={(item, index) => renderRowReporte(item, index)}
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