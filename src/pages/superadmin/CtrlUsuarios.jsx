import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  UserGroupIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PencilIcon,
  PlusIcon,
  XMarkIcon as CloseIcon,
  EnvelopeIcon,
  ArrowDownTrayIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/solid";

import TarjetaEstadistica from "../../components/common/TarjetaEstadistica";
import InputFiltro from "../../components/common/InputFiltro";
import NotificacionExito from "../../components/common/NotificacionExito";

import UsuariosTable from "../superadmin/Componentes/UsuariosTable";

import ModalCrearUsuario from "../superadmin/Componentes/ModalCrearUsuario";
import ModalEditarUsuario from "../superadmin/Componentes/ModalEditarUsuario";
import ModalResetPass from "../superadmin/Componentes/ModalResetPass";
import ModalAccionesMovil from "../superadmin/Componentes/ModalAccionesMovil";

import "../../Styles/CtrlUsuarios.css";

import CustomDateInput from "../../components/common/CustomDateImput";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../Styles/datapicker.css";
import DatePickerHeader from "../../components/common/DatePickerHeader";

import { exportUsuariosToExcel } from "../../utils/ExcelService";

const usuariosIniciales = [
  {
    id: 1,
    nombre: "Juan Diego Recra Palomino",
    email: "jd.recra@certify.app",
    rol: "Super Admin",
    estado: "Activo",
  },
  {
    id: 2,
    nombre: "Roy George Silva Quesquen",
    email: "rg.silva@certify.app",
    rol: "Super Admin",
    estado: "Activo",
  },
  {
    id: 3,
    nombre: "Joaquín Tumba Murillo",
    email: "j.tumba@certify.app",
    rol: "Super Admin",
    estado: "Inactivo",
  },
  {
    id: 4,
    nombre: "Pedro Castillo",
    email: "p.castillo@chota.pe",
    rol: "Super Admin",
    estado: "Inactivo",
  },
  {
    id: 5,
    nombre: "Alan Garcia",
    email: "a.garcia@presidencia.pe",
    rol: "Super Admin",
    estado: "Activo",
  },
];

const opcionesEstado = ["Todos", "Activo", "Inactivo"];

const FiltroWrapper = ({ label, children, className = "" }) => (
  <div className={`w-full ${className}`}>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    {children}
  </div>
);

