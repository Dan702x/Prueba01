import React, { useState } from "react";
import {
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowDownTrayIcon,
  ChevronDownIcon, 
  ArrowPathIcon,
} from "@heroicons/react/24/solid";

import { useSolicitudesAcceso } from "./logica/usarSolicitudesAcceso";

import { exportSolicitudesToExcel } from "../../utils/ExcelService";

import TarjetaEstadistica from "../../components/common/TarjetaEstadistica";
import InputFiltro from "../../components/common/InputFiltro";
import CustomDateInput from "../../components/common/CustomDateImput"; 
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../Styles/datapicker.css"; 

import SolicitudesTable from "./Componentes/SolicitudesTable";
import ModalRechazo from "./Componentes/ModalRechazo";
import ModalVerMotivo from "./Componentes/ModalVerMotivo";
import ModalDetalles from "./Componentes/ModalDetalles"; 
import DatePickerHeader from "../../components/common/DatePickerHeader";

const adminActual = "Roy Silva (Super Admin)";

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
  {
    id: 6,
    nombre: "Pedro Navarro",
    email: "p.navarro@comercial.com",
    empresa: "Comercial del Sur",
    razonSocial: "Comercial del Sur S.R.L.",
    ruc: "20111222333",
    fecha: "18/10/2025",
    estado: "Pendiente",
    gestionadoPor: null,
    motivoRechazo: null,
    fechaGestion: null,
  },
  {
    id: 7,
    nombre: "Sofía Vargas",
    email: "s.vargas@industrial.net",
    empresa: "Industrial Andina",
    razonSocial: "Industrial Andina S.A.A.",
    ruc: "20444555666",
    fecha: "17/10/2025",
    estado: "Aprobado",
    gestionadoPor: "Admin (Sistema)",
    motivoRechazo: null,
    fechaGestion: "17/10/2025",
  },
  {
    id: 8,
    nombre: "Juan Diego de Lawrence Recra Palomino",
    email: "jd.lawrence@certify.com",
    empresa: "Consultora Lawrence",
    razonSocial: "Lawrence & Recra SAC",
    ruc: "20888777666",
    fecha: "15/10/2025",
    estado: "Pendiente",
    gestionadoPor: null,
    motivoRechazo: null,
    fechaGestion: null,
  },
  {
    id: 9,
    nombre: "Roy Silva Quesquen",
    email: "roy.silva@certify.com",
    empresa: "Sistemas RSQ",
    razonSocial: "RSQ Tech Solutions",
    ruc: "20111111111",
    fecha: "14/10/2025",
    estado: "Aprobado",
    gestionadoPor: "Admin (Sistema)",
    motivoRechazo: null,
    fechaGestion: "14/10/2025",
  },
  {
    id: 10,
    nombre: "Joaquin Tumba Murillo",
    email: "joaquin.tumba@certify.com",
    empresa: "Finanzas JTM",
    razonSocial: "Asesores Financieros Tumba",
    ruc: "20222222222",
    fecha: "13/10/2025",
    estado: "Rechazado",
    gestionadoPor: "Admin (Sistema)",
    motivoRechazo: "Empresa sin licencia de funcionamiento.",
    fechaGestion: "13/10/2025",
  },
  {
    id: 11,
    nombre: "Pedro Castillo",
    email: "p.castillo@educacion.pe",
    empresa: "Escuela Rural Chota",
    razonSocial: "Minera Chota SAC",
    ruc: "20333333333",
    fecha: "12/10/2025",
    estado: "Pendiente",
    gestionadoPor: null,
    motivoRechazo: null,
    fechaGestion: null,
  },
  {
    id: 12,
    nombre: "Alan Garcia",
    email: "a.garcia@presidencia.pe",
    empresa: "Constructora APRA",
    razonSocial: "Odebrecht Perú SAC",
    ruc: "20444444444",
    fecha: "11/10/2025",
    estado: "Rechazado",
    gestionadoPor: "Admin (Sistema)",
    motivoRechazo: "Datos inconsistentes.",
    fechaGestion: "11/10/2025",
  },
];

const FiltroWrapper = ({ label, children, className = "" }) => (
  <div className={`w-full ${className}`}>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    {children}
  </div>
);

