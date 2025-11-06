import React from "react";

export default function ModalVerMotivo({ isOpen, onClose, motivo }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md z-50">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Motivo del Rechazo
        </h3>
        <div className="mt-4">
          <div className="text-sm text-gray-700 bg-gray-100 p-3 rounded-md border border-gray-200 whitespace-pre-wrap">
            {motivo}
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}