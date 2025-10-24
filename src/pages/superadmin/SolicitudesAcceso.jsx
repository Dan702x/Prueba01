import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  CheckIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftEllipsisIcon,
  ChevronDownIcon,
  XMarkIcon as CloseIcon,
} from "@heroicons/react/24/solid";

// Simulación del Super Admin actual
const adminActual = "Roy Silva (Super Admin)";

// Datos con razonSocial y ruc agregados
const solicitudesIniciales = [
  {
    id: 1,
    nombre: "Ana García",
    email: "ana.garcia@empresa.com",
    empresa: "Empresa ABC",
    razonSocial: "ABC SAC",
    ruc: "20123456789",
    fecha: "24/10/2025",
    estado: "Pendiente",
    gestionadoPor: null,
    motivoRechazo: null,
    fechaGestion: null,
  },
  {
    id: 2,
    nombre: "Carlos Ruiz",
    email: "carlos.ruiz@constructora.pe",
    empresa: "Constructora XYZ",
    razonSocial: "Constructora XYZ S.A.",
    ruc: "20456789123",
    fecha: "23/10/2025",
    estado: "Pendiente",
    gestionadoPor: null,
    motivoRechazo: null,
    fechaGestion: null,
  },
  {
    id: 3,
    nombre: "Luisa Mendoza",
    email: "luisa.m@gmail.com",
    empresa: "Empresa de Transportes",
    razonSocial: "Transportes Mendoza E.I.R.L",
    ruc: "20567891234",
    fecha: "22/10/2025",
    estado: "Pendiente",
    gestionadoPor: null,
    motivoRechazo: null,
    fechaGestion: null,
  },
  {
    id: 4,
    nombre: "Marcos Solano",
    email: "m.solano@tech.com",
    empresa: "Tech Solutions",
    razonSocial: "Tech Solutions SAC",
    ruc: "20678912345",
    fecha: "20/10/2025",
    estado: "Aprobado",
    gestionadoPor: "Admin (Sistema)",
    motivoRechazo: null,
    fechaGestion: "20/10/2025",
  },
  {
    id: 5,
    nombre: "Julia Torres",
    email: "j.torres@legal.com",
    empresa: "Legal Asesores",
    razonSocial: "Legal Asesores y Consultores S.A.",
    ruc: "20234567890",
    fecha: "19/10/2025",
    estado: "Rechazado",
    gestionadoPor: "Admin (Sistema)",
    motivoRechazo:
      "Empresa no registrada en SUNAT. La documentación presentada no coincide con los registros públicos.",
    fechaGestion: "19/10/2025",
  },
];

