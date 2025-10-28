import React, { useState, useEffect } from 'react';

export default function FormularioEvento({ evento, onClose, onSave }) {
  const [nombre, setNombre] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [responsable, setResponsable] = useState('');

  const esModoEdicion = Boolean(evento);
  const tituloModal = esModoEdicion ? 'Editar Evento' : 'Crear Nuevo Evento';

  useEffect(() => {
    if (esModoEdicion) {
      setNombre(evento.nombre || '');
      setFechaInicio(evento.fechaInicio ? evento.fechaInicio.split('/').reverse().join('-') : '');
      setFechaFin(evento.fechaFin ? evento.fechaFin.split('/').reverse().join('-') : '');
      setResponsable(evento.responsable || '');
    } else {
      setNombre(''); setFechaInicio(''); setFechaFin(''); setResponsable('');
    }
  }, [evento, esModoEdicion]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const datosFormulario = { nombre, fechaInicio, fechaFin, responsable };
    onSave(datosFormulario);
    onClose();
  };

  const inputBaseClasses = "block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm";
  const inputPaddingClasses = "px-4 py-2";

  return (
    <div className="p-6 bg-white">
      <form onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{tituloModal}</h2>
        <div className="space-y-5">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">Nombre del Evento</label>
            <input type="text" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} className={`${inputBaseClasses} ${inputPaddingClasses}`} required />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="fechaInicio" className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
              <input type="date" id="fechaInicio" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} className={`${inputBaseClasses} ${inputPaddingClasses}`} required />
            </div>
            <div className="flex-1">
              <label htmlFor="fechaFin" className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
              <input type="date" id="fechaFin" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} className={`${inputBaseClasses} ${inputPaddingClasses}`} required />
            </div>
          </div>
          <div>
            <label htmlFor="responsable" className="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
            <select id="responsable" value={responsable} onChange={(e) => setResponsable(e.target.value)} className={`form-select ${inputBaseClasses} ${inputPaddingClasses} pr-12`} required>
              <option value="" disabled>Seleccione un responsable</option>
              <option value="Juan Diego">Juan Diego</option>
              <option value="Roy Silva">Roy Silva</option>
              <option value="Ana Gómez">Ana Gómez</option>
              <option value="Carlos Ruiz">Carlos Ruiz</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-8">
          <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">Cancelar</button>
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">Guardar Cambios</button>
        </div>
      </form>
    </div>
  );
}