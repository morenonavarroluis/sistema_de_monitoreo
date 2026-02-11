// components/EditIpForm.jsx
import { useState, useEffect } from 'react';

export function EditIpForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    id: '',
    ip_port: '',
    nombre: '',
    user_ip: '',
    pass_ip: '',
    description: ''
  });

  // Cargamos los datos cuando el componente se monta o cambia initialData
  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        ip_port: initialData.ip_port || '',
        nombre: initialData.nombre || '',
        user_ip: initialData.user_ip || '',
        pass_ip: initialData.pass_ip || '',
        description: initialData.description || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Pasamos los datos editados al padre
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Nombre Switch</label>
        <input name="nombre" value={formData.nombre} onChange={handleChange} className="mt-1 block w-full border rounded-md p-2" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">IP</label>
        <input name="ip_port" value={formData.ip_port} onChange={handleChange} className="mt-1 block w-full border rounded-md p-2 " />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Usuario</label>
        <input name="user_ip" value={formData.user_ip}  onChange={handleChange} className="mt-1 block w-full border rounded-md p-2 " />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input type="text" placeholder="••••••••" name="pass_ip" value={formData.pass_ip}  onChange={handleChange} className="mt-1 block w-full border rounded-md p-2 " />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">descripcion</label>
        <input name="description" value={formData.description}  onChange={handleChange} className="mt-1 block w-full border rounded-md p-2 " />
      </div>
     
      
      <div className="flex gap-2 pt-4">
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-bold">Actualizar</button>
        <button type="button" onClick={onCancel} className="w-full bg-gray-200 py-2 rounded font-bold">Cancelar</button>
      </div>
    </form>
  );
}
