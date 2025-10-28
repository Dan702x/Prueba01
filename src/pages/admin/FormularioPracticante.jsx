import React, { useState, useEffect } from 'react';

export default function FormularioPracticante({ onClose, onSave, practicante }) {
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    dni: '',
    correo: '',
    areaProyecto: 'Desarrollo de Software',
    fechaInicio: '',
    fechaFin: '',
  });

  const isEditing = Boolean(practicante);

  useEffect(() => {
    if (isEditing) {
      setFormData({
        nombres: practicante.nombres || '',
        apellidos: practicante.apellidos || '',
        dni: practicante.dni || '',
        correo: practicante.correo || '',
        areaProyecto: practicante.areaProyecto || 'Desarrollo de Software',
        fechaInicio: practicante.fechaInicio ? practicante.fechaInicio.split('/').reverse().join('-') : '',
        fechaFin: practicante.fechaFin ? practicante.fechaFin.split('/').reverse().join('-') : '',
      });
    }
  }, [practicante, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="p-8 bg-white rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{isEditing ? 'Editar Practicante' : 'Nuevo Practicante'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nombres" className="block text-sm font-medium text-gray-700">Nombres</label>
          <input type="text" name="nombres" id="nombres" value={formData.nombres} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"/>
        </div>
        <div>
          <label htmlFor="apellidos" className="block text-sm font-medium text-gray-700">Apellidos</label>
          <input type="text" name="apellidos" id="apellidos" value={formData.apellidos} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"/>
        </div>
        <div>
          <label htmlFor="dni" className="block text-sm font-medium text-gray-700">DNI</label>
          <input type="text" name="dni" id="dni" value={formData.dni} onChange={handleChange} required maxLength="8" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"/>
          <p className="text-xs text-gray-500 mt-1">Debe contener 8 dígitos numéricos.</p>
        </div>
        <div>
          <label htmlFor="correo" className="block text-sm font-medium text-gray-700">Correo</label>
          <input type="email" name="correo" id="correo" value={formData.correo} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"/>
        </div>
        <div>
          <label htmlFor="areaProyecto" className="block text-sm font-medium text-gray-700">Área/Proyecto</label>
          <select name="areaProyecto" id="areaProyecto" value={formData.areaProyecto} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3">
            <option>Desarrollo de Software</option>
            <option>Soporte de TI</option>
            <option>Análisis de Datos</option>
            <option>Marketing Digital</option>
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="fechaInicio" className="block text-sm font-medium text-gray-700">Fecha Inicio</label>
            <input type="date" name="fechaInicio" id="fechaInicio" value={formData.fechaInicio} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"/>
          </div>
          <div>
            <label htmlFor="fechaFin" className="block text-sm font-medium text-gray-700">Fecha Fin</label>
            <input type="date" name="fechaFin" id="fechaFin" value={formData.fechaFin} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"/>
          </div>
        </div>
        <div className="flex justify-end gap-4 pt-4">
          <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">Cancelar</button>
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">Guardar Cambios</button>
        </div>
      </form>
    </div>
  );
}