export default function CtrlUsuarios() {
  const [usuarios, setUsuarios] = useState(usuariosIniciales);

  const [filtrosColumna, setFiltrosColumna] = useState({
    nombre: "",
    email: "",
    estado: "Todos",
  });
  const [paginaActual, setPaginaActual] = useState(1);
  const [elementosPorPagina] = useState(2);

  const [dropdownEstadoAbierto, setDropdownEstadoAbierto] = useState(false);
  const dropdownEstadoRef = useRef(null);

  const [modalCrearVisible, setModalCrearVisible] = useState(false);
  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  const [modalResetPassVisible, setModalResetPassVisible] = useState(false);
  const [modalAccionesVisible, setModalAccionesVisible] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownEstadoRef.current &&
        !dropdownEstadoRef.current.contains(event.target)
      ) {
        setDropdownEstadoAbierto(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const seleccionarEstadoDropdown = (estado) => {
    handleFiltroColumna("estado", estado);
    setDropdownEstadoAbierto(false);
  };
  
  // --- NUEVA FUNCIÓN LIMPIAR ---
  const limpiarTodosLosFiltros = () => {
    setFiltrosColumna({
      nombre: "",
      email: "",
      estado: "Todos",
    });
    setPaginaActual(1);
  };

  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter((user) => {
      if (
        filtrosColumna.nombre &&
        !user.nombre.toLowerCase().includes(filtrosColumna.nombre.toLowerCase())
      )
        return false;
      if (
        filtrosColumna.email &&
        !user.email.toLowerCase().includes(filtrosColumna.email.toLowerCase())
      )
        return false;
      if (
        filtrosColumna.estado !== "Todos" &&
        user.estado !== filtrosColumna.estado
      ) {
        return false;
      }
      return true;
    });
  }, [usuarios, filtrosColumna]);

  const estadisticasFiltradas = useMemo(() => {
    const total = usuariosFiltrados.length;
    const activos = usuariosFiltrados.filter(
      (u) => u.estado === "Activo"
    ).length;
    const inactivos = usuariosFiltrados.filter(
      (u) => u.estado === "Inactivo"
    ).length;
    return { total, activos, inactivos };
  }, [usuariosFiltrados]);

  const totalPaginas = Math.ceil(usuariosFiltrados.length / elementosPorPagina);
  const usuariosPaginados = usuariosFiltrados.slice(
    (paginaActual - 1) * elementosPorPagina,
    paginaActual * elementosPorPagina
  );

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  const handleSubmitCrearUsuario = (nuevoUsuario) => {
    const usuarioParaAnadir = {
      id: Date.now(),
      ...nuevoUsuario,
      rol: "Super Admin",
      estado: "Activo",
    };
    setUsuarios((prev) => [usuarioParaAnadir, ...prev]);
    setModalCrearVisible(false);
    triggerSuccessToast("Usuario creado con éxito.");
  };
  const handleEditarClick = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setModalEditarVisible(true);
  };
  const handleSubmitEditarUsuario = (formData) => {
    setUsuarios((prevUsuarios) =>
      prevUsuarios.map((user) =>
        user.id === usuarioSeleccionado.id ? { ...user, ...formData } : user
      )
    );
    setModalEditarVisible(false);
    setUsuarioSeleccionado(null);
    triggerSuccessToast("Usuario actualizado con éxito.");
  };
  
  const handleResetPasswordClick = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setModalResetPassVisible(true);
  };
  const handleConfirmResetPassword = () => {
    console.log("Simulando envío de reseteo a:", usuarioSeleccionado.email);
    setModalResetPassVisible(false);
    setUsuarioSeleccionado(null);
    triggerSuccessToast("Enlace de reseteo enviado con éxito.");
  };
  const handleRowClick = (usuario) => {
    if (window.innerWidth < 768) {
      setUsuarioSeleccionado(usuario);
      setModalAccionesVisible(true);
    }
  };
  
  const handleDownloadExcel = async () => {
    exportUsuariosToExcel(usuariosFiltrados, filtrosColumna);
  };

  return (
    <div className="p-0"> 
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Control de Usuarios</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setModalCrearVisible(true)}
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
          >
            <PlusIcon className="w-5 h-5" />
            Registrar Usuario
          </button>
          <button
            onClick={handleDownloadExcel}
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
            Descargar Excel
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm mb-4 flex flex-col">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <TarjetaEstadistica
            label="Total Super Admins"
            value={estadisticasFiltradas.total}
            icon={<UserGroupIcon className="w-6 h-6" />}
            color="blue"
          />
          <TarjetaEstadistica
            label="Activos"
            value={estadisticasFiltradas.activos}
            icon={<CheckCircleIcon className="w-6 h-6" />}
            color="green"
          />
          <TarjetaEstadistica
            label="Inactivos"
            value={estadisticasFiltradas.inactivos}
            icon={<XCircleIcon className="w-6 h-6" />}
            color="gray"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 items-end pt-4">
          
          <FiltroWrapper label="Usuario (Nombre)">
            <InputFiltro
              value={filtrosColumna.nombre}
              onChange={(e) =>
                handleFiltroColumna("nombre", e.target.value)
              }
              placeholder="Buscar por nombre..."
            />
          </FiltroWrapper>

          <FiltroWrapper label="Email">
            <InputFiltro
              value={filtrosColumna.email}
              onChange={(e) =>
                handleFiltroColumna("email", e.target.value)
              }
              placeholder="Buscar por email..."
            />
          </FiltroWrapper>

          <FiltroWrapper label="Estado">
            <div className="relative my-1" ref={dropdownEstadoRef}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdownEstadoAbierto(!dropdownEstadoAbierto);
                }}
                className="inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-1.5 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {filtrosColumna.estado}
                <ChevronDownIcon
                  className="-mr-1 ml-2 h-5 w-5"
                  aria-hidden="true"
                />
              </button>
              {dropdownEstadoAbierto && (
                <div className="origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
                  <div className="py-1">
                    {opcionesEstado.map((opcion) => (
                      <button
                        key={opcion}
                        onClick={(e) => {
                          e.stopPropagation();
                          seleccionarEstadoDropdown(opcion);
                        }}
                        className={`${
                          filtrosColumna.estado === opcion
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

      <UsuariosTable
        usuariosPaginados={usuariosPaginados}
        onRowClick={handleRowClick}
        onEditarClick={handleEditarClick}
        onResetPasswordClick={handleResetPasswordClick}
        showEliminar={false}
      />

      {totalPaginas > 1 && (
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
      )}

      <div className="mt-6 md:hidden flex flex-col gap-2">
        <button
          onClick={() => setModalCrearVisible(true)}
          className="flex w-full justify-center items-center gap-2 px-4 py-3 font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
        >
          <PlusIcon className="w-5 h-5" />
          Registrar Nuevo Usuario
        </button>
        <button
          onClick={handleDownloadExcel}
          className="flex w-full items-center justify-center gap-2 px-4 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <ArrowDownTrayIcon className="w-5 h-5" />
          Descargar Excel
        </button>
      </div>

      {modalCrearVisible && (
        <ModalCrearUsuario
          onClose={() => setModalCrearVisible(false)}
          onSubmit={handleSubmitCrearUsuario}
        />
      )}

      {modalEditarVisible && usuarioSeleccionado && (
        <ModalEditarUsuario
          usuario={usuarioSeleccionado}
          onClose={() => {
            setModalEditarVisible(false);
            setUsuarioSeleccionado(null);
          }}
          onSubmit={handleSubmitEditarUsuario}
        />
      )}

      {modalResetPassVisible && usuarioSeleccionado && (
        <ModalResetPass
          usuario={usuarioSeleccionado}
          onClose={() => setModalResetPassVisible(false)}
          onConfirm={handleConfirmResetPassword}
        />
      )}

      {modalAccionesVisible && usuarioSeleccionado && (
        <ModalAccionesMovil
          usuario={usuarioSeleccionado}
          onClose={() => setModalAccionesVisible(false)}
          onEdit={() => {
            setModalAccionesVisible(false);
            handleEditarClick(usuarioSeleccionado);
          }}
          onResetPass={() => {
            setModalAccionesVisible(false);
            handleResetPasswordClick(usuarioSeleccionado);
          }}
          showEliminar={false}
        />
      )}

      <NotificacionExito
        message={toastMessage}
        show={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
      />
    </div>
  );
}