function Table({ data , clearPortIndividual }) {
  // Verificación de seguridad: si data no existe o está vacío
  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 bg-white rounded-xl border border-gray-200">
        No hay datos disponibles.
      </div>
    );
  }

  return (
        <div className="w-full overflow-x-auto overflow-y-auto max-h-[600px] bg-white rounded-lg shadow-md border border-gray-200">
          <table className="w-full min-w-[700px] text-left text-sm text-gray-600 border-separate border-spacing-0">
            <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-semibold">
              <tr>
                {/* 3. sticky y top-0 para que los títulos no desaparezcan al hacer scroll hacia abajo */}
                <th className="sticky top-0 bg-gray-50 px-6 py-4 border-b border-gray-200 z-10">IP</th>
                <th className="sticky top-0 bg-gray-50 px-6 py-4 border-b border-gray-200 z-10">Nombre</th>
                <th className="sticky top-0 bg-gray-50 px-6 py-4 border-b border-gray-200 z-10 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((item, index) => (
                <tr key={item.id || index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.ip_port} 
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {item.nombre}
                  </td>
                  <td className="px-6 py-4 text-center">
                      <button 
                        className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-all active:scale-95 shadow-sm inline-flex items-center"
                        onClick={() => clearPortIndividual(item.ip_port)}
                      >
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