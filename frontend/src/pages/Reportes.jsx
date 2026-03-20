import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header'; 
import Table from '../components/Table'; 
import Modal from '../components/Modal';
import api from '../services/api'; // <--- IMPORTANTE: Asegúrate de que esta ruta sea correcta
import { IpStatus } from '../hooks/ipStatus';
import { useProbarbot } from '../hooks/enviarTelegram';
import { renderRowReporte } from '../components/ReporteIP';
import Swal from 'sweetalert2';

function Reportes() {
  const [activeModal, setActiveModal] = useState(null); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const { data, configBot, historialIps, registrarBot } = IpStatus();
  const { botloading, enviarPruebaTelegram } = useProbarbot();
  
  const [botForm, setBotForm] = useState({ chat_id: '', token: '' });
  const [horaForm, setHoraForm] = useState({ time: '' }); // Inicializado vacío para el input number

  // --- Handlers de Formulario ---
  const handleBotChange = (e) => setBotForm({ ...botForm, [e.target.name]: e.target.value });
  const handleHoraChange = (e) => setHoraForm({ ...horaForm, [e.target.name]: e.target.value });

  // 1. Registro de Configuración del Bot
  const handleBotSubmit = async (e) => {
    e.preventDefault();
    const success = await registrarBot(botForm);
    if (success) {
      setActiveModal(null);
      setBotForm({ chat_id: '', token: '' });
      Swal.fire('¡Configurado!', 'El bot ha sido enlazado.', 'success');
    }
  };

  // 2. Registro de Hora (El POST que pediste)
  const handleHoraSubmit = async (e) => {
    e.preventDefault();
    
    // Validación rápida: Que no sea un string vacío o negativo
    const valorHora = parseInt(horaForm.time);
    if (isNaN(valorHora)) return Swal.fire('Error', 'Ingresa un número válido', 'warning');

    try {
      // Usamos el endpoint que definiste
      const response = await api.post('/bot/registrar_time', { time: valorHora });
      
      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          title: '¡Hora Registrada!',
          text: `Se ha guardado el intervalo de ${valorHora} horas`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
        setActiveModal(null);
        setHoraForm({ time: '' }); // Limpiar formulario
      }
    } catch (error) {
      console.error("Error en registrar_time:", error);
      const msg = error.response?.data?.detail || "No se pudo conectar con el servidor";
      Swal.fire('Error', msg, 'error');
    }
  };

  const handlePruebaConexion = async () => {
    const result = await enviarPruebaTelegram();
    if (result) Swal.fire('Conexión Exitosa', 'Revisa tu Telegram.', 'success');
  };

  const columnsReporte = [
    { label: 'Nombre', key: 'name' }, 
    { label: 'Status', key: 'status' },
    { label: 'Ip', key: 'ip' },
    { label: 'Categoría', key: 'category' }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col">
        <Header onMenuOpen={() => setIsSidebarOpen(true)} />
        
        <main className="p-4 md:p-8">
          {/* HEADER DE ACCIONES */}
          <section className='mb-8 flex flex-col lg:flex-row items-center justify-between bg-white p-6 rounded-2xl shadow-sm border-l-8 border-green-500 gap-6'>
            <div className="flex-1">
              <h2 className="text-3xl font-black text-gray-900">Infraestructura</h2>
              <p className="text-gray-500">Gestión de alertas y tiempos de monitoreo</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button onClick={() => setActiveModal('hora')} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md active:scale-95">
                ⏱️ Registrar Hora
              </button>
              
              <button 
                onClick={handlePruebaConexion}
                disabled={botloading}
                className="bg-white text-gray-700 hover:bg-gray-50 font-bold py-2.5 px-5 rounded-xl border border-gray-200 shadow-sm disabled:opacity-50"
              >
                {botloading ? 'Cargando...' : '📡 Probar Bot'}
              </button>

              <button onClick={() => setActiveModal('config')} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-6 rounded-xl shadow-md transition-all">
                ⚙️ Configuración
              </button>
            </div>
          </section>

          {/* ESTADÍSTICAS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard label="Bot Status" value={configBot?.token ? 'Online' : 'Offline'} dotColor={configBot?.token ? 'bg-green-500' : 'bg-red-500'} />
            <StatCard label="Dispositivos" value={historialIps?.length || 0} />
            <StatCard label="Estado Crítico" value={historialIps?.find(i => i.status === 'Offline')?.ip || "Normal"} isAlert={!!historialIps?.find(i => i.status === 'Offline')} />
          </div>

          {/* TABLA */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-gray-700 uppercase tracking-wider text-sm">Monitor de Red</h3>
            </div>
            <Table data={data || []} columns={columnsReporte} renderRow={renderRowReporte} emptyMessage="Esperando datos de red..." />
          </div>
        </main>
      </div>
      
      {/* MODAL: CONFIGURAR BOT */}
      <Modal isOpen={activeModal === 'config'} onClose={() => setActiveModal(null)} title="Enlazar Telegram">
        <form onSubmit={handleBotSubmit} className="space-y-4 p-1">
          <InputField label="Chat ID" name="chat_id" value={botForm.chat_id} onChange={handleBotChange} placeholder="Ej: 12345678" />
          <InputField label="Bot Token" name="token" value={botForm.token} onChange={handleBotChange} type="password" placeholder="Ingresa el token del BotFather" />
          <div className="flex gap-3 pt-4">
            <button type="submit" className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold">Guardar</button>
            <button type="button" onClick={() => setActiveModal(null)} className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold">Cancelar</button>
          </div>
        </form>
      </Modal>

      {/* MODAL: REGISTRAR HORA (POST /bot/registrar_time) */}
      <Modal isOpen={activeModal === 'hora'} onClose={() => setActiveModal(null)} title="Frecuencia de Notificaciones">
        <form onSubmit={handleHoraSubmit} className="space-y-4 p-1">
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-4">
             <p className="text-xs text-blue-700 leading-relaxed">
               Este valor definirá cada cuántas <b>horas</b> el bot enviará el resumen automático de la infraestructura a tu chat de Telegram.
             </p>
          </div>
          <InputField 
            label="Intervalo de tiempo" 
            name="time" 
            value={horaForm.time} 
            onChange={handleHoraChange} 
            type="number" 
            placeholder="Ej: 9" 
          />
          <div className="flex gap-3 pt-4">
            <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold shadow-blue-200 shadow-lg">Registrar</button>
            <button type="button" onClick={() => setActiveModal(null)} className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold">Cerrar</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

// Componentes Auxiliares
const StatCard = ({ label, value, dotColor, isAlert }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
    <span className="text-gray-400 text-xs font-bold uppercase">{label}</span>
    <div className="flex items-center mt-2">
      {dotColor && <div className={`h-2.5 w-2.5 rounded-full mr-3 ${dotColor} ${dotColor === 'bg-green-500' ? 'animate-pulse' : ''}`}></div>}
      <span className={`text-2xl font-black ${isAlert ? 'text-orange-600' : 'text-gray-800'}`}>{value}</span>
    </div>
  </div>
);

const InputField = ({ label, name, value, onChange, type = "text", placeholder }) => (
  <div>
    <label className="block text-sm font-bold text-gray-700 mb-1">{label}</label>
    <input 
      name={name} value={value} onChange={onChange} type={type} required
      className="w-full border border-gray-200 rounded-xl p-3 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all" 
      placeholder={placeholder}
    />
  </div>
);

export default Reportes;