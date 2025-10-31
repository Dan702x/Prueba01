import React from "react";
import {
  XMarkIcon as CloseIcon,
  PencilIcon,
  TrashIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/solid";

export default function ModalAccionesEmpresa({
  show,
  onClose,
  empresa,
  onResetPasswordClick,
  onEditarClick,
  onEliminarClick,
}) {
  if (!show || !empresa) return null;

  const handleEdit = () => {
    onEditarClick(empresa);
    onClose();
  };

  const handleDelete = () => {
    onEliminarClick(empresa);
    onClose();
  };

  const handleResetPass = () => {
    onResetPasswordClick(empresa);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-end justify-center md:hidden"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-lg shadow-2xl w-full max-w-md z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start p-4 border-b border-gray-200">
          <div className="flex-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              {empresa.empresa}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {empresa.razonSocial}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 -mt-2 -mr-2 rounded-full text-gray-400 hover:bg-gray-100"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-3">
          <button
            onClick={handleResetPass}
            className="w-full flex items-center gap-3 px-4 py-3 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 text-left"
          >
            <EnvelopeIcon className="w-5 h-5" />
            Enviar Nueva Contraseña
          </button>

          <button
            onClick={handleEdit}
            className="w-full flex items-center gap-3 px-4 py-3 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 text-left"
          >
            <PencilIcon className="w-5 h-5" />
            Editar Contacto y Estado
          </button>

          <button
            onClick={handleDelete}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-left bg-red-100 text-red-800 hover:bg-red-200"
          >
            <TrashIcon className="w-5 h-5" />
            Eliminar Empresa
          </button>
        </div>
      </div>
    </div>
  );
}