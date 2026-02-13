export const renderRowReporte = (item, index) => {
  const isOnline = item.status?.toLowerCase() === 'online';
  
  return (
    <tr key={item.id_ip || index} className="hover:bg-gray-50 transition-colors border-b border-gray-200/50">
      <td className="px-6 py-4">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold tracking-tight ${
          isOnline ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          <span className={`w-2 h-2 mr-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></span>
          {isOnline ? 'ONLINE' : 'OFFLINE'}
        </span>
      </td>
      
      <td className="px-6 py-4 font-semibold text-gray-800">
        {item.name || '---'}
      </td>
      
      <td className="px-6 py-4 font-mono text-sm text-blue-700 whitespace-nowrap">
        <span className="bg-blue-50 px-2 py-1 rounded">
          {item.ip}
        </span>
      </td>
      
      <td className="px-6 py-4">
        <span className="px-2 py-1 text-[10px] font-bold text-gray-400 border border-gray-200 rounded uppercase">
          {item.categoria || 'N/A'}
        </span>
      </td>
    </tr>
  );
};