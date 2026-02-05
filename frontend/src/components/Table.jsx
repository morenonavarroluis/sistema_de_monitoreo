function Table({ data }) {
  // Verificación de seguridad: si data no existe o está vacío
  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 bg-white rounded-xl border border-gray-200">
        No hay datos disponibles.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-4 text-sm font-semibold text-gray-700">IP</th>
            <th className="px-6 py-4 text-sm font-semibold text-gray-700">Nombre</th>
            <th className="px-6 py-4 text-sm font-semibold text-gray-700">Accion</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {/* Mapeamos los datos recibidos */}
          {data.map((item, index) => (
            <tr key={item.id || index} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-sm text-gray-600">
                {item.ip_port} 
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                {item.nombre}
              </td>
              <td className="px-6 py-4">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs">
                  Limpiar Puerto
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;