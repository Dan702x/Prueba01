import React from "react";
import {
  PencilIcon,
  EnvelopeIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";

export default function UsuariosTable({
  usuariosPaginados,
  onRowClick,
  onEditarClick,
  onEliminarClick,
  onResetPasswordClick,
  showEliminar = true,
}) {
  return (
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
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {usuariosPaginados.length > 0 ? (
              usuariosPaginados.map((user) => (
                <tr
                  key={user.id}
                  className="tabla-body-fila"
                  onClick={() => onRowClick(user)}
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
                          onResetPasswordClick(user);
                        }}
                        className="btn-accion-reset"
                        title="Enviar nueva contraseña"
                      >
                        <EnvelopeIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditarClick(user);
                        }}
                        className="btn-accion-editar"
                        title="Editar Usuario y Estado"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>

                      {showEliminar && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEliminarClick(user);
                          }}
                          className="btn-accion-eliminar"
                          title="Eliminar Usuario"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      )}
                      
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
  );
}