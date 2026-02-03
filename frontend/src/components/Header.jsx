import { Bell, Search, User, ChevronDown } from 'lucide-react';

function Header() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
      
      {/* Lado Izquierdo: Buscador */}
      <div className="relative w-96">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
          <Search size={18} />
        </span>
        <input
          type="text"
          placeholder="Buscar datos, sensores..."
          className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
        />
      </div>

      {/* Lado Derecho: Notificaciones y Usuario */}
      <div className="flex items-center gap-5">
        
        {/* Botón de Notificaciones */}
        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="h-8 w-[1px] bg-gray-200 mx-2"></div>

        {/* Perfil de Usuario */}
        <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-1.5 rounded-lg transition-colors">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-800">Admin Usuario</p>
            <p className="text-xs text-gray-500">Administrador</p>
          </div>
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold border border-blue-200">
            <User size={20} />
          </div>
          <ChevronDown size={16} text-gray-400 />
        </div>
        
      </div>
    </header>
  );
}

export default Header;