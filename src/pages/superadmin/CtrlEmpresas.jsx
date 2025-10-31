import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  ChevronDownIcon,
  XMarkIcon as CloseIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
  PencilIcon,
  TrashIcon, // <-- ¡Añadido!
  CheckCircleIcon,
  XCircleIcon,
  EnvelopeIcon,
  // NoSymbolIcon ya no se usa
} from "@heroicons/react/24/solid";

import ExcelJS from "exceljs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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


function FilterInput({ value, onChange, placeholder = "Filtrar..." }) {
  const handleClick = (e) => {
    e.stopPropagation();
  };
  return (
    <div className="relative my-1">
      <input
        type="text"
        className="w-full pl-8 pr-2 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onClick={handleClick}
      />
      <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
    </div>
  );
}

const CustomDateInput = React.forwardRef(
  ({ value, onClick, onChange, placeholder, onClear }, ref) => (
    <div className="relative my-1">
      <input
        type="text"
        className="w-full pl-8 pr-10 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
        value={value}
        placeholder={placeholder}
        onClick={onClick}
        onChange={onChange}
        ref={ref}
      />
      <CalendarIcon className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      {value && (
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none"
          onClick={(e) => {
            e.stopPropagation();
            onClear();
          }}
        >
          <CloseIcon className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
);

function StatCard({ label, value, icon, color = "blue" }) {
  const colorClasses = {
    blue: { bg: "bg-blue-100", text: "text-blue-600" },
    green: { bg: "bg-green-100", text: "text-green-600" },
    red: { bg: "bg-red-100", text: "text-red-600" },
    gray: { bg: "bg-gray-100", text: "text-gray-600" },
  };
  const selectedColor = colorClasses[color] || colorClasses.blue;
  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 flex items-center">
      <div
        className={`mr-4 flex-shrink-0 p-3 ${selectedColor.bg} ${selectedColor.text} rounded-full`}
      >
        {icon}
      </div>
      <div>
        <div className="text-3xl font-bold text-gray-800">{value}</div>
        <div className="text-sm font-medium text-gray-500">{label}</div>
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

  // --- Estados para Modales (ModalConfirm ahora es para Eliminar) ---
  const [modalFormVisible, setModalFormVisible] = useState(false);
  const [modalEliminarVisible, setModalEliminarVisible] = useState(false); // <-- Renombrado
  const [modalResetPassVisible, setModalResetPassVisible] = useState(false);
  const [modalAccionesVisible, setModalAccionesVisible] = useState(false);
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null);
  
  // --- ¡ACTUALIZADO! formData ahora incluye el estado ---
  const [formData, setFormData] = useState({
    nombreContacto: "",
    emailContacto: "",
    estadoEmpresa: "Activo",
  });

  // --- ¡NUEVO! Estados para el Toast ---
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [dropdownAbierto, setDropdownAbierto] = useState(false);
  const dropdownRef = useRef(null);
  const opcionesEstado = ["Todos", "Activo", "Inactivo"];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownAbierto(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- ¡NUEVO! Función para el Toast ---
  const triggerSuccessToast = (message) => {
    setToastMessage(message);
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 3000);
  };

  const seleccionarEstadoDropdown = (estado) => {
    handleFiltroColumna("estadoEmpresa", estado);
    setDropdownAbierto(false);
  };

  const handleFiltroColumna = (columna, valor) => {
    setFiltrosColumna((prev) => ({
      ...prev,
      [columna]: valor,
    }));
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

  const totalPaginas = Math.ceil(
    empresasFiltradas.length / elementosPorPagina
  );
  const empresasPaginadas = empresasFiltradas.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  // --- Handlers para CRUD y Modales ---

  const handleRowClick = (empresa) => {
    if (window.innerWidth < 768) { 
      setEmpresaSeleccionada(empresa);
      setModalAccionesVisible(true);
    }
  };

  // ¡ACTUALIZADO! Ahora carga el estado también
  const handleEditarClick = (empresa) => {
    setEmpresaSeleccionada(empresa);
    setFormData({
      nombreContacto: empresa.nombreContacto,
      emailContacto: empresa.emailContacto,
      estadoEmpresa: empresa.estadoEmpresa, // <-- ¡NUEVO!
    });
    setModalFormVisible(true);
  };

  // ¡NUEVO! Handler para Eliminar
  const handleEliminarClick = (empresa) => {
    setEmpresaSeleccionada(empresa);
    setModalEliminarVisible(true); // <-- Usa el nuevo modal
  };

  const handleResetPasswordClick = (empresa) => {
    setEmpresaSeleccionada(empresa);
    setModalResetPassVisible(true);
  };

  const handleCloseModalResetPass = () => {
    setModalResetPassVisible(false);
    setEmpresaSeleccionada(null);
  };
  
  const handleCloseModalAcciones = () => {
    setModalAccionesVisible(false);
  };

  const handleConfirmResetPassword = () => {
    console.log("Simulando envío de reseteo a:", empresaSeleccionada.emailContacto);
    handleCloseModalResetPass();
    triggerSuccessToast("Nueva contraseña enviada con éxito.");
  };

  const handleCloseModalForm = () => {
    setModalFormVisible(false);
    setEmpresaSeleccionada(null);
  };

  // ¡NUEVO! Handler para cerrar modal Eliminar
  const handleCloseModalEliminar = () => {
    setModalEliminarVisible(false);
    setEmpresaSeleccionada(null);
  };

  // ¡ACTUALIZADO! Ahora guarda también el estado
  const handleSubmitForm = (e) => {
    e.preventDefault();
    setEmpresas(
      empresas.map((emp) =>
        emp.id === empresaSeleccionada.id
          ? { ...emp, ...formData } // formData ya tiene nombre, email y estado
          : emp
      )
    );
    handleCloseModalForm();
    triggerSuccessToast("Empresa actualizada con éxito.");
  };

  // ¡NUEVO! Handler para confirmar Eliminación
  const handleConfirmEliminar = () => {
    setEmpresas(
      empresas.filter((emp) => emp.id !== empresaSeleccionada.id)
    );
    handleCloseModalEliminar();
    triggerSuccessToast("Empresa eliminada permanentemente.");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDownloadExcel = async () => {
    // ... (lógica de Excel sin cambios) ...
  };


  return (
    <div> {/* <-- ¡AÑADIDO PADDING! (Igual que CtrlUsuarios) */}
      {/* --- Encabezado --- */}
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
        <StatCard label="Total Empresas (Filtradas)" value={estadisticasFiltradas.total} icon={<DocumentTextIcon className="w-6 h-6" />} color="blue" />
        <StatCard label="Activas" value={estadisticasFiltradas.activas} icon={<CheckCircleIcon className="w-6 h-6" />} color="green" />
        <StatCard label="Inactivas" value={estadisticasFiltradas.inactivas} icon={<XCircleIcon className="w-6 h-6" />} color="gray" />
      </div>

      {/* --- Tabla de Empresas --- */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Razón Social / RUC</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Contacto</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Fecha Aprobación</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Acciones</th>
              </tr>
              <tr className="bg-gray-50 border-t border-gray-200">
                <th className="px-6 py-2">
                  <FilterInput value={filtrosColumna.empresa} onChange={(e) => handleFiltroColumna("empresa", e.target.value)} placeholder="Buscar empresa..." />
                </th>
                <th className="px-6 py-2 hidden md:table-cell">
                  <FilterInput value={filtrosColumna.razonRuc} onChange={(e) => handleFiltroColumna("razonRuc", e.target.value)} placeholder="Buscar Razón/RUC..." />
                </th>
                <th className="px-6 py-2 hidden md:table-cell">
                  <FilterInput value={filtrosColumna.contacto} onChange={(e) => handleFiltroColumna("contacto", e.target.value)} placeholder="Buscar contacto..." />
                </th>
                <th className="px-6 py-2 hidden md:table-cell">
                  <DatePicker selectsRange={true} startDate={fechaInicio} endDate={fechaFin} onChange={handleRangoFechaChange} dateFormat="dd/MM/yy" placeholderText="Filtrar por fecha..." customInput={<CustomDateInput onClear={limpiarFechas} />} autoComplete="off" />
                </th>
                <th className="px-6 py-2 relative" ref={dropdownRef}>
                  <button type="button" onClick={(e) => { e.stopPropagation(); setDropdownAbierto(!dropdownAbierto); }} className="inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-1.5 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500">
                    {filtrosColumna.estadoEmpresa}
                    <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                  </button>
                  {dropdownAbierto && (
                    <div className="origin-top-right absolute left-0 md:left-auto right-0 mt-2 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
                      <div className="py-1">
                        {opcionesEstado.map((opcion) => (
                          <button key={opcion} onClick={(e) => { e.stopPropagation(); seleccionarEstadoDropdown(opcion); }} className={`${ filtrosColumna.estadoEmpresa === opcion ? "bg-gray-100 text-gray-900" : "text-gray-700" } block w-full text-left px-4 py-2 text-sm hover:bg-gray-100`} role="menuitem">
                            {opcion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </th>
                <th className="px-6 py-2 hidden md:table-cell"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {empresasPaginadas.length > 0 ? (
                empresasPaginadas.map((empresa) => (
                  <tr 
                    key={empresa.id} 
                    className="hover:bg-gray-50 md:cursor-default cursor-pointer"
                    onClick={() => handleRowClick(empresa)}
                  >
                    {/* ... (otras celdas <td> no cambian) ... */}
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
                      {empresa.estadoEmpresa === "Activo" && (<span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Activo</span>)}
                      {empresa.estadoEmpresa === "Inactivo" && (<span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Inactivo</span>)}
                    </td>

                    {/* --- ¡COLUMNA DE ACCIONES ACTUALIZADA! --- */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium hidden md:table-cell">
                      <div className="space-x-2">
                        <button onClick={(e) => {e.stopPropagation(); handleResetPasswordClick(empresa)}} className="p-2 rounded-full text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors" title="Enviar nueva contraseña">
                          <EnvelopeIcon className="w-4 h-4" />
                        </button>
                        <button onClick={(e) => {e.stopPropagation(); handleEditarClick(empresa)}} className="p-2 rounded-full text-blue-600 bg-blue-100 hover:bg-blue-200 transition-colors" title="Editar Contacto y Estado">
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        {/* --- ¡BOTÓN CAMBIADO A ELIMINAR! --- */}
                        <button onClick={(e) => {e.stopPropagation(); handleEliminarClick(empresa)}} className="p-2 rounded-full text-red-600 bg-red-100 hover:bg-red-200 transition-colors" title="Eliminar Empresa">
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

      {/* --- Paginación --- */}
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

      {/* Botón de Excel para Móvil */}
      <div className="mt-6 md:hidden">
        <button
          onClick={handleDownloadExcel}
          className="flex w-full items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <ArrowDownTrayIcon className="w-5 h-5" />
          Descargar Excel
        </button>
      </div>

      {/* --- MODAL EDITAR (¡ACTUALIZADO CON ESTADO!) --- */}
      {modalFormVisible && empresaSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md z-50">
            <form onSubmit={handleSubmitForm}>
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Editar Contacto de Empresa</h3>
              <div className="mb-4 p-3 bg-gray-50 rounded-md border border-gray-200">
                <h4 className="text-sm font-medium text-gray-500">Editando datos de:</h4>
                <p className="text-lg font-semibold text-gray-900">{empresaSeleccionada.empresa}</p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre del Contacto</label>
                    <input type="text" name="nombreContacto" value={formData.nombreContacto} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email del Contacto</label>
                    <input type="email" name="emailContacto" value={formData.emailContacto} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" required />
                  </div>
                  {/* --- ¡CAMPO DE ESTADO AÑADIDO! --- */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Estado de la Empresa</label>
                    <select name="estadoEmpresa" value={formData.estadoEmpresa} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                    </select>
                  </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button type="button" onClick={handleCloseModalForm} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Actualizar Contacto</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ¡MODAL DE ELIMINAR (Antes Deshabilitar)! --- */}
      {modalEliminarVisible && empresaSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md z-50">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Confirmar Eliminación</h3>
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                ¿Estás seguro de que quieres <strong className="text-red-700">ELIMINAR PERMANENTEMENTE</strong> la empresa "{empresaSeleccionada.empresa}"?
              </p>
              <p className="text-xs text-red-600 mt-2 font-medium">
                ¡Esta acción no se puede deshacer!
              </p>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button type="button" onClick={handleCloseModalEliminar} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancelar</button>
              <button type="button" onClick={handleConfirmEliminar} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Modal Reset Password (sin cambios) --- */}
      {modalResetPassVisible && empresaSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md z-50">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Confirmar Reseteo de Contraseña</h3>
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                ¿Estás seguro de que quieres enviar una <strong className="text-blue-700">nueva contraseña</strong> al correo:
                <br />
                <strong className="text-gray-900 font-medium">{empresaSeleccionada.emailContacto}</strong>?
              </p>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button type="button" onClick={handleCloseModalResetPass} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancelar</button>
              <button type="button" onClick={handleConfirmResetPassword} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Sí, Enviar Contraseña
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL ACCIONES MÓVIL (¡ACTUALIZADO!) --- */}
      {modalAccionesVisible && empresaSeleccionada && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-end justify-center md:hidden"
          onClick={handleCloseModalAcciones}
        >
          <div 
            className="bg-white rounded-t-lg shadow-2xl w-full max-w-md z-50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Encabezado (sin cambios) ... */}
            <div className="flex justify-between items-start p-4 border-b border-gray-200">
              <div className="flex-1">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  {empresaSeleccionada.empresa}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {empresaSeleccionada.razonSocial}
                </p>
                {/* ... más info ... */}
              </div>
              <button 
                onClick={handleCloseModalAcciones} 
                className="p-2 -mt-2 -mr-2 rounded-full text-gray-400 hover:bg-gray-100"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>
            
            {/* Lista de Acciones Móvil */}
            <div className="p-4 space-y-3">
              <button
                onClick={() => {
                  handleResetPasswordClick(empresaSeleccionada);
                  handleCloseModalAcciones();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 text-left"
              >
                <EnvelopeIcon className="w-5 h-5" />
                Enviar Nueva Contraseña
              </button>
              
              <button
                onClick={() => {
                  handleEditarClick(empresaSeleccionada);
                  handleCloseModalAcciones();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 text-left"
              >
                <PencilIcon className="w-5 h-5" />
                Editar Contacto y Estado
              </button>
              
              {/* --- ¡BOTÓN CAMBIADO A ELIMINAR! --- */}
              <button
                onClick={() => {
                  handleEliminarClick(empresaSeleccionada);
                  handleCloseModalAcciones();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-left bg-red-100 text-red-800 hover:bg-red-200"
              >
                <TrashIcon className="w-5 h-5" />
                Eliminar Empresa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- TOAST DE ÉXITO --- */}
      {showSuccessToast && (
        <div className="fixed top-5 right-5 z-50">
          <div className="max-w-sm w-full bg-green-500 text-white rounded-md shadow-lg flex items-center p-4">
            <CheckCircleIcon className="w-6 h-6 mr-3" />
            <p className="flex-1 text-sm font-medium">{toastMessage}</p>
            <button
              onClick={() => setShowSuccessToast(false)}
              className="ml-3 p-1 rounded-md hover:bg-green-600 focus:outline-none"
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div> 
  );
}