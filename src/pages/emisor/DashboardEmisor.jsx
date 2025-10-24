import React from 'react';
import { FunnelIcon } from '@heroicons/react/24/solid';
// Nota: No necesitamos CalendarDaysIcon si usamos type="date"

// --- Componente KpiCard (Reutilizable) ---
// Lo definimos aquí mismo por simplicidad, pero podrías moverlo a 'common' si lo usas en más dashboards
const KpiCard = ({ title, value, valueSize = 'text-4xl' }) => (
  // Cambiamos el fondo a un gris muy claro como en tu imagen
  <div className="bg-gray-100 p-6 rounded-xl shadow-sm border border-gray-200">
    <h3 className="text-sm font-medium text-gray-600 truncate">{title}</h3>
    <p className={`mt-2 font-semibold text-gray-900 ${valueSize}`}>{value}</p>
  </div>
);

export default function DashboardEmisor() {
  
  // Datos de ejemplo (reemplazar con datos reales)
  const certificadosEmitidos = 128;
  const ultimaEmisionFecha = "25/09/2025";
  const ultimaEmisionCantidad = 15;

  return (
    <div className="p-4 md:p-8">
      
      {/* --- Título --- */}
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        Inicio/Reportes
      </h1>

      {/* --- Contenedor Principal (como en tu imagen) --- */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">

        {/* --- Barra de Filtros --- */}
        <div className="flex flex-col sm:flex-row items-end gap-4 mb-8 pb-6 border-b border-gray-200">
          {/* Fecha Desde */}
          <div className="w-full sm:w-auto">
            <label htmlFor="fechaDesde" className="block text-sm font-medium text-gray-700 mb-1">
              Fecha desde:
            </label>
            <input 
              type="date" 
              id="fechaDesde" 
              className="form-input block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              // defaultValue="2023-01-01" // Puedes poner valores por defecto si quieres
            />
          </div>

          {/* Fecha Hasta */}
          <div className="w-full sm:w-auto">
            <label htmlFor="fechaHasta" className="block text-sm font-medium text-gray-700 mb-1">
              Fecha hasta:
            </label>
            <input 
              type="date" 
              id="fechaHasta"
              className="form-input block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              // defaultValue="2023-12-31" 
            />
          </div>

          {/* Botón Filtrar */}
          <div className="w-full sm:w-auto sm:ml-4"> {/* Margen a la izquierda en pantallas sm+ */}
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200">
              <FunnelIcon className="h-5 w-5" />
              Filtrar
            </button>
          </div>
        </div>

        {/* --- KPIs --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <KpiCard 
            title="Certificados Emitidos por ti (últ. 30 días)" 
            value={certificadosEmitidos} 
          />
          <KpiCard 
            title="Tu Última Emisión" 
            // Usamos un tamaño de texto un poco más pequeño para que quepa bien
            value={`${ultimaEmisionFecha} (${ultimaEmisionCantidad} Certificados)`}
            valueSize="text-3xl" 
          />
        </div>

        {/* --- Sección del Gráfico --- */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Emisiones en el Periodo Seleccionado</h3>
          {/* Placeholder para el gráfico */}
          <div className="bg-gray-100 h-80 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500">
            [ Aquí irá el gráfico de Emisiones por Mes ]
          </div>
        </div>

      </div> 
    </div>
  );
}