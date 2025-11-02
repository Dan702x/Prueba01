import React, { useState, useEffect } from 'react';

export default function FormularioEvento({ evento, onClose, onSave }) {
  const [nombre, setNombre] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  // --- CAMBIO: Separar responsable en nombre y apellido ---
  const [responsableNombre, setResponsableNombre] = useState('');
  const [responsableApellido, setResponsableApellido] = useState('');

  // --- CAMBIO: Estado para el mensaje de error ---
  const [error, setError] = useState('');

  const esModoEdicion = Boolean(evento);
  const tituloModal = esModoEdicion ? 'Editar Evento' : 'Crear Nuevo Evento';

  useEffect(() => {
    if (esModoEdicion) {
      setNombre(evento.nombre || '');
      setFechaInicio(evento.fechaInicio || '');
      setFechaFin(evento.fechaFin || '');
      
      const nombreCompleto = evento.responsable || '';
      const primerEspacio = nombreCompleto.indexOf(' '); 
      
      if (primerEspacio !== -1) {
        setResponsableNombre(nombreCompleto.substring(0, primerEspacio));
        setResponsableApellido(nombreCompleto.substring(primerEspacio + 1));
      } else {
        setResponsableNombre(nombreCompleto);
        setResponsableApellido('');
      }
    } else {
      setNombre(''); setFechaInicio(''); setFechaFin('');
      setResponsableNombre(''); setResponsableApellido('');
    }
  }, [evento, esModoEdicion]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); // Limpiar error previo

    // --- CAMBIO: Validación de Nombres/Apellidos ---
    const nombreLleno = responsableNombre.trim() !== '';
    const apellidoLleno = responsableApellido.trim() !== '';

    // Si uno está lleno pero el otro no, mostrar error
    if ((nombreLleno && !apellidoLleno) || (!nombreLleno && apellidoLleno)) {
      setError('Debe completar tanto nombres como apellidos, o dejar ambos campos vacíos.');
      return; // Detener envío
    }
    // --- FIN CAMBIO ---

    const responsableUnido = `${responsableNombre} ${responsableApellido}`.trim();
    const datosFormulario = { 
      nombre, 
      fechaInicio, 
      fechaFin, 
      responsable: responsableUnido
    };
    
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="responsableNombre" className="block text-sm font-medium text-gray-700 mb-1">Nombres (Responsable)</label>
              <input 
                type="text" 
                id="responsableNombre" 
                value={responsableNombre} 
                onChange={(e) => setResponsableNombre(e.target.value)} 
                className={`${inputBaseClasses} ${inputPaddingClasses}`} 
                placeholder="Ej: Juan"
              />
            </div>
            <div>
              <label htmlFor="responsableApellido" className="block text-sm font-medium text-gray-700 mb-1">Apellidos (Responsable)</label>
              <input 
                type="text" 
                id="responsableApellido" 
                value={responsableApellido} 
                onChange={(e) => setResponsableApellido(e.target.value)} 
                className={`${inputBaseClasses} ${inputPaddingClasses}`} 
                placeholder="Ej: Pérez"
              />
            </div>
          </div>

          {/* --- CAMBIO: Mostrar mensaje de error o nota --- */}
          {error ? (
            <p className="text-xs text-red-600 -mt-3 text-center font-medium">{error}</p>
          ) : (
            <p className="text-xs text-gray-500 -mt-3">Los campos de responsable son opcionales.</p>
          )}
          {/* --- FIN DEL CAMBIO --- */}

        </div>
        <div className="flex justify-end gap-4 mt-8">
          <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">Cancelar</button>
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">Guardar Cambios</button>
        </div>
      </form>
    </div>
  );
}