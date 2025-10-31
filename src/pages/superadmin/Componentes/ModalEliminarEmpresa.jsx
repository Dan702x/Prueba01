import React from "react";

export default function ModalEliminarEmpresa({
  show,
  onClose,
  onConfirm,
  empresa,
}) {
  if (!show || !empresa) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md z-50">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Confirmar Eliminación
        </h3>
        <div className="mt-4">
          <p className="text-sm text-gray-600">
            ¿Estás seguro de que quieres{" "}
            <strong className="text-red-700">ELIMINAR PERMANENTEMENTE</strong> la
            empresa "{empresa.empresa}"?
          </p>
          <p className="text-xs text-red-600 mt-2 font-medium">
            ¡Esta acción no se puede deshacer!
          </p>
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
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Sí, Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}