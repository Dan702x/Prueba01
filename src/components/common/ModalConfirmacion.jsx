import React from 'react';
import { ExclamationTriangleIcon, ArrowPathIcon, TrashIcon } from '@heroicons/react/24/outline';

const icons = {
  danger: <TrashIcon className="h-12 w-12 text-red-500" />,
  warning: <ExclamationTriangleIcon className="h-12 w-12 text-yellow-500" />,
  success: <ArrowPathIcon className="h-12 w-12 text-green-500" />,
};

const buttonStyles = {
  danger: 'bg-red-600 hover:bg-red-700',
  warning: 'bg-yellow-500 hover:bg-yellow-600 text-white', // Aseguramos texto blanco para contraste
  success: 'bg-green-600 hover:bg-green-700',
};

export default function ModalConfirmacion({ variant = 'warning', title, message, confirmText, onConfirm, onClose }) {
  return (
    <div className="p-6 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          {icons[variant]}
      </div>
      <h3 className="mt-5 text-xl font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-500">{message}</p>
      
      {/* --- CORRECCIÓN AQUÍ: Botones de tamaño fijo --- */}
      <div className="mt-6 flex justify-center gap-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className={`flex-1 px-4 py-2 text-white font-semibold rounded-md ${buttonStyles[variant]}`}
        >
          {confirmText}
        </button>
      </div>
    </div>
  );
}