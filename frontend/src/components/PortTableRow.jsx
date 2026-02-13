// components/PortTableRow.jsx
export const PortTableRow = ({ item, columns }) => {
  // Buscamos la columna de acciones para usar su diseño de botones
  const actionCol = columns.find(col => col.label === 'Acciones');

  return (
    <tr className="hover:bg-blue-50/50 transition-colors">
      <td className="px-6 py-4 font-mono text-blue-600 border-b border-gray-100">
        {item.ip_port}
      </td>
      <td className="px-6 py-4 font-medium text-gray-900 border-b border-gray-100">
        {item.nombre}
      </td>
      <td className="px-6 py-4 border-b border-gray-100">
        {/* Renderiza los botones definidos en las columnas */}
        {actionCol && actionCol.render(item)}
      </td>
    </tr>
  );
};