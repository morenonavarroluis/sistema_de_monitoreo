// components/Table.jsx
function Table({ data }) {
  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-4 text-sm font-semibold text-gray-700">IP</th>
            <th className="px-6 py-4 text-sm font-semibold text-gray-700">Nombre</th>
            <th className="px-6 py-4 text-sm font-semibold text-gray-700">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
         
            <tr  className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-sm text-gray-600">10.20.22.83</td>
              <td className="px-6 py-4">
                {/* <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  item.status === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {item.status}
                </span> */}
                Danyerbert
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">Activo</td>
            </tr>
         
        </tbody>
      </table>
    </div>
  );
}

export default Table;