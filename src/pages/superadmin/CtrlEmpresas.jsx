import React, { useState, useMemo } from "react";
import {
  XMarkIcon as CloseIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import ExcelJS from "exceljs";

import TarjetaEstadistica from "../../components/common/TarjetaEstadistica";
import CustomDateInput from "../../components/common/CustomDateImput"; 
import InputFiltro from "../../components/common/InputFiltro"; 
import EmpresasTable from "../superadmin/Componentes/EmpresasTable";
import ModalEditarEmpresa from "../superadmin/Componentes/ModalEditarEmpresa";
import ModalEliminarEmpresa from "../superadmin/Componentes/ModalEliminarEmpresa";
import ModalResetPassEmpresa from "../superadmin/Componentes/ModalResetPassEmpresa";
import ModalAccionesEmpresa from "../superadmin/Componentes/ModalAccionesEmpresa";

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
];

function SuccessToast({ message, show, onClose }) {
  if (!show) return null;
  return (
    <div className="fixed top-5 right-5 z-50 animate-slide-in-right">
      <div className="max-w-sm w-full bg-green-500 text-white rounded-md shadow-lg flex items-center p-4">
        <CheckCircleIcon className="w-6 h-6 mr-3" />
        <p className="flex-1 text-sm font-medium">{message}</p>
        <button
          onClick={onClose}
          className="ml-3 p-1 rounded-md hover:bg-green-600 focus:outline-none"
        >
          <CloseIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function CtrlEmpresas() {
  const [empresas, setEmpresas] = useState(empresasIniciales);

  const [filtrosColumna, setFiltrosColumna] = useState({
    contacto: "",
    empresa: "",
    razonRuc: "",
    estadoEmpresa: "Todos",
  });
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [elementosPorPagina] = useState(1);

  // --- ESTADOS DE MODALES ---
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

  const empresasFiltradas = useMemo(() => {
    return empresas.filter((s) => {
      const filtroContactoLower = filtrosColumna.contacto.toLowerCase();
      if (
        filtrosColumna.contacto &&
        !s.nombreContacto.toLowerCase().includes(filtroContactoLower) &&
        !s.emailContacto.toLowerCase().includes(filtroContactoLower)
      )
        return false;
      const filtroEmpresaLower = filtrosColumna.empresa.toLowerCase();
      if (
        filtrosColumna.empresa &&
        !s.empresa.toLowerCase().includes(filtroEmpresaLower)
      )
        return false;
      const filtroRazonRucLower = filtrosColumna.razonRuc.toLowerCase();
      if (
        filtrosColumna.razonRuc &&
        !s.razonSocial.toLowerCase().includes(filtroRazonRucLower) &&
        !s.ruc.toLowerCase().includes(filtroRazonRucLower)
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
    console.log("Descargando Excel...");
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <TarjetaEstadistica label="Total Empresas (Filtradas)" value={estadisticasFiltradas.total} icon={<DocumentTextIcon className="w-6 h-6" />} color="blue" />
        <TarjetaEstadistica label="Activas" value={estadisticasFiltradas.activas} icon={<CheckCircleIcon className="w-6 h-6" />} color="green" />
        <TarjetaEstadistica label="Inactivas" value={estadisticasFiltradas.inactivas} icon={<XCircleIcon className="w-6 h-6" />} color="gray" />
      </div>

      <EmpresasTable
        empresasPaginadas={empresasPaginadas}
        filtrosColumna={filtrosColumna}
        fechaInicio={fechaInicio}
        fechaFin={fechaFin}
        onFiltroColumnaChange={handleFiltroColumna}
        onRangoFechaChange={handleRangoFechaChange}
        onLimpiarFechas={limpiarFechas}
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
      
      <SuccessToast
        message={toastMessage}
        show={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
      />
    </div>
  );
}