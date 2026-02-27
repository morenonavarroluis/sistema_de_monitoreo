// Componente de utilidad
const Can = ({ perform, children }) => {
  const { hasPermission } = useAuth();
  
  return hasPermission(perform) ? children : null;
};

// Uso en tu vista
const UserTable = () => {
  return (
    <div>
      <button>Ver Detalles</button>
      
      <Can perform="eliminar_usuarios">
        <button style={{ color: 'red' }}>Eliminar Usuario</button>
      </Can>
    </div>
  );
};