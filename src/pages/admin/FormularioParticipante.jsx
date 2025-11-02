import React, { useState, useEffect } from 'react';

export default function FormularioParticipante({ onClose, onSave, practicante }) {
  
  const getTodayDate = () => new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    dni: '',
    correo: '',
    area: '', // <-- CAMBIO: De 'areaProyecto' a 'area'
    fechaRegistro: getTodayDate(), 
  });

  const isEditing = Boolean(practicante);

  useEffect(() => {
    if (isEditing) {
      setFormData({
        nombres: practicante.nombres || '',
        apellidos: practicante.apellidos || '',
        dni: practicante.dni || '',
        correo: practicante.correo || '',
        area: practicante.area || '', // <-- CAMBIO: De 'areaProyecto' a 'area'
        fechaRegistro: practicante.fechaRegistro ? practicante.fechaRegistro.split('/').reverse().join('-') : getTodayDate(),
      });
    } else {
      setFormData({
        nombres: '',
        apellidos: '',
        dni: '',
        correo: '',
        area: '',
        fechaRegistro: getTodayDate(),
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
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{isEditing ? 'Editar Participante' : 'Nuevo Participante'}</h2>
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
          {/* --- CAMBIO: Label y name/id --- */}
          <label htmlFor="area" className="block text-sm font-medium text-gray-700">Área</label>
          <select 
            name="area" // <-- CAMBIO
            id="area"   // <-- CAMBIO
            value={formData.area} 
            onChange={handleChange} 
            required 
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
          >
            <option value="" disabled>Seleccione un área...</option>
            <option value="Desarrollo de Software">Desarrollo de Software</option>
            <option value="Soporte de TI">Soporte de TI</option>
            <option value="Análisis de Datos">Análisis de Datos</option>
            <option value="Marketing Digital">Marketing Digital</option>
            <option value="Participante">Participante</option> {/* <-- CAMBIO */}
          </select>
        </div>
        
        <div>
          <label htmlFor="fechaRegistro" className="block text-sm font-medium text-gray-700">Fecha Registro</label>
          <input 
            type="date" 
            name="fechaRegistro" 
            id="fechaRegistro" 
            value={formData.fechaRegistro} 
            onChange={handleChange} 
            required 
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
          />
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">Cancelar</button>
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">Guardar Cambios</button>
        </div>
      </form>
    </div>
  );
}