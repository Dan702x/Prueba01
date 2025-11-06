import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  XMarkIcon as CloseIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronDownIcon, 
  ArrowPathIcon,
} from "@heroicons/react/24/solid";
import ExcelJS from "exceljs";

import TarjetaEstadistica from "../../components/common/TarjetaEstadistica";
import CustomDateInput from "../../components/common/CustomDateImput";
import InputFiltro from "../../components/common/InputFiltro"; 
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../Styles/datapicker.css";
import DatePickerHeader from "../../components/common/DatePickerHeader";

import { exportEmpresasToExcel } from "../../utils/ExcelService"; 

import EmpresasTable from "../superadmin/Componentes/EmpresasTable";
import ModalEditarEmpresa from "../superadmin/Componentes/ModalEditarEmpresa";
import ModalEliminarEmpresa from "../superadmin/Componentes/ModalEliminarEmpresa";
import ModalResetPassEmpresa from "../superadmin/Componentes/ModalResetPassEmpresa";
import ModalAccionesEmpresa from "../superadmin/Componentes/ModalAccionesEmpresa";
import NotificacionExito from "../../components/common/NotificacionExito";

const empresasIniciales = [
  {
    id: 4,
    nombreContacto: "Marcos Solano",
    emailContacto: "m.solano@tech.com",
    empresa: "Tech Solutions",
    razonSocial: "Tech Solutions SAC",
    ruc: "20678912345",
    fechaAprobacion: "20/10/2025",
    estadoEmpresa: "Activo",
  },
  {
    id: 7,
    nombreContacto: "Sofía Vargas",
    emailContacto: "s.vargas@industrial.net",
    empresa: "Industrial Andina",
    razonSocial: "Industrial Andina S.A.A.",
    ruc: "20444555666",
    fechaAprobacion: "17/10/2025",
    estadoEmpresa: "Activo",
  },
  {
    id: 8,
    nombreContacto: "Juan Diego Recra",
    emailContacto: "jd.recra@lawrence.com",
    empresa: "Lawrence EIRL",
    razonSocial: "Lawrence Asesores SAC",
    ruc: "20777888999",
    fechaAprobacion: "15/10/2025",
    estadoEmpresa: "Inactivo",
  },
  {
    id: 9,
    nombreContacto: "Joaquin Tumba",
    emailContacto: "j.tumba@finanzas.com",
    empresa: "Finanzas Murillo",
    razonSocial: "JTM Consultores",
    ruc: "20112233445",
    fechaAprobacion: "12/10/2025",
    estadoEmpresa: "Activo",
  },
  {
    id: 10,
    nombreContacto: "Roy Silva",
    emailContacto: "r.silva@sistemas.com",
    empresa: "RSQ Tech",
    razonSocial: "RSQ Tech SAC",
    ruc: "20556677889",
    fechaAprobacion: "10/10/2025",
    estadoEmpresa: "Activo",
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

export default function CtrlEmpresas() {
  const [empresas, setEmpresas] = useState(empresasIniciales);

  const [filtrosColumna, setFiltrosColumna] = useState({
    contacto: "",
    busquedaEmpresa: "",
    estadoEmpresa: "Todos",
  });
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [elementosPorPagina] = useState(3);

  const [dropdownAbierto, setDropdownAbierto] = useState(false);
  const dropdownRef = useRef(null);
  const opcionesEstado = ["Todos", "Activo", "Inactivo"];

  const [modalFormVisible, setModalFormVisible] = useState(false);
  const [modalEliminarVisible, setModalEliminarVisible] = useState(false);
  const [modalResetPassVisible, setModalResetPassVisible] = useState(false);
  const [modalAccionesVisible, setModalAccionesVisible] = useState(false);
  
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null);
  const [formData, setFormData] = useState({
    nombreContacto: "",
    emailContacto: "",
    estadoEmpresa: "Activo",
  });

  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const triggerSuccessToast = (message) => {
    setToastMessage(message);
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 3000);
  };

  const handleFiltroColumna = (columna, valor) => {
    setFiltrosColumna((prev) => ({ ...prev, [columna]: valor }));
    setPaginaActual(1);
  };

  const handleRangoFechaChange = (update) => {
    if (Array.isArray(update)) {
      const [start, end] = update;
      setFechaInicio(start);
      setFechaFin(end);
    } else {
      setFechaInicio(null);
      setFechaFin(null);
    }
    setPaginaActual(1);
  };

  const limpiarFechas = () => {
    setFechaInicio(null);
    setFechaFin(null);
    setPaginaActual(1);
  };
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownAbierto(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  const seleccionarEstadoDropdown = (estado) => {
    handleFiltroColumna("estadoEmpresa", estado);
    setDropdownAbierto(false);
  };

  const limpiarTodosLosFiltros = () => {
    setFiltrosColumna({
      contacto: "",
      busquedaEmpresa: "",
      estadoEmpresa: "Todos",
    });
    setFechaInicio(null);
    setFechaFin(null);
    setPaginaActual(1);
  };

  const empresasFiltradas = useMemo(() => {
    return empresas.filter((s) => {
      const filtroContactoLower = filtrosColumna.contacto.toLowerCase();
      if (
        filtrosColumna.contacto &&
        !s.nombreContacto.toLowerCase().includes(filtroContactoLower) &&
        !s.emailContacto.toLowerCase().includes(filtroContactoLower)
      )
        return false;
      
      const filtroEmpresaLower = filtrosColumna.busquedaEmpresa.toLowerCase();
      if (
        filtrosColumna.busquedaEmpresa &&
        !s.empresa.toLowerCase().includes(filtroEmpresaLower) &&
        !s.razonSocial.toLowerCase().includes(filtroEmpresaLower) &&
        !s.ruc.toLowerCase().includes(filtroEmpresaLower)
      )
        return false;
      
      if (
        filtrosColumna.estadoEmpresa !== "Todos" &&
        s.estadoEmpresa !== filtrosColumna.estadoEmpresa
      ) {
        return false;
      }
      
      if (fechaInicio && fechaFin) {
        const [dia, mes, anio] = s.fechaAprobacion.split("/").map(Number);
        const fechaSolicitud = new Date(anio, mes - 1, dia);
        const fechaFinAjustada = new Date(fechaFin);
        fechaFinAjustada.setHours(23, 59, 59, 999);
        const fechaInicioAjustada = new Date(fechaInicio);
        fechaInicioAjustada.setHours(0, 0, 0, 0);

        if (
          fechaSolicitud < fechaInicioAjustada ||
          fechaSolicitud > fechaFinAjustada
        ) {
          return false;
        }
      }
      return true;
    });
  }, [empresas, filtrosColumna, fechaInicio, fechaFin]);

  const estadisticasFiltradas = useMemo(() => {
    const total = empresasFiltradas.length;
    const activas = empresasFiltradas.filter(
      (s) => s.estadoEmpresa === "Activo"
    ).length;
    const inactivas = empresasFiltradas.filter(
      (s) => s.estadoEmpresa === "Inactivo"
    ).length;
    return { total, activas, inactivas };
  }, [empresasFiltradas]);

  const totalPaginas = Math.ceil(empresasFiltradas.length / elementosPorPagina);
  const empresasPaginadas = empresasFiltradas.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );
  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  const handleRowClick = (empresa) => {
    if (window.innerWidth < 768) {
      setEmpresaSeleccionada(empresa);
      setModalAccionesVisible(true);
    }
  };
  const handleEditarClick = (empresa) => {
    setEmpresaSeleccionada(empresa);
    setFormData({
      nombreContacto: empresa.nombreContacto,
      emailContacto: empresa.emailContacto,
      estadoEmpresa: empresa.estadoEmpresa,
    });
    setModalFormVisible(true);
  };
  const handleEliminarClick = (empresa) => {
    setEmpresaSeleccionada(empresa);
    setModalEliminarVisible(true);
  };
  const handleResetPasswordClick = (empresa) => {
    setEmpresaSeleccionada(empresa);
    setModalResetPassVisible(true);
  };
  const handleCloseModalAcciones = () => setModalAccionesVisible(false);
  const handleCloseModalForm = () => setModalFormVisible(false);
  const handleCloseModalEliminar = () => setModalEliminarVisible(false);
  const handleCloseModalResetPass = () => setModalResetPassVisible(false);

  const handleSubmitForm = (e) => {
    e.preventDefault();
    setEmpresas(
      empresas.map((emp) =>
        emp.id === empresaSeleccionada.id ? { ...emp, ...formData } : emp
      )
    );
    handleCloseModalForm();
    triggerSuccessToast("Empresa actualizada con éxito.");
  };
  const handleConfirmEliminar = () => {
    setEmpresas(empresas.filter((emp) => emp.id !== empresaSeleccionada.id));
    handleCloseModalEliminar();
    triggerSuccessToast("Empresa eliminada permanentemente.");
  };
  const handleConfirmResetPassword = () => {
    console.log("Simulando envío de reseteo a:", empresaSeleccionada.emailContacto);
    handleCloseModalResetPass();
    triggerSuccessToast("Nueva contraseña enviada con éxito.");
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDownloadExcel = async () => {
    exportEmpresasToExcel(
      empresasFiltradas,
      filtrosColumna,
      fechaInicio,
      fechaFin
    );
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">
          Control de Empresas
        </h1>
        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={handleDownloadExcel}
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
            Descargar Excel
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm mb-4 flex flex-col">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-4">
            <TarjetaEstadistica label="Total Empresas (Filtradas)" value={estadisticasFiltradas.total} icon={<DocumentTextIcon className="w-6 h-6" />} color="blue" />
          </div>
          <div className="lg:col-span-4">
            <TarjetaEstadistica label="Activas" value={estadisticasFiltradas.activas} icon={<CheckCircleIcon className="w-6 h-6" />} color="green" />
          </div>
          <div className="lg:col-span-4">
            <TarjetaEstadistica label="Inactivas" value={estadisticasFiltradas.inactivas} icon={<XCircleIcon className="w-6 h-6" />} color="gray" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-end pt-4">
          
          <FiltroWrapper label="Contacto (Nombre o Email)" className="lg:col-span-3">
            <InputFiltro
              value={filtrosColumna.contacto}
              onChange={(e) => handleFiltroColumna("contacto", e.target.value)}
              placeholder="Buscar por contacto..."
            />
          </FiltroWrapper>

          <FiltroWrapper label="Empresa (Nombre, Razón o RUC)" className="lg:col-span-3">
            <InputFiltro
              value={filtrosColumna.busquedaEmpresa}
              onChange={(e) => handleFiltroColumna("busquedaEmpresa", e.target.value)}
              placeholder="Buscar por empresa..."
            />
          </FiltroWrapper>

          <FiltroWrapper label="Fecha Aprobación" className="lg:col-span-3">
            <DatePicker
              selectsRange={true}
              startDate={fechaInicio}
              endDate={fechaFin}
              onChange={handleRangoFechaChange}
              dateFormat="dd/MM/yy"
              placeholderText="dd/mm/aa - dd/mm/aa"
              customInput={<CustomDateInput onClear={limpiarFechas} />}
              autoComplete="off"
              renderCustomHeader={(props) => <DatePickerHeader {...props} />}
            />
          </FiltroWrapper>

          <FiltroWrapper label="Estado" className="lg:col-span-3">
            <div className="relative my-1" ref={dropdownRef}>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setDropdownAbierto(!dropdownAbierto); }}
                className="inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-1.5 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {filtrosColumna.estadoEmpresa}
                <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
              </button>
              {dropdownAbierto && (
                <div className="origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
                  <div className="py-1">
                    {opcionesEstado.map((opcion) => (
                      <button
                        key={opcion}
                        onClick={(e) => { e.stopPropagation(); seleccionarEstadoDropdown(opcion); }}
                        className={`${
                          filtrosColumna.estadoEmpresa === opcion
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
            onClick={limpiarTodosLosFiltros}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <ArrowPathIcon className="w-5 h-5" />
            Limpiar
          </button>
        </div>
      </div>

      <EmpresasTable
        empresasPaginadas={empresasPaginadas}
        onRowClick={handleRowClick}
        onEditarClick={handleEditarClick}
        onEliminarClick={handleEliminarClick}
        onResetPasswordClick={handleResetPasswordClick}
      />

      {totalPaginas > 1 && (
        <div className="flex justify-center items-center gap-4 pt-6">
          <button onClick={() => cambiarPagina(paginaActual - 1)} disabled={paginaActual === 1} className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
            <ChevronLeftIcon className="h-5 w-5" /> Anterior
          </button>
          <span className="text-sm text-gray-700">Página {paginaActual} de {totalPaginas}</span>
          <button onClick={() => cambiarPagina(paginaActual + 1)} disabled={paginaActual === totalPaginas} className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
            Siguiente <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      )}

      <div className="mt-6 md:hidden">
        <button
          onClick={handleDownloadExcel}
          className="flex w-full items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <ArrowDownTrayIcon className="w-5 h-5" />
          Descargar Excel
        </button>
      </div>

      <ModalEditarEmpresa
        show={modalFormVisible}
        onClose={handleCloseModalForm}
        onSubmit={handleSubmitForm}
        empresa={empresaSeleccionada}
        formData={formData}
        onFormChange={handleInputChange}
      />
      
      <ModalEliminarEmpresa
        show={modalEliminarVisible}
        onClose={handleCloseModalEliminar}
        onConfirm={handleConfirmEliminar}
        empresa={empresaSeleccionada}
      />

      <ModalResetPassEmpresa
        show={modalResetPassVisible}
        onClose={handleCloseModalResetPass}
        onConfirm={handleConfirmResetPassword}
        empresa={empresaSeleccionada}
      />

      <ModalAccionesEmpresa
        show={modalAccionesVisible}
        onClose={handleCloseModalAcciones}
        empresa={empresaSeleccionada}
        onEditarClick={handleEditarClick}
        onEliminarClick={handleEliminarClick}
        onResetPasswordClick={handleResetPasswordClick}
      />
      
      <NotificacionExito
        message={toastMessage}
        show={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
      />
    </div>
  );
}