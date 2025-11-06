import React from "react";
import {
  EnvelopeIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";

export default function EmpresasTable({
  empresasPaginadas,
  onRowClick,
  onEditarClick,
  onEliminarClick,
  onResetPasswordClick,
}) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {/* --- Cabecera con Títulos --- */}
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Razón Social / RUC</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Contacto</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Fecha Aprobación</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Acciones</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {empresasPaginadas.length > 0 ? (
              empresasPaginadas.map((empresa) => (
                <tr
                  key={empresa.id}
                  className="hover:bg-gray-50 md:cursor-default cursor-pointer"
                  onClick={() => onRowClick(empresa)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{empresa.empresa}</div>
                    <div className="text-sm text-gray-500 md:hidden">{empresa.ruc}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                    <div className="text-sm text-gray-900 font-medium">{empresa.razonSocial}</div>
                    <div className="text-sm text-gray-500">{empresa.ruc}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                    <div className="text-sm font-medium text-gray-900">{empresa.nombreContacto}</div>
                    <div className="text-sm text-gray-500">{empresa.emailContacto}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                    <div className="text-sm text-gray-500">{empresa.fechaAprobacion}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {empresa.estadoEmpresa === "Activo" && (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Activo</span>
                    )}
                    {empresa.estadoEmpresa === "Inactivo" && (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Inactivo</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium hidden md:table-cell">
                    <div className="space-x-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); onResetPasswordClick(empresa); }}
                        className="p-2 rounded-full text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                        title="Enviar nueva contraseña"
                      >
                        <EnvelopeIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onEditarClick(empresa); }}
                        className="p-2 rounded-full text-blue-600 bg-blue-100 hover:bg-blue-200 transition-colors"
                        title="Editar Contacto y Estado"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onEliminarClick(empresa); }}
                        className="p-2 rounded-full text-red-600 bg-red-100 hover:bg-red-200 transition-colors"
                        title="Eliminar Empresa"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                  No se encontraron empresas con los filtros aplicados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}