import React from "react";
import InputFiltro from "../../../components/common/InputFiltro";
import CustomDateInput from "../../../components/common/CustomDateImput";
import DatePicker from "react-datepicker";
import { ChevronDownIcon, ArrowPathIcon } from "@heroicons/react/24/solid";

const FiltroWrapper = ({ label, children, className = "" }) => (
  <div className={`w-full ${className}`}>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    {children}
  </div>
);

export default function PanelFiltros({ filtrosProps }) {
  const {
    filtrosColumna,
    fechaInicio,
    fechaFin,
    dropdownAbierto,
    dropdownRef,
    opcionesEstado,
    handleFiltroColumna,
    handleRangoFechaChange,
    limpiarFechas,
    setDropdownAbierto,
    seleccionarEstadoDropdown,
    limpiarTodosLosFiltros,
  } = filtrosProps;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 mb-4 flex flex-col">
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 items-end">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-end">
          
          <FiltroWrapper E
            label="Usuario (Nombre o Email)" 
          >
            <InputFiltro
              value={filtrosColumna.usuario}
              onChange={(e) => handleFiltroColumna("usuario", e.target.value)}
              placeholder="Buscar por usuario..."
            />
          </FiltroWrapper>

          <FiltroWrapper 
            label="Empresa (Nombre, Razón o RUC)" 
          >
            <InputFiltro
              value={filtrosColumna.busquedaEmpresa}
              onChange={(e) =>
                handleFiltroColumna("busquedaEmpresa", e.target.value)
              }
              placeholder="Buscar por empresa..."
            />
          </FiltroWrapper>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-end">

          <FiltroWrapper 
            label="Rango de Fechas" 
          >
            <DatePicker
              selectsRange={true}
              startDate={fechaInicio}
              endDate={fechaFin}
              onChange={handleRangoFechaChange}
              dateFormat="dd/MM/yy"
              placeholderText="dd/mm/aa - dd/mm/aa"
              customInput={<CustomDateInput onClear={limpiarFechas} />}
              autoComplete="off"
            />
          </FiltroWrapper>

          <FiltroWrapper 
            label="Estado" 
          >
            <div className="relative my-1" ref={dropdownRef}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdownAbierto(!dropdownAbierto);
                }}
                className="inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-1.5 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {filtrosColumna.estado}
                <ChevronDownIcon
                  className="-mr-1 ml-2 h-5 w-5"
                  aria-hidden="true"
                />
              </button>
              {dropdownAbierto && (
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
  );
}