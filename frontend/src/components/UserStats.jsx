import React from 'react';
import { Users, UserCheck, UserMinus, ShieldCheck } from 'lucide-react';

export const UserStats = ({ data = [] }) => {
  // Lógica para calcular estadísticas dinámicamente
  const totalUsers = data.length;
  const activeUsers = data.filter(u => u.activo).length;
  const inactiveUsers = totalUsers - activeUsers;
  const admins = data.filter(u => u.rol === 'Admin').length;

  const stats = [
    {
      label: 'Total Usuarios',
      value: totalUsers,
      icon: <Users className="text-blue-600" size={24} />,
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Usuarios Activos',
      value: activeUsers,
      icon: <UserCheck className="text-green-600" size={24} />,
      bgColor: 'bg-green-100',
    },
    {
      label: 'Suspendidos',
      value: inactiveUsers,
      icon: <UserMinus className="text-red-600" size={24} />,
      bgColor: 'bg-red-100',
    },
    {
      label: 'Administradores',
      value: admins,
      icon: <ShieldCheck className="text-purple-600" size={24} />,
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow"
        >
          <div className={`p-3 rounded-lg ${stat.bgColor}`}>
            {stat.icon}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              {stat.label}
            </p>
            <h2 className="text-2xl font-bold text-gray-800">
              {stat.value}
            </h2>
          </div>
        </div>
      ))}
    </div>
  );
};