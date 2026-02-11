import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Activity, Settings, LogOut, User, Menu, X } from 'lucide-react';

function Sidebar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // Estado para controlar el menú en móvil

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const menuItems = [
    { name: 'clear_port', icon: <Settings size={20} />, path: '/clear_port' },
    { name: 'Gestion de Reportes', icon: <Settings size={20} />, path: '/Reportes' },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* --- BOTÓN HAMBURGUESA (Solo visible en móvil) --- */}
      <button 
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-md lg:hidden shadow-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* --- OVERLAY (Cierra el menú al tocar fuera en móvil) --- */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={toggleSidebar}
        />
      )}

      {/* --- SIDEBAR --- */}
      <aside className={`
        fixed top-0 left-0 z-40 h-screen bg-white border-r border-gray-200 shadow-sm transition-transform duration-300 ease-in-out
        w-64 flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 lg:static
      `}>
        
        {/* Logo / Header */}
        <div className="p-6">
          <h2 className="text-xl font-bold text-blue-600 flex items-center gap-2">
            <Activity /> MonitorPro
          </h2>
        </div>

        {/* Navegación */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                navigate(item.path);
                setIsOpen(false); // Cierra el menú al hacer click en móvil
              }}
              className="flex items-center w-full gap-3 px-4 py-3 text-gray-600 transition-colors rounded-lg hover:bg-blue-50 hover:text-blue-600 group"
            >
              <span className="group-hover:scale-110 transition-transform">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </button>
          ))}
        </nav>

        {/* Footer / Logout */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center w-full gap-3 px-4 py-3 text-red-500 transition-colors rounded-lg hover:bg-red-50"
          >
            <LogOut size={20} />
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;