export default function SolicitudesAcceso() {
  const [solicitudes, setSolicitudes] = useState(solicitudesIniciales);

  const {
    solicitudesPaginadas,
    estadisticasFiltradas,
    filtrosProps,
    paginacionProps,
    modalRechazoProps,
    modalVistaProps,
    modalDetallesProps,
    tableActions,
    exportData,
  } = useSolicitudesAcceso({
    solicitudes,
    setSolicitudes,
    adminActual,
  });

  const handleDownloadExcel = () => {
    exportSolicitudesToExcel(
      exportData.solicitudesFiltradas,
      exportData.filtrosColumna,
      exportData.fechaInicio,
      exportData.fechaFin
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Solicitudes de Acceso
        </h1>
        <button
          onClick={handleDownloadExcel}
          className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <ArrowDownTrayIcon className="w-5 h-5" />
          Descargar Excel
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm mb-4 flex flex-col">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          
          <TarjetaEstadistica
            label="Total (Filtradas)"
            value={estadisticasFiltradas.total}
            icon={<DocumentTextIcon className="w-6 h-6" />}
            color="blue"
          />
          <TarjetaEstadistica
            label="Pendientes"
            value={estadisticasFiltradas.pendientes}
            icon={<ClockIcon className="w-6 h-6" />}
            color="yellow"
          />
          <TarjetaEstadistica
            label="Aprobadas"
            value={estadisticasFiltradas.aprobadas}
            icon={<CheckCircleIcon className="w-6 h-6" />}
            color="green"
          />
          <TarjetaEstadistica
            label="Rechazadas"
            value={estadisticasFiltradas.rechazadas}
            icon={<XCircleIcon className="w-6 h-6" />}
            color="red"
          />

          <FiltroWrapper label="Usuario (Nombre o Email)">
            <InputFiltro
              value={filtrosProps.filtrosColumna.usuario}
              onChange={(e) => filtrosProps.handleFiltroColumna("usuario", e.target.value)}
              placeholder="Buscar por usuario..."
            />
          </FiltroWrapper>

          <FiltroWrapper label="Empresa (Nombre, Razón o RUC)">
            <InputFiltro
              value={filtrosProps.filtrosColumna.busquedaEmpresa}
              onChange={(e) => filtrosProps.handleFiltroColumna("busquedaEmpresa", e.target.value)}
              placeholder="Buscar por empresa..."
            />
          </FiltroWrapper>

          <FiltroWrapper label="Rango de Fechas">
            <DatePicker
              selectsRange={true}
              startDate={filtrosProps.fechaInicio}
              endDate={filtrosProps.fechaFin}
              onChange={filtrosProps.handleRangoFechaChange}
              dateFormat="dd/MM/yy"
              placeholderText="dd/mm/aa - dd/mm/aa"
              customInput={<CustomDateInput onClear={filtrosProps.limpiarFechas} />}
              autoComplete="off"
              
              renderCustomHeader={(props) => <DatePickerHeader {...props} />}
            />
          </FiltroWrapper>

          <FiltroWrapper label="Estado">
            <div className="relative my-1" ref={filtrosProps.dropdownRef}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  filtrosProps.setDropdownAbierto(!filtrosProps.dropdownAbierto);
                }}
                className="inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-1.5 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {filtrosProps.filtrosColumna.estado}
                <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
              </button>
              {filtrosProps.dropdownAbierto && (
                <div className="origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
                  <div className="py-1">
                    {filtrosProps.opcionesEstado.map((opcion) => (
                      <button
                        key={opcion}
                        onClick={(e) => {
                          e.stopPropagation();
                          filtrosProps.seleccionarEstadoDropdown(opcion);
                        }}
                        className={`${
                          filtrosProps.filtrosColumna.estado === opcion
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700"
                        } block w-full text-left px-4 py-2 text-sm hover:bg-gray-100`}
                      >
                        {opcion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </FiltroWrapper>
        </div>

        <hr className="my-4 border-gray-200" />

        <div className="flex justify-end">
          <button
            onClick={filtrosProps.limpiarTodosLosFiltros}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <ArrowPathIcon className="w-5 h-5" />
            Limpiar
          </button>
        </div>

      </div>

      <SolicitudesTable
        data={solicitudesPaginadas}
        paginacionProps={paginacionProps}
        tableActions={tableActions}
      />

      <div className="mt-6 md:hidden">
        <button
          onClick={handleDownloadExcel}
          className="flex w-full items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <ArrowDownTrayIcon className="w-5 h-5" />
          Descargar Excel
        </button>
      </div>

      <ModalRechazo {...modalRechazoProps} />
      <ModalVerMotivo {...modalVistaProps} />
      <ModalDetalles {...modalDetallesProps} />
    </div>
  );
}