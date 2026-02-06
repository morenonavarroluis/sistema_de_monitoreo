import React, { useState, useEffect } from 'react';

function Table({ data, clearPortIndividual, loading }) {
  // Estado local para saber qué IP se está procesando individualmente
  // Esto permite dar feedback visual específico en la fila
  const [activeIp, setActiveIp] = React.useState(null);
  React.useEffect(() => {
    if (!loading) setActiveIp(null);
  }, [loading]);


  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 bg-white rounded-xl border border-gray-200">
        No hay datos registrados en el inventario.
      </div>
    );
  }

  const handleIndividualClick = (ip) => {
    setActiveIp(ip); // Marcamos esta IP como activa
    clearPortIndividual(ip);
  };

  // Resetear el activeIp cuando deje de cargar
 
  return (
    <div className="w-full overflow-x-auto overflow-y-auto max-h-[600px] bg-white rounded-lg shadow-md border border-gray-200">
      <table className="w-full min-w-[700px] text-left text-sm text-gray-600 border-separate border-spacing-0">
        <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-bold">
          <tr>
            <th className="sticky top-0 bg-gray-100 px-6 py-4 border-b border-gray-200 z-10">Dirección IP</th>
            <th className="sticky top-0 bg-gray-100 px-6 py-4 border-b border-gray-200 z-10">Nombre del Switch</th>
            <th className="sticky top-0 bg-gray-100 px-6 py-4 border-b border-gray-200 z-10 text-center">Acciones SSH</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((item, index) => (
            <tr key={item.id || index} className="hover:bg-blue-50/50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap font-mono text-blue-600">
                {item.ip_port} 
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                {item.nombre}
              </td>
              <td className="px-6 py-4 text-center">
                <button 
                  onClick={() => handleIndividualClick(item.ip_port)}
                  disabled={loading}
                  className={`min-w-[140px] text-xs font-bold py-2 px-4 rounded transition-all shadow-sm ${
                    loading 
                      ? (activeIp === item.ip_port ? 'bg-orange-500 text-white animate-pulse' : 'bg-gray-300 text-gray-500 cursor-not-allowed')
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white active:transform active:scale-95'
                  }`}
                >
                  {loading && activeIp === item.ip_port ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Procesando...
                    </span>
                  ) : 'Limpiar Puerto'}
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