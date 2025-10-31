import React from "react";

export default function ModalResetPassEmpresa({
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
          Confirmar Reseteo de Contraseña
        </h3>
        <div className="mt-4">
          <p className="text-sm text-gray-600">
            ¿Estás seguro de que quieres enviar una{" "}
            <strong className="text-blue-700">nueva contraseña</strong> al correo:
            <br />
            <strong className="text-gray-900 font-medium">
              {empresa.emailContacto}
            </strong>
            ?
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
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Sí, Enviar Contraseña
          </button>
        </div>
      </div>
    </div>
  );
}