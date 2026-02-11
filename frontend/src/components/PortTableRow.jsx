// components/PortTableRow.jsx
export const PortTableRow = ({ item, onScan, onEdit, onDelete }) => (
  <tr className="hover:bg-blue-50/50">
    <td className="px-6 py-4 font-mono text-blue-600">{item.ip_port}</td>
    <td className="px-6 py-4 font-medium text-gray-900">{item.nombre}</td>
    <td className="flex items-center justify-center gap-2">
      <button 
        onClick={() => onScan(item.ip_port)}
        className="bg-indigo-600 text-white px-4 py-2 rounded text-xs font-bold"
      >
        Limpiar Puerto
      </button>
      <button 
        onClick={() => onEdit(item)}
  className="bg-green-600 text-white px-4 py-2 rounded text-xs font-bold transition-transform hover:scale-105"
>
        Editar
      </button>
      <button 
        onClick={() => onDelete(item.id)}
        className="bg-red-600 text-white px-4 py-2 rounded text-xs font-bold"
      >
        eliminar
      </button>
    </td>
  </tr>
);