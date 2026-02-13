import { useNavigate } from 'react-router-dom';
import { Activity, Settings, LogOut, X } from 'lucide-react';

// Recibe isOpen y onClose desde el padre
function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const menuItems = [
    { name: 'Limpiar Puertos', icon: <Settings size={20} />, path: '/clear_port' },
    { name: 'Gestión de Reportes', icon: <Settings size={20} />, path: '/Reportes' },
  ];

  return (
    <>
      {/* --- OVERLAY (Solo móvil) --- */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity" 
          onClick={onClose}
        />
      )}

      {/* --- ASIDE --- */}
      <aside className={`
        fixed top-0 left-0 z-50 h-screen bg-white border-r border-gray-200 shadow-xl transition-transform duration-300 ease-in-out
        w-64 flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 lg:static lg:shadow-none
      `}>
        
        {/* Header con botón de cierre para móvil */}
        <div className="p-6 flex items-center justify-between border-b border-gray-50">
          <h2 className="text-xl font-bold text-blue-600 flex items-center gap-2">
            <Activity /> MonitorPro
          </h2>
          <button onClick={onClose} className="lg:hidden p-1 text-gray-400 hover:text-red-500">
            <X size={24} />
          </button>
        </div>

        {/* Navegación */}
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                navigate(item.path);
                onClose(); // Cierra el menú siempre al navegar
              }}
              className="flex items-center w-full gap-3 px-4 py-3 text-gray-600 transition-all rounded-xl hover:bg-blue-50 hover:text-blue-600 group"
            >
              <span className="group-hover:scale-110 transition-transform">{item.icon}</span>
              <span className="font-semibold text-sm">{item.name}</span>
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center w-full gap-3 px-4 py-3 text-red-500 transition-colors rounded-xl hover:bg-red-50 font-bold text-sm"
          >
            <LogOut size={20} />
            Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;