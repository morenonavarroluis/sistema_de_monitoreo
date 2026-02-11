import { Bell, Search, User, ChevronDown } from 'lucide-react';

function Header() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-10">
      
      {/* Lado Izquierdo: Buscador (Se ajusta el ancho en móviles) */}
      <div className="relative w-full max-w-[40px] sm:max-w-xs md:max-w-96 transition-all duration-300">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
          <Search size={18} />
        </span>
        <input
          type="text"
          placeholder="Buscar..."
          className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pl-10 pr-4 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white 
                     transition-all text-sm
                     placeholder:text-transparent sm:placeholder:text-gray-400"
        />
      </div>

      {/* Lado Derecho: Notificaciones y Usuario */}
      <div className="flex items-center gap-2 sm:gap-5">
        
        {/* Botón de Notificaciones */}
        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
          <Bell size={20} />
          {/* El punto rojo de notificación */}
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* Divisor (Se oculta en móviles muy pequeños si es necesario) */}
        <div className="h-8 w-[1px] bg-gray-200 mx-1 hidden xs:block"></div>

        {/* Perfil de Usuario */}
        <div className="flex items-center gap-2 sm:gap-3 cursor-pointer hover:bg-gray-50 p-1.5 rounded-lg transition-colors">
          {/* Texto del perfil: Oculto en móvil, visible desde 'md' */}
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold text-gray-800 leading-none">Admin Usuario</p>
            <p className="text-[10px] text-gray-500 mt-1">Administrador</p>
          </div>

          {/* Avatar */}
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold border border-blue-200 shrink-0">
            <User size={20} />
          </div>

          {/* Flecha: Oculta en móviles pequeños */}
          <ChevronDown size={16} className="text-gray-400 hidden sm:block" />
        </div>
        
      </div>
    </header>
  );
}

export default Header;