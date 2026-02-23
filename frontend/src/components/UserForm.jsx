import React, { useState, useEffect } from 'react';

export const UserForm = ({ initialData, onSuccess, onClose }) => {
  // Estado inicial dinámico
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    rol: 'Usuario',
    activo: true,
    password: ''
  });

  const [errors, setErrors] = useState({});

  // Si recibimos datos (Editar), llenamos el formulario
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        password: '' // Por seguridad, no cargamos el password al editar
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
    if (!formData.email.includes('@')) newErrors.gmail = "Correo electrónico inválido";
    if (!initialData && !formData.password) newErrors.password = "La contraseña es requerida para nuevos usuarios";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Aquí iría tu llamada a la API (fetch o axios)
    console.log("Enviando datos:", formData);
    
    // Simulamos éxito
    onSuccess(); 
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 p-2">
      {/* Campo Nombre */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
            errors.nombre ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Ej. Juan Pérez"
        />
        {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
      </div>

      {/* Campo Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
        <input
          type="email"
          name="email"
          value={formData.gmail}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="usuario@empresa.com"
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Selector de Rol */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
          <select
            name="rol"
            value={formData.rol}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="Usuario">Usuario</option>
            <option value="Editor">Editor</option>
            <option value="Admin">Administrador</option>
          </select>
        </div>

        {/* Password (Solo requerido en creación o si se quiere cambiar) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {initialData ? 'Nueva Contraseña (opcional)' : 'Contraseña'}
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>
      </div>

      {/* Switch de Estado Activo */}
      <div className="flex items-center gap-3 py-2">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            name="activo"
            checked={formData.activo}
            onChange={handleChange}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          <span className="ml-3 text-sm font-medium text-gray-700">Usuario Activo</span>
        </label>
      </div>

      {/* Botones de Acción */}
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all active:scale-95"
        >
          {initialData ? 'Guardar Cambios' : 'Crear Usuario'}
        </button>
      </div>
    </form>
  );
};