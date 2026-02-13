import { Bell, Search, User, ChevronDown, Menu } from 'lucide-react';

function Header({ onMenuOpen }) { // Recibe la función para abrir el sidebar
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-50">
      
      <div className="flex items-center gap-4 flex-1">
        {/* BOTÓN HAMBURGUESA: Solo visible en móviles */}
        <button 
          onClick={onMenuOpen}
          className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg md:hidden"
        >
          <Menu size={24} />
        </button>

        {/* Buscador: Ahora con flex-1 para ocupar el espacio restante */}
        <div className="relative flex-1 max-w-xs md:max-w-96 group">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pl-10 pr-4 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white 
                       transition-all text-sm"
          />
        </div>
      </div>

      {/* Lado Derecho: Notificaciones y Usuario */}
      <div className="flex items-center gap-1 sm:gap-4 ml-4">
        
        {/* Botón de Notificaciones */}
        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors shrink-0">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* Divisor Vertical */}
        <div className="h-6 w-[1px] bg-gray-200 mx-1 hidden sm:block"></div>

        {/* Perfil de Usuario */}
        <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded-lg transition-colors">
          {/* Avatar (Siempre visible) */}
          <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold border border-blue-700 shrink-0 shadow-sm">
            <User size={18} />
          </div>

          {/* Información: Oculta en móviles, visible desde 'lg' o 'md' */}
          <div className="text-left hidden md:block select-none">
            <p className="text-sm font-bold text-gray-800 leading-tight">Admin Usuario</p>
            <p className="text-[11px] text-gray-500">Administrador</p>
          </div>

          {/* Icono de despliegue: Solo en desktop */}
          <ChevronDown size={16} className="text-gray-400 hidden md:block" />
        </div>
      </div>
    </header>
  );
}

export default Header;