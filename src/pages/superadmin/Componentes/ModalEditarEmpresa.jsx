import React from "react";

export default function ModalEditarEmpresa({
  show,
  onClose,
  onSubmit,
  empresa,
  formData,
  onFormChange,
}) {
  if (!show || !empresa) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md z-50">
        <form onSubmit={onSubmit}>
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
            Editar Contacto de Empresa
          </h3>
          <div className="mb-4 p-3 bg-gray-50 rounded-md border border-gray-200">
            <h4 className="text-sm font-medium text-gray-500">
              Editando datos de:
            </h4>
            <p className="text-lg font-semibold text-gray-900">
              {empresa.empresa}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nombre del Contacto
              </label>
              <input
                type="text"
                name="nombreContacto"
                value={formData.nombreContacto}
                onChange={onFormChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email del Contacto
              </label>
              <input
                type="email"
                name="emailContacto"
                value={formData.emailContacto}
                onChange={onFormChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Estado de la Empresa
              </label>
              <select
                name="estadoEmpresa"
                value={formData.estadoEmpresa}
                onChange={onFormChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
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
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Actualizar Contacto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}