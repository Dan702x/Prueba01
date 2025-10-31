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
  TrashIcon,
} from "@heroicons/react/24/solid";

import TarjetaEstadistica from "../../components/common/TarjetaEstadistica";
import InputFiltro from "../../components/common/InputFiltro";
import ModalCrearUsuario from "../superadmin/Componentes/ModalCrearUsuario";
import ModalEditarUsuario from "../superadmin/Componentes/ModalEditarUsuario";
import ModalEliminarUsuario from "../superadmin/Componentes/ModalEliminarUsuario";
import ModalResetPass from "../superadmin/Componentes/ModalResetPass";
import ModalAccionesMovil from "../superadmin/Componentes/ModalAccionesMovil";

import "../../Styles/CtrlUsuarios.css";

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
];

const opcionesEstado = ["Todos", "Activo", "Inactivo"];

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
  const [modalEliminarVisible, setModalEliminarVisible] = useState(false);
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

  const handleEliminarClick = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setModalEliminarVisible(true);
  };

  const handleConfirmEliminar = () => {
    setUsuarios((prevUsuarios) =>
      prevUsuarios.filter((user) => user.id !== usuarioSeleccionado.id)
    );
    setModalEliminarVisible(false);
    setUsuarioSeleccionado(null);
    triggerSuccessToast("Usuario eliminado permanentemente.");
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

  return (
    <div className="cu-container">
      <div className="cu-header">
        <h1 className="cu-titulo">Control de Usuarios</h1>
        <button
          onClick={() => setModalCrearVisible(true)}
          className="hidden md:inline-flex items-center gap-2 px-4 py-2 font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
        >
          <PlusIcon className="w-5 h-5" />
          Registrar Nuevo Usuario
        </button>
      </div>

      <div className="cu-stats-grid">
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

      <div className="tabla-wrapper">
        <div className="tabla-container">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="tabla-header-celda">
                  Usuario
                </th>
                <th
                  scope="col"
                  className="tabla-header-celda hidden md:table-cell"
                >
                  Email
                </th>
                <th scope="col" className="tabla-header-celda">
                  Estado
                </th>
                <th
                  scope="col"
                  className="tabla-header-celda hidden md:table-cell"
                >
                  <div className="text-right pr-12">Acciones</div>
                </th>
              </tr>

              <tr className="bg-gray-50 border-t border-gray-200">
                <th className="tabla-header-celda-filtro">
                  <InputFiltro
                    value={filtrosColumna.nombre}
                    onChange={(e) =>
                      handleFiltroColumna("nombre", e.target.value)
                    }
                    placeholder="Buscar por nombre..."
                  />
                </th>
                <th className="tabla-header-celda-filtro hidden md:table-cell">
                  <InputFiltro
                    value={filtrosColumna.email}
                    onChange={(e) =>
                      handleFiltroColumna("email", e.target.value)
                    }
                    placeholder="Buscar por email..."
                  />
                </th>
                <th
                  className="tabla-header-celda-filtro relative"
                  ref={dropdownEstadoRef}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDropdownEstadoAbierto(!dropdownEstadoAbierto);
                    }}
                    className="filtro-dropdown-btn"
                  >
                    {filtrosColumna.estado}
                    <ChevronDownIcon
                      className="-mr-1 ml-2 h-5 w-5"
                      aria-hidden="true"
                    />
                  </button>
                  {dropdownEstadoAbierto && (
                    <div className="filtro-dropdown-menu">
                      <div className="py-1">
                        {opcionesEstado.map((opcion) => (
                          <button
                            key={opcion}
                            onClick={(e) => {
                              e.stopPropagation();
                              seleccionarEstadoDropdown(opcion);
                            }}
                            className={`filtro-dropdown-item ${
                              filtrosColumna.estado === opcion
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-700"
                            }`}
                          >
                            {opcion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </th>
                <th className="tabla-header-celda-filtro hidden md:table-cell"></th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {usuariosPaginados.length > 0 ? (
                usuariosPaginados.map((user) => (
                  <tr
                    key={user.id}
                    className="tabla-body-fila"
                    onClick={() => handleRowClick(user)}
                  >
                    <td className="tabla-body-celda">
                      <div className="text-sm font-medium text-gray-900">
                        {user.nombre}
                      </div>
                      <div className="text-sm text-gray-500 md:hidden">
                        {user.email}
                      </div>
                    </td>
                    <td className="tabla-body-celda hidden md:table-cell">
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="tabla-body-celda">
                      {user.estado === "Activo" && (
                        <span className="badge-activo">Activo</span>
                      )}
                      {user.estado === "Inactivo" && (
                        <span className="badge-inactivo">Inactivo</span>
                      )}
                    </td>
                    <td className="tabla-body-celda text-right hidden md:table-cell">
                      <div className="space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleResetPasswordClick(user);
                          }}
                          className="btn-accion-reset"
                          title="Enviar nueva contraseña"
                        >
                          <EnvelopeIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditarClick(user);
                          }}
                          className="btn-accion-editar"
                          title="Editar Usuario y Estado"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEliminarClick(user);
                          }}
                          className="btn-accion-eliminar"
                          title="Eliminar Usuario"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="cu-no-results-cell">
                    No se encontraron usuarios con los filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPaginas > 1 && (
        <div className="cu-paginacion-contenedor">
          <button
            onClick={() => cambiarPagina(paginaActual - 1)}
            disabled={paginaActual === 1}
            className="btn-paginacion"
          >
            <ChevronLeftIcon className="h-5 w-5" /> Anterior
          </button>
          <span className="text-sm text-gray-700">
            Página {paginaActual} de {totalPaginas}
          </span>
          <button
            onClick={() => cambiarPagina(paginaActual + 1)}
            disabled={paginaActual === totalPaginas}
            className="btn-paginacion"
          >
            Siguiente <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      )}

      <div className="mt-6 md:hidden">
        <button
          onClick={() => setModalCrearVisible(true)}
          className="flex w-full justify-center items-center gap-2 px-4 py-3 font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
        >
          <PlusIcon className="w-5 h-5" />
          Registrar Nuevo Usuario
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

      {modalEliminarVisible && usuarioSeleccionado && (
        <ModalEliminarUsuario
          usuario={usuarioSeleccionado}
          onClose={() => setModalEliminarVisible(false)}
          onConfirm={handleConfirmEliminar}
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
          onDelete={() => {
            setModalAccionesVisible(false);
            handleEliminarClick(usuarioSeleccionado);
          }}
          onResetPass={() => {
            setModalAccionesVisible(false);
            handleResetPasswordClick(usuarioSeleccionado);
          }}
        />
      )}

      {showSuccessToast && (
        <div className="cu-toast-wrapper">
          <div className="cu-toast-panel">
            <CheckCircleIcon className="cu-toast-icon" />
            <p className="cu-toast-msg">{toastMessage}</p>
            <button
              onClick={() => setShowSuccessToast(false)}
              className="cu-toast-close-btn"
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
