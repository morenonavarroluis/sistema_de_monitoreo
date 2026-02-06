import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Activity, Settings, LogOut, User } from 'lucide-react'; // Instala lucide-react o usa emojis

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const menuItems = [
    { name: 'Panel Principal', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'Monitoreo', icon: <Activity size={20} />, path: '/monitoreo' },
    { name: 'Perfil', icon: <User size={20} />, path: '/perfil' },
    { name: 'Configuración', icon: <Settings size={20} />, path: '/config' },
    { name: 'clear_port', icon: <Settings size={20} />, path: '/clear_port' },
    { name: 'Gestion de Reportes', icon: <Settings size={20} />, path: '/Reportes' },
  ];

  return (
    <div className="flex flex-col h-screen w-64 bg-white border-r border-gray-200 shadow-sm">
      <div className="p-6">
        <h2 className="text-xl font-bold text-blue-600 flex items-center gap-2">
          <Activity /> MonitorPro
        </h2>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => navigate(item.path)}
            className="flex items-center w-full gap-3 px-4 py-3 text-gray-600 transition-colors rounded-lg hover:bg-blue-50 hover:text-blue-600"
          >
            {item.icon}
            <span className="font-medium">{item.name}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center w-full gap-3 px-4 py-3 text-red-500 transition-colors rounded-lg hover:bg-red-50"
        >
          <LogOut size={20} />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;