import React from "react";
import {
  CheckIcon,
  XMarkIcon,
  ChatBubbleLeftEllipsisIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";

const TableRow = ({ solicitud, actions }) => {
  const {
    handleVerDetalles,
    handleAprobar,
    handleRechazarClick,
    handleVerMotivo,
  } = actions;

  return (
    <tr
      onClick={() => handleVerDetalles(solicitud)}
      className="hover:bg-gray-50 cursor-pointer"
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          {solicitud.nombre}
        </div>
        <div className="text-sm text-gray-500">{solicitud.email}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
        <div className="text-sm text-gray-900">{solicitud.empresa}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
        <div className="text-sm text-gray-900 font-medium">
          {solicitud.razonSocial}
        </div>
        <div className="text-sm text-gray-500">{solicitud.ruc}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
        <div className="text-sm text-gray-500">{solicitud.fecha}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {solicitud.estado === "Pendiente" && (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
            Pendiente
          </span>
        )}
        {solicitud.estado === "Aprobado" && (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Aprobado
          </span>
        )}
        {solicitud.estado === "Rechazado" && (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
            Rechazado
          </span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium hidden md:table-cell">
        {solicitud.estado === "Pendiente" && (
          <div className="space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRechazarClick(solicitud.id);
              }}
              className="p-2 rounded-full text-red-600 bg-red-100 hover:bg-red-200 transition-colors"
              title="Rechazar"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAprobar(solicitud.id);
              }}
              className="p-2 rounded-full text-green-600 bg-green-100 hover:bg-green-200 transition-colors"
              title="Aprobar"
            >
              <CheckIcon className="w-4 h-4" />
            </button>
          </div>
        )}
        {solicitud.estado === "Aprobado" && (
          <div className="text-xs text-gray-500 text-right">
            <p className="font-medium text-green-700">Aprobado por:</p>
            <p>{solicitud.gestionadoPor}</p>
            <p className="mt-1">{solicitud.fechaGestion}</p>
          </div>
        )}
        {solicitud.estado === "Rechazado" && (
          <div className="text-xs text-gray-500 text-right">
            <p className="font-medium text-red-700">Rechazado por:</p>
            <p>{solicitud.gestionadoPor}</p>
            <p className="mt-1">{solicitud.fechaGestion}</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleVerMotivo(solicitud.motivoRechazo);
              }}
              className="font-medium text-blue-600 hover:text-blue-800 mt-2 inline-flex items-center gap-1"
            >
              <ChatBubbleLeftEllipsisIcon className="w-4 h-4" /> Ver Motivo
            </button>
          </div>
        )}
      </td>
    </tr>
  );
};

const Paginacion = ({ paginacionProps }) => {
  const { paginaActual, totalPaginas, cambiarPagina } = paginacionProps;

  if (totalPaginas <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-4 pt-6">
      <button
        onClick={() => cambiarPagina(paginaActual - 1)}
        disabled={paginaActual === 1}
        className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeftIcon className="h-5 w-5" /> Anterior
      </button>
      <span className="text-sm text-gray-700">
        Página {paginaActual} de {totalPaginas}
      </span>
      <button
        onClick={() => cambiarPagina(paginaActual + 1)}
        disabled={paginaActual === totalPaginas}
        className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Siguiente <ChevronRightIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default function SolicitudesTable({
  data,
  paginacionProps,
  tableActions,
}) {
  return (
    <>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Usuario
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
                >
                  Empresa
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
                >
                  Razón Social / RUC
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
                >
                  Fecha Solicitud
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Estado
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
                >
                  Gestión / Detalles
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {data.length > 0 ? (
                data.map((solicitud) => (
                  <TableRow
                    key={solicitud.id}
                    solicitud={solicitud}
                    actions={tableActions}
                  />
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No se encontraron solicitudes con los filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Paginacion paginacionProps={paginacionProps} />
    </>
  );
}