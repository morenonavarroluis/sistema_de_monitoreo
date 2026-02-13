import React from 'react';

function Table({ data, columns, renderRow, loading, emptyMessage }) {
  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 bg-white rounded-xl border border-gray-200">
        {emptyMessage || "No hay datos registrados."}
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* --- VISTA MÓVIL (Cards) --- */}
      <div className="block md:hidden space-y-4">
        {data.map((item, index) => (
          <div key={index} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            {columns.map((col, i) => (
              <div key={i} className="flex justify-between py-2 border-b last:border-0 gap-4">
                <span className="font-bold text-gray-700 text-xs uppercase self-center">
                  {col.label}:
                </span>
                <span className="text-gray-600 text-sm text-right">
                  {/* IMPORTANTE: Aquí mostramos el valor directo. 
                    Si 'col.key' existe lo usamos, si no, intentamos renderizar 
                    lo que venga en una función personalizada 'col.render' 
                  */}
                  {col.render ? col.render(item) : item[col.key]}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* --- VISTA DESKTOP (Tabla tradicional) --- */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200 max-h-[600px]">
        <table className="w-full min-w-[700px] text-left text-sm text-gray-600 border-separate border-spacing-0">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-bold">
            <tr>
              {columns.map((col, index) => (
                <th 
                  key={index} 
                  className={`sticky top-0 bg-gray-100 px-6 py-4 border-b border-gray-200 z-10 ${col.className || ''}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((item, index) => renderRow(item, index))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;