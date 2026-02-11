import { useState } from 'react';

export function RegisterIpForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
  ip_port: '',   
  nombre: '', 
  user_ip: '', 
  pass_ip: '', 
  description: ''
});
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Configuración de campos para no repetir HTML
  const fields = [
    { name: 'nombre', label: 'Nombre Switch', type: 'text', placeholder: 'Switch Principal', required: true },
    { name: 'ip_port', label: 'Dirección IP', type: 'text', placeholder: 'Ej: 192.168.1.1', required: true },
    { name: 'user_ip', label: 'Usuario', type: 'text', placeholder: 'Ej: admin', required: true },
    { name: 'pass_ip', label: 'Password', type: 'password', placeholder: '********', required: true },
    { name: 'description', label: 'Descripción', type: 'text', placeholder: 'Ej: Cisco Core', required: false },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.name}>
          <label className="block text-sm font-medium text-gray-700">
            {field.label}
          </label>
          <input 
            name={field.name}
            value={formData[field.name]}
            onChange={handleChange}
            type={field.type} 
            className="mt-1 block w-full border rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
            placeholder={field.placeholder}
            required={field.required}
          />
        </div>
      ))}

      <div className="flex gap-2 pt-4">
        <button 
          type="submit" 
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded font-bold transition-colors"
        >
          Guardar
        </button>
        <button 
          type="button" 
          onClick={onCancel} 
          className="w-full bg-gray-200 hover:bg-gray-300 py-2 rounded font-bold transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}