export default function SolicitudesAcceso() {
  const [solicitudes, setSolicitudes] = useState(solicitudesIniciales);
  const [filtroBusqueda, setFiltroBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Pendiente");

  // Modales
  const [modalRechazoVisible, setModalRechazoVisible] = useState(false);
  const [solicitudARechazar, setSolicitudARechazar] = useState(null);
  const [motivoRechazo, setMotivoRechazo] = useState("");
  const [modalVistaVisible, setModalVistaVisible] = useState(false);
  const [motivoParaVer, setMotivoParaVer] = useState("");
  const [modalDetallesVisible, setModalDetallesVisible] = useState(false);
  const [solicitudParaDetalles, setSolicitudParaDetalles] = useState(null);

  // Dropdown
  const [dropdownAbierto, setDropdownAbierto] = useState(false);
  const dropdownRef = useRef(null);
  const opcionesEstado = ["Todos", "Pendiente", "Aprobado", "Rechazado"];

  // Efecto para cerrar dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownAbierto(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Función seleccionar estado
  const seleccionarEstado = (estado) => {
    setFiltroEstado(estado);
    setDropdownAbierto(false);
  };

  // Handlers de aprobación y rechazo
  const handleAprobar = (id) => {
    const fechaDeHoy = new Date().toLocaleDateString("es-ES");
    alert(`Usuario ${id} aprobado por ${adminActual}`);
    setSolicitudes(
      solicitudes.map((s) =>
        s.id === id
          ? {
              ...s,
              estado: "Aprobado",
              gestionadoPor: adminActual,
              fechaGestion: fechaDeHoy,
            }
          : s
      )
    );
    setModalDetallesVisible(false);
    setSolicitudParaDetalles(null);
  };

  const handleRechazarClick = (id) => {
    setSolicitudARechazar(id);
    setModalRechazoVisible(true);
    setModalDetallesVisible(false);
    setSolicitudParaDetalles(null);
  };

  const handleConfirmarRechazo = () => {
    if (!motivoRechazo) {
      alert("Por favor, escribe un motivo para el rechazo.");
      return;
    }
    const fechaDeHoy = new Date().toLocaleDateString("es-ES");
    setSolicitudes(
      solicitudes.map((s) =>
        s.id === solicitudARechazar
          ? {
              ...s,
              estado: "Rechazado",
              gestionadoPor: adminActual,
              motivoRechazo: motivoRechazo,
              fechaGestion: fechaDeHoy,
            }
          : s
      )
    );
    handleCerrarModalRechazo();
  };

  const handleCerrarModalRechazo = () => {
    setModalRechazoVisible(false);
    setSolicitudARechazar(null);
    setMotivoRechazo("");
  };

  const handleVerMotivo = (motivo) => {
    setMotivoParaVer(motivo);
    setModalVistaVisible(true);
  };

  const handleCerrarModalVista = () => {
    setModalVistaVisible(false);
    setMotivoParaVer("");
  };

  const handleVerDetalles = (solicitud) => {
    setSolicitudParaDetalles(solicitud);
    setModalDetallesVisible(true);
  };

  const handleCerrarModalDetalles = () => {
    setModalDetallesVisible(false);
    setSolicitudParaDetalles(null);
  };

  // Filtrado con useMemo
  const solicitudesMostradas = useMemo(() => {
    return solicitudes.filter((s) => {
      if (filtroEstado !== "Todos" && s.estado !== filtroEstado) return false;
      const busquedaLower = filtroBusqueda.toLowerCase();
      if (
        filtroBusqueda &&
        !s.nombre.toLowerCase().includes(busquedaLower) &&
        !s.email.toLowerCase().includes(busquedaLower) &&
        !s.empresa.toLowerCase().includes(busquedaLower) &&
        !s.razonSocial.toLowerCase().includes(busquedaLower) &&
        !s.ruc.toLowerCase().includes(busquedaLower)
      )
        return false;
      return true;
    });
  }, [solicitudes, filtroBusqueda, filtroEstado]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Solicitudes de Acceso
      </h1>

      {/* --- Barra de Filtros --- */}
      <div className="mb-4 p-4 bg-white rounded-lg shadow-md flex flex-col md:flex-row items-center gap-4">
        {/* Input */}
        <div className="relative flex-grow w-full md:w-auto">
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filtroBusqueda}
            onChange={(e) => setFiltroBusqueda(e.target.value)}
          />
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
        {/* Dropdown */}
        <div
          className="flex items-center w-full md:w-auto relative"
          ref={dropdownRef}
        >
          <label className="text-sm font-medium text-gray-700 mr-2">
            Estado:
          </label>
          <button
            type="button"
            onClick={() => setDropdownAbierto(!dropdownAbierto)}
            className="inline-flex justify-between w-full md:w-36 rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {filtroEstado}
            <ChevronDownIcon
              className="-mr-1 ml-2 h-5 w-5"
              aria-hidden="true"
            />
          </button>
          {dropdownAbierto && (
            <div className="origin-top-right absolute right-0 mt-2 w-full md:w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10 top-full">
              <div className="py-1">
                {opcionesEstado.map((opcion) => (
                  <button
                    key={opcion}
                    onClick={() => seleccionarEstado(opcion)}
                    className={`${
                      filtroEstado === opcion
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-700"
                    } block w-full text-left px-4 py-2 text-sm hover:bg-gray-100`}
                    role="menuitem"
                  >
                    {opcion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- Contenedor de la Tabla --- */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            {/* Encabezado Responsivo */}
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
            {/* Cuerpo Responsivo */}
            <tbody className="bg-white divide-y divide-gray-200">
              {solicitudesMostradas.length > 0 ? (
                solicitudesMostradas.map((solicitud) => (
                  <tr
                    key={solicitud.id}
                    onClick={() => handleVerDetalles(solicitud)}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    {/* Usuario */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {solicitud.nombre}
                      </div>
                      <div className="text-sm text-gray-500">
                        {solicitud.email}
                      </div>
                    </td>
                    {/* Empresa (Oculta en móvil) */}
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <div className="text-sm text-gray-900">
                        {solicitud.empresa}
                      </div>
                    </td>
                    {/* Razón Social / RUC (Oculta en móvil) */}
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <div className="text-sm text-gray-900 font-medium">
                        {solicitud.razonSocial}
                      </div>
                      <div className="text-sm text-gray-500">
                        {solicitud.ruc}
                      </div>
                    </td>
                    {/* Fecha Solicitud (Oculta en móvil) */}
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <div className="text-sm text-gray-500">
                        {solicitud.fecha}
                      </div>
                    </td>
                    {/* Estado */}
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
                    {/* Celda de Gestión (SOLO DESKTOP) */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium hidden md:table-cell">
                      <div>
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
                            <p className="font-medium text-green-700">
                              Aprobado por:
                            </p>
                            <p>{solicitud.gestionadoPor}</p>
                            <p className="mt-1">{solicitud.fechaGestion}</p>
                          </div>
                        )}
                        {solicitud.estado === "Rechazado" && (
                          <div className="text-xs text-gray-500 text-right">
                            <p className="font-medium text-red-700">
                              Rechazado por:
                            </p>
                            <p>{solicitud.gestionadoPor}</p>
                            <p className="mt-1">{solicitud.fechaGestion}</p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleVerMotivo(solicitud.motivoRechazo);
                              }}
                              className="font-medium text-blue-600 hover:text-blue-800 mt-2 inline-flex items-center gap-1"
                            >
                              <ChatBubbleLeftEllipsisIcon className="w-4 h-4" />
                              Ver Motivo
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
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

      {/* --- Modales --- */}
      {/* Modal de Rechazo */}
      {modalRechazoVisible && (
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
                onClick={handleCerrarModalRechazo}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmarRechazo}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Confirmar Rechazo
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal de Vista */}
      {modalVistaVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md z-50">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Motivo del Rechazo
            </h3>
            <div className="mt-4">
              <div className="text-sm text-gray-700 bg-gray-100 p-3 rounded-md border border-gray-200 whitespace-pre-wrap">
                {motivoParaVer}
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleCerrarModalVista}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
      {/* --- Modal de Detalles (Mejorado con X para cerrar) --- */}
      {modalDetallesVisible && solicitudParaDetalles && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md z-50 flex flex-col max-h-[90vh] relative">
            {" "}
            {/* Botón de Cerrar (X) */}
            <button
              onClick={handleCerrarModalDetalles}
              className="absolute top-3 right-3 p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              title="Cerrar"
            >
              <CloseIcon className="w-6 h-6" />{" "}
              {/* Usamos el alias CloseIcon */}
            </button>
            {/* Título */}
            <h3 className="text-xl font-semibold leading-6 text-gray-900 mb-4 flex-shrink-0 pr-10">
              {" "}
              {/* Añadido pr-10 para espacio con la X */}
              Detalles de la Solicitud
            </h3>
            {/* Sección de Datos (con scroll si es necesario) */}
            <div className="space-y-3 text-sm text-gray-700 mb-6 border-t border-b border-gray-200 py-4 overflow-y-auto flex-grow">
              <div className="flex justify-between">
                <strong className="text-gray-500 mr-2">Nombre:</strong>{" "}
                <span className="text-right">
                  {solicitudParaDetalles.nombre}
                </span>
              </div>
              <div className="flex justify-between">
                <strong className="text-gray-500 mr-2">Email:</strong>{" "}
                <span className="text-right break-all">
                  {solicitudParaDetalles.email}
                </span>
              </div>
              <div className="flex justify-between">
                <strong className="text-gray-500 mr-2">Empresa:</strong>{" "}
                <span className="text-right">
                  {solicitudParaDetalles.empresa}
                </span>
              </div>
              <div className="flex justify-between">
                {" "}
                <strong className="text-gray-500 mr-2">
                  Razón Social:
                </strong>{" "}
                <span className="text-right">
                  {solicitudParaDetalles.razonSocial}
                </span>{" "}
              </div>{" "}
              <div className="flex justify-between">
                {" "}
                <strong className="text-gray-500 mr-2">RUC:</strong>{" "}
                <span className="text-right">{solicitudParaDetalles.ruc}</span>{" "}
              </div>
              <div className="flex justify-between">
                <strong className="text-gray-500 mr-2">Fecha Solicitud:</strong>{" "}
                <span className="text-right">
                  {solicitudParaDetalles.fecha}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <strong className="text-gray-500 mr-2">Estado:</strong>
                <span>
                  {solicitudParaDetalles.estado === "Pendiente" && (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Pendiente
                    </span>
                  )}
                  {solicitudParaDetalles.estado === "Aprobado" && (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Aprobado
                    </span>
                  )}
                  {solicitudParaDetalles.estado === "Rechazado" && (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      Rechazado
                    </span>
                  )}
                </span>
              </div>
              {solicitudParaDetalles.gestionadoPor && (
                <div className="flex justify-between">
                  <strong className="text-gray-500 mr-2">
                    Gestionado por:
                  </strong>{" "}
                  <span className="text-right">
                    {solicitudParaDetalles.gestionadoPor}
                  </span>
                </div>
              )}
              {solicitudParaDetalles.fechaGestion && (
                <div className="flex justify-between">
                  <strong className="text-gray-500 mr-2">Fecha Gestión:</strong>{" "}
                  <span className="text-right">
                    {solicitudParaDetalles.fechaGestion}
                  </span>
                </div>
              )}
              {solicitudParaDetalles.motivoRechazo && (
                <div className="mt-3">
                  <strong className="text-gray-500 block mb-1">
                    Motivo Rechazo:
                  </strong>
                  <p className="text-gray-600 bg-gray-50 p-2 border rounded text-xs">
                    {solicitudParaDetalles.motivoRechazo}
                  </p>
                </div>
              )}
            </div>
            {/* Sección de Acciones (Solo si está pendiente) */}
            {solicitudParaDetalles.estado === "Pendiente" && (
              <div className="flex justify-between items-center mb-0 flex-shrink-0 gap-4 mt-auto">
                {" "}
                {/* mt-auto para empujar hacia abajo */}
                <button
                  type="button"
                  onClick={() => handleRechazarClick(solicitudParaDetalles.id)}
                  className="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 flex items-center justify-center gap-1 text-sm font-medium"
                >
                  <XMarkIcon className="w-5 h-5" /> Rechazar
                </button>
                <button
                  type="button"
                  onClick={() => handleAprobar(solicitudParaDetalles.id)}
                  className="flex-1 px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 flex items-center justify-center gap-1 text-sm font-medium"
                >
                  <CheckIcon className="w-5 h-5" /> Aprobar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
