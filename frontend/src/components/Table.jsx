import React, { useState } from 'react';

function Table({ data, columns, renderRow, loading, emptyMessage }) {
  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 bg-white rounded-xl border border-gray-200">
        {emptyMessage || "No hay datos registrados."}
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto overflow-y-auto max-h-[600px] bg-white rounded-lg shadow-md border border-gray-200">
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
  );
}

export default Table;