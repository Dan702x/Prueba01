import React, { useState, useEffect } from "react";

export default function ModalRechazo({ isOpen, onClose, onSubmit }) {
  const [motivoRechazo, setMotivoRechazo] = useState("");

  useEffect(() => {
    if (isOpen) {
      setMotivoRechazo("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit(motivoRechazo);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md z-50">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Motivo del Rechazo
        </h3>
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">
            Por favor, escribe por qué se está rechazando esta solicitud de
            acceso.
          </p>
          <textarea
            rows="4"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={motivoRechazo}
            onChange={(e) => setMotivoRechazo(e.target.value)}
            placeholder="Ej: La empresa no cumple con los requisitos..."
          ></textarea>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Confirmar Rechazo
          </button>
        </div>
      </div>
    </div>
  );
}