import React from 'react';
import ReactDOM from 'react-dom';

const Modal = ({ isOpen, onClose, title, children }) => {
  // Si no está abierto, no renderizamos nada
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-50">
      {/* Contenedor del Modal */}
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        {/* Botón Cerrar */}
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
        
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>,
    document.body // Aquí es donde se "teletransporta" el HTML
  );
};

export default Modal;