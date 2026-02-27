// src/pages/Unauthorized.jsx
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1 style={styles.errorCode}>403</h1>
      <h2 style={styles.title}>Acceso Denegado</h2>
      <p style={styles.message}>
        Lo sentimos, no tienes los permisos necesarios para ver esta sección. 
        Si crees que esto es un error, contacta al administrador.
      </p>
      <button 
        onClick={() => navigate('/dashboard')} 
        style={styles.button}
      >
        Volver al Inicio
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center',
    backgroundColor: '#f8f9fa',
    padding: '20px'
  },
  errorCode: {
    fontSize: '72px',
    margin: '0',
    color: '#dc3545'
  },
  title: {
    fontSize: '24px',
    marginBottom: '10px'
  },
  message: {
    maxWidth: '400px',
    marginBottom: '20px',
    color: '#6c757d'
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px'
  }
};

export default Unauthorized;