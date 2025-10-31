import React, { useState, useRef, useEffect } from "react";
import InputFiltro from "../../../components/common/InputFiltro";
import CustomDateInput from "../../../components/common/CustomDateImput";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  ChevronDownIcon,
  EnvelopeIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";

function FiltroEstado({ estadoActual, onSelectEstado }) {
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

  const seleccionarEstado = (estado) => {
    onSelectEstado(estado);
    setDropdownAbierto(false);
  };

  return (
    <th className="px-6 py-2 relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setDropdownAbierto(!dropdownAbierto);
        }}
        className="inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-1.5 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        {estadoActual}
        <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
      </button>
      {dropdownAbierto && (
        <div className="origin-top-right absolute left-0 md:left-auto right-0 mt-2 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
          <div className="py-1">
            {opcionesEstado.map((opcion) => (
              <button
                key={opcion}
                onClick={(e) => {
                  e.stopPropagation();
                  seleccionarEstado(opcion);
                }}
                className={`${
                  estadoActual === opcion
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
    </th>
  );
}

export default function EmpresasTable({
  empresasPaginadas,
  filtrosColumna,
  fechaInicio,
  fechaFin,
  onFiltroColumnaChange,
  onRangoFechaChange,
  onLimpiarFechas,
  onRowClick,
  onEditarClick,
  onEliminarClick,
  onResetPasswordClick,
}) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {/* --- Cabecera con Títulos --- */}
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Razón Social / RUC</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Contacto</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Fecha Aprobación</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Acciones</th>
            </tr>

            {/* --- Cabecera con Filtros --- */}
            <tr className="bg-gray-50 border-t border-gray-200">
              <th className="px-6 py-2">
                <InputFiltro
                  value={filtrosColumna.empresa}
                  onChange={(e) => onFiltroColumnaChange("empresa", e.target.value)}
                  placeholder="Buscar empresa..."
                />
              </th>
              <th className="px-6 py-2 hidden md:table-cell">
                <InputFiltro
                  value={filtrosColumna.razonRuc}
                  onChange={(e) => onFiltroColumnaChange("razonRuc", e.target.value)}
                  placeholder="Buscar Razón/RUC..."
                />
              </th>
              <th className="px-6 py-2 hidden md:table-cell">
                <InputFiltro
                  value={filtrosColumna.contacto}
                  onChange={(e) => onFiltroColumnaChange("contacto", e.target.value)}
                  placeholder="Buscar contacto..."
                />
              </th>
              <th className="px-6 py-2 hidden md:table-cell">
                <DatePicker
                  selectsRange={true}
                  startDate={fechaInicio}
                  endDate={fechaFin}
                  onChange={onRangoFechaChange}
                  dateFormat="dd/MM/yy"
                  placeholderText="Filtrar por fecha..."
                  customInput={<CustomDateInput onClear={onLimpiarFechas} />}
                  autoComplete="off"
                />
              </th>

              <FiltroEstado
                estadoActual={filtrosColumna.estadoEmpresa}
                onSelectEstado={(estado) => onFiltroColumnaChange("estadoEmpresa", estado)}
              />

              <th className="px-6 py-2 hidden md:table-cell"></th>
            </tr>
          </thead>

          {/* --- Cuerpo de la Tabla --- */}
          <tbody className="bg-white divide-y divide-gray-200">
            {empresasPaginadas.length > 0 ? (
              empresasPaginadas.map((empresa) => (
                <tr
                  key={empresa.id}
                  className="hover:bg-gray-50 md:cursor-default cursor-pointer"
                  onClick={() => onRowClick(empresa)}
                >
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
                    {empresa.estadoEmpresa === "Activo" && (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Activo</span>
                    )}
                    {empresa.estadoEmpresa === "Inactivo" && (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Inactivo</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium hidden md:table-cell">
                    <div className="space-x-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); onResetPasswordClick(empresa); }}
                        className="p-2 rounded-full text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                        title="Enviar nueva contraseña"
                      >
                        <EnvelopeIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onEditarClick(empresa); }}
                        className="p-2 rounded-full text-blue-600 bg-blue-100 hover:bg-blue-200 transition-colors"
                        title="Editar Contacto y Estado"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onEliminarClick(empresa); }}
                        className="p-2 rounded-full text-red-600 bg-red-100 hover:bg-red-200 transition-colors"
                        title="Eliminar Empresa"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              /* --- Estado Vacío --- */
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
  );
}