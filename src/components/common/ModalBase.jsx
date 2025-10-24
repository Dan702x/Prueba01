import React from 'react';

/**
 * Componente base reutilizable para todos los modales.
 * Props:
 * - isOpen: (boolean) Controla si el modal está visible.
 * - onClose: (function) La función que se llama para cerrar el modal.
 * - children: (ReactNode) El contenido que va dentro del modal (ej. un formulario).
 * - maxWidth: (string) (Opcional) Clase de Tailwind para el ancho. Ej. 'md:max-w-md', 'md:max-w-xl'.
 */
export default function ModalBase({ isOpen, onClose, children, maxWidth = 'md:max-w-xl' }) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
      onClick={onClose} // Cierra el modal al hacer clic en el fondo
    >
      {/* Contenedor del Modal */}
      <div
        className={`bg-white rounded-xl shadow-2xl w-full ${maxWidth} overflow-hidden border-2 border-white`}
        onClick={(e) => e.stopPropagation()} // Evita que el clic en el modal lo cierre
      >
        
        {/* --- Contenido del Modal --- */}
        <div>
          {children}
        </div>

      </div>
    </div>
  );
}
