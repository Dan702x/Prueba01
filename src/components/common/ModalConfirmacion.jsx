import React from 'react';
import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/solid';

/**
 * Modal genérico de confirmación.
 * Props:
 * - modo: ('desactivar' | 'activar') Define el color y el texto.
 * - onClose: (function) Función para cerrar el modal.
 * - onConfirm: (function) Función que se ejecuta al confirmar.
 */

export default function ModalConfirmacion({ modo, onClose, onConfirm }) {
  
  const esModoDesactivar = modo === 'desactivar';

  // Configuración dinámica basada en el modo
  const config = {
    titulo: esModoDesactivar ? '¿Estás seguro?' : '¿Activar Evento?',
    descripcion: esModoDesactivar 
      ? 'Estás a punto de desactivar este evento. Los certificados asociados no se verán afectados.'
      : 'Estás a punto de reactivar este evento.',
    textoBoton: esModoDesactivar ? 'Sí, desactivar' : 'Sí, activar',
    icono: esModoDesactivar 
      ? <ExclamationTriangleIcon className="h-16 w-16 text-red-500" />
      : <ArrowPathIcon className="h-16 w-16 text-green-500" />,
    colorBoton: esModoDesactivar 
      ? 'bg-red-600 hover:bg-red-700' 
      : 'bg-green-600 hover:bg-green-700'
  };

  return (
    // Padding y fondo del modal
    <div className="p-8 bg-white text-center flex flex-col items-center">
      {config.icono}
      
      <h2 className="text-3xl font-bold text-gray-900 mt-4 mb-2">{config.titulo}</h2>
      
      <p className="text-gray-600 mb-8">{config.descripcion}</p>
      
      <div className="flex justify-center gap-4 w-full">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className={`flex-1 px-6 py-3 text-white font-semibold rounded-lg ${config.colorBoton}`}
        >
          {config.textoBoton}
        </button>
      </div>
    </div>
  );
}
