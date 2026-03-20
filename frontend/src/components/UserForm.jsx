import React, { useState, useEffect } from 'react';

export const UserForm = ({ initialData, onSuccess, onClose, onAction }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    usuario: '',  // Agregado para coincidir con el esquema
    gmail: '',    // Usamos gmail en lugar de email
    rol: '1',     // Guardamos el ID como string inicialmente por el <select>
    activo: true, 
    password: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        rol: initialData.id_rol?.toString() || '1',
        password: '' 
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es obligatorio";
    if (!formData.usuario.trim()) newErrors.usuario = "El nombre de usuario es obligatorio";
    if (!formData.gmail.includes('@')) newErrors.gmail = "Correo electrónico inválido";
    if (!initialData && !formData.password) newErrors.password = "La contraseña es requerida";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    // TRANSFORMACIÓN: Aquí creamos el objeto EXACTO que espera tu POST
    const dataParaEnviar = {
      nombre: formData.nombre,
      usuario: formData.usuario,
      gmail: formData.gmail,
      password: formData.password,
      roles: parseInt(formData.rol), // Convertimos el ID del select a número
      activo: formData.activo ? 1 : 0 // Booleano a 1/0 para MySQL
    };

    console.log("Enviando al backend:", dataParaEnviar);

    try {
      // onAction es la función 'registrarUsuario' de tu hook User.js
      await onAction(dataParaEnviar);
      if (onSuccess) onSuccess(); 
    } catch (error) {
      console.error("Error al registrar");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 p-2">
      <div className="grid grid-cols-2 gap-4">
        {/* Campo Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre Real</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg ${errors.nombre ? 'border-red-500' : 'border-gray-300'}`}
          />
        </div>

        {/* Campo Usuario (El 'lnavarro' de tu prueba) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            name="usuario"
            value={formData.usuario}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg ${errors.usuario ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Ej. lnavarro"
          />
        </div>
      </div>

      {/* Campo Gmail */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Correo (Gmail)</label>
        <input
          type="email"
          name="gmail"
          value={formData.gmail}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg ${errors.gmail ? 'border-red-500' : 'border-gray-300'}`}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Selector de Rol - Enviará el ID numérico */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Rol</label>
          <select
            name="rol"
            value={formData.rol}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
          >
            <option value="1">Administrador</option>
            <option value="2">Usuario</option>
            <option value="3">Editor</option>
          </select>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Contraseña</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
          />
        </div>
      </div>

      {/* Switch Activo */}
      <div className="flex items-center gap-3">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            name="activo"
            checked={formData.activo}
            onChange={handleChange}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          <span className="ml-3 text-sm font-medium text-gray-700">Estado Activo</span>
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600">Cancelar</button>
        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg">
          {initialData ? 'Guardar Cambios' : 'Crear Usuario'}
        </button>
      </div>
    </form>
  );
};