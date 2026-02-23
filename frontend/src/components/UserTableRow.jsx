import { Edit2, Trash2, Shield } from 'lucide-react'; // O tus iconos preferidos

export const UserTableRow = ({ user, onEdit, onDelete }) => {
  if (!user) return null;
  return (
    <tr className="hover:bg-gray-50 transition-colors group">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
            {user.nombre.charAt(0)}
          </div>
          <span className="font-medium text-gray-900">{user.nombre}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-gray-500">{user.gmail}</td>
      <td className="px-6 py-4">
        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs border border-blue-100">
          {user.roles || user.rol || "Sin Rol"}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${user.activo ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          {user.activo ? 'Activo' : 'Suspendido'}
        </div>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onEdit(user)}
            className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg"
            title="Editar usuario"
          >
            <Edit2 size={16} />
          </button>
          <button 
            onClick={() => onDelete(user.id)}
            className="p-2 hover:bg-red-50 text-red-600 rounded-lg"
            title="Eliminar usuario"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};