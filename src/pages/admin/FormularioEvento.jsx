import React, { useState, useEffect } from 'react';

/**
 * Formulario para Crear o Editar un Evento (SIN DESCRIPCIÓN).
 * Props:
 * - evento: (object) (Opcional) El objeto del evento si estamos editando.
 * - onClose: (function) Función para cerrar el modal.
 * - onSave: (function) Función que se llama al guardar, pasa los datos del formulario.
 */
export default function FormularioEvento({ evento, onClose, onSave }) {
  
  // Estado para manejar los campos del formulario (SIN descripción)
  const [nombre, setNombre] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [responsable, setResponsable] = useState('');

  // Título dinámico
  const esModoEdicion = Boolean(evento);
  const tituloModal = esModoEdicion ? 'Editar Evento' : 'Crear Nuevo Evento';

  // Llenar el formulario si estamos en modo edición (SIN descripción)
  useEffect(() => {
    if (esModoEdicion) {
      setNombre(evento.nombre || '');
      setFechaInicio(evento.fechaInicio ? evento.fechaInicio.split('/').reverse().join('-') : '');
      setFechaFin(evento.fechaFin ? evento.fechaFin.split('/').reverse().join('-') : '');
      setResponsable(evento.responsable || '');
    } else {
      // Limpiar formulario si se abre en modo crear después de editar
      setNombre('');
      setFechaInicio('');
      setFechaFin('');
      setResponsable('');
    }
  }, [evento, esModoEdicion]);

  // Manejador del submit (SIN descripción)
  const handleSubmit = (e) => {
    e.preventDefault();
    const datosFormulario = { nombre, fechaInicio, fechaFin, responsable };
    
    console.log("Guardando:", datosFormulario); 
    
    onSave(datosFormulario); 
    onClose(); 
  };

  return (
    <div className="p-6 bg-white">
      <form onSubmit={handleSubmit}>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">{tituloModal}</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">Nombre del Evento</label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="form-input block w-full border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          
          {/* --- CAMPO DE DESCRIPCIÓN ELIMINADO --- */}

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="fechaInicio" className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
              <input
                type="date"
                id="fechaInicio"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="form-input block w-full border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
            <div className="flex-1">
              <label htmlFor="fechaFin" className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
              <input
                type="date"
                id="fechaFin"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="form-input block w-full border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="responsable" className="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
            <select
              id="responsable"
              value={responsable}
              onChange={(e) => setResponsable(e.target.value)}
              className="form-select block w-full border-gray-300 rounded-md shadow-sm"
              required
            >
              <option value="" disabled>Seleccione un responsable</option>
              <option value="Juan Diego">Juan Diego</option>
              <option value="Roy Silva">Roy Silva</option>
              <option value="Ana Gómez">Ana Gómez</option>
            </select>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
          >
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
}

