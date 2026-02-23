import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header'; 
import Table from '../components/Table'; 
import Modal from '../components/Modal';

// Componentes especializados (Crea estos archivos para mantener orden)
import { UserForm } from '../components/UserForm';
import { UserTableRow } from '../components/UserTableRow';
import { UserStats } from '../components/UserStats';

// Hook 
import { User } from '../hooks/Users';

function Usuarios() {
  // --- Estados ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]); // Aquí cargarías tus datos de la API
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { data } = User();

  // --- Columnas de la Tabla ---
  const columns = ["Nombre", "Correo Electrónico", "Rol", "Estado", "Acciones"];

  // --- Funciones de Lógica ---
  const handleOpenCreate = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if(confirm("¿Estás seguro de eliminar este usuario?")) {
      // Lógica para eliminar (fetch/axios)
      console.log("Eliminando usuario:", id);
    }
  };
  const columnsUsuarios = [
        { label: "Usuario", key: "nombre" },
        { label: "Correo", key: "Usuario" },
        { label: "Rol", render: (user) => (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                user.rol === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
            }`}>
                {user.rol}
            </span>
            ) 
        },
        { label: "Estado", render: (user) => (
            <span className={`flex items-center gap-1 ${user.activo ? 'text-green-600' : 'text-red-600'}`}>
                <span className={`w-2 h-2 rounded-full ${user.activo ? 'bg-green-600' : 'bg-red-600'}`}></span>
                {user.activo ? 'Activo' : 'Inactivo'}
            </span>
            )
        },
        { label: "Acciones", key: "acciones" } // Solo para el header en desktop
        ];
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col">
        <Header onMenuOpen={() => setIsSidebarOpen(true)}/>
        
        <main className="p-8">
          {/* Encabezado con estadísticas rápidas */}
          <header className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h1>
              <p className="text-gray-500 text-sm">Administra los accesos y roles de la plataforma</p>
            </div>
            <button 
              onClick={handleOpenCreate}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              + Nuevo Usuario
            </button>
          </header>

          <UserStats />

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <Table 
                data={data} 
                columns={columnsUsuarios} 
                loading={loading}
                renderRow={(user, index) => (
                    <UserTableRow 
                    key={user.id || index} 
                    user={user} 
                    onEdit={handleEdit} 
                    onDelete={handleDelete}
                    />
                )} 
                emptyMessage="No hay usuarios registrados en el sistema."
                />
          </div>
        </main>
      </div>

      {/* Modal dinámico para Crear/Editar */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={selectedUser ? "Editar Usuario" : "Registrar Nuevo Usuario"}
      >
        <UserForm 
          initialData={selectedUser} 
          onSuccess={() => setIsModalOpen(false)} 
        />
      </Modal>
    </div>
  );
}

export default Usuarios;