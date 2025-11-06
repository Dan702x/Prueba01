import React from "react";
import {
  CheckIcon,
  XMarkIcon,
  XMarkIcon as CloseIcon,
} from "@heroicons/react/24/solid";

const DetailRow = ({ label, children }) => (
  <div className="flex justify-between">
    <strong className="text-gray-500 mr-2">{label}:</strong>
    <span className="text-right break-all">{children}</span>
  </div>
);

const StatusBadge = ({ estado }) => {
  if (estado === "Pendiente") {
    return (
      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
        Pendiente
      </span>
    );
  }
  if (estado === "Aprobado") {
    return (
      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
        Aprobado
      </span>
    );
  }
  return (
    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
      Rechazado
    </span>
  );
};

export default function ModalDetalles({
  isOpen,
  onClose,
  solicitud,
  onAprobar,
  onRechazar,
}) {
  if (!isOpen || !solicitud) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md z-50 flex flex-col max-h-[90vh] relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          title="Cerrar"
        >
          <CloseIcon className="w-6 h-6" />
        </button>

        <h3 className="text-xl font-semibold leading-6 text-gray-900 mb-4 flex-shrink-0 pr-10">
          Detalles de la Solicitud
        </h3>

        <div className="space-y-3 text-sm text-gray-700 mb-6 border-t border-b border-gray-200 py-4 overflow-y-auto flex-grow">
          <DetailRow label="Nombre">{solicitud.nombre}</DetailRow>
          <DetailRow label="Email">{solicitud.email}</DetailRow>
          <DetailRow label="Empresa">{solicitud.empresa}</DetailRow>
          <DetailRow label="Razón Social">{solicitud.razonSocial}</DetailRow>
          <DetailRow label="RUC">{solicitud.ruc}</DetailRow>
          <DetailRow label="Fecha Solicitud">{solicitud.fecha}</DetailRow>

          <div className="flex justify-between items-center">
            <strong className="text-gray-500 mr-2">Estado:</strong>
            <StatusBadge estado={solicitud.estado} />
          </div>

          {solicitud.gestionadoPor && (
            <DetailRow label="Gestionado por">
              {solicitud.gestionadoPor}
            </DetailRow>
          )}
          {solicitud.fechaGestion && (
            <DetailRow label="Fecha Gestión">
              {solicitud.fechaGestion}
            </DetailRow>
          )}
          {solicitud.motivoRechazo && (
            <div className="mt-3">
              <strong className="text-gray-500 block mb-1">
                Motivo Rechazo:
              </strong>
              <p className="text-gray-600 bg-gray-50 p-2 border rounded text-xs">
                {solicitud.motivoRechazo}
              </p>
            </div>
          )}
        </div>

        {solicitud.estado === "Pendiente" && (
          <div className="flex justify-between items-center mb-0 flex-shrink-0 gap-4 mt-auto">
            <button
              type="button"
              onClick={() => onRechazar(solicitud.id)}
              className="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 flex items-center justify-center gap-1 text-sm font-medium"
            >
              <XMarkIcon className="w-5 h-5" /> Rechazar
            </button>
            <button
              type="button"
              onClick={() => onAprobar(solicitud.id)}
              className="flex-1 px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 flex items-center justify-center gap-1 text-sm font-medium"
            >
              <CheckIcon className="w-5 h-5" /> Aprobar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}