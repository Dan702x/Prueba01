import React from 'react';

// Un componente pequeño para las tarjetas de KPI
function KpiCard({ title, value, bgColor = 'bg-gray-50' }) {
  return (
    <div className={`p-4 rounded-lg shadow-md ${bgColor} border border-gray-200`}>
      <p className="text-sm text-gray-600">{title}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

export default function Inicio() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Inicio / Reportes</h1>

      {/* --- SECCIÓN DE FILTROS --- */}
      <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg flex flex-wrap items-center gap-4">
        {/* Filtro Empresa */}
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="empresa" className="block text-sm font-medium text-gray-700 mb-1">
            Empresa
          </label>
          <select
            id="empresa"
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
          >
            <option>Innovatech Solutions</option>
            <option>Otra Empresa</option>
          </select>
        </div>

        {/* Filtro Fecha Desde */}
        <div className="flex-1 min-w-[150px]">
          <label htmlFor="fecha-desde" className="block text-sm font-medium text-gray-700 mb-1">
            Fecha desde:
          </label>
          <input
            type="text"
            id="fecha-desde"
            placeholder="dd/mm/aaaa"
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {/* Filtro Fecha Hasta */}
        <div className="flex-1 min-w-[150px]">
          <label htmlFor="fecha-hasta" className="block text-sm font-medium text-gray-700 mb-1">
            Fecha hasta:
          </label>
          <input
            type="text"
            id="fecha-hasta"
            placeholder="dd/mm/aaaa"
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {/* Botones */}
        <div className="flex items-end gap-2 pt-5">
          <button className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 shadow-sm">
            Filtrar
          </button>
          <button className="bg-white text-gray-700 px-5 py-2 rounded-md border border-gray-300 hover:bg-gray-50 shadow-sm">
            Exportar
          </button>
        </div>
      </div>

      {/* --- SECCIÓN DE KPIs (5 TARJETAS) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <KpiCard title="Total Empresas Activas" value="2" />
        <KpiCard title="Total Certificados Emitidos" value="1,250" />
        <KpiCard title="Certificados Válidos" value="1,235" />
        <KpiCard title="Certificados Anulados" value="15" bgColor="bg-red-50" />
        <KpiCard title="Practicantes Activos" value="45" />
      </div>

      {/* --- SECCIÓN DE GRÁFICOS (en 2 columnas) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Columna Izquierda (Gráficos principales) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Gráfico de Barras Emisiones */}
          <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-md min-h-[300px]">
            <h2 className="font-semibold text-gray-800 mb-2">Emisiones en el Periodo Seleccionado</h2>
            <div className="flex items-center justify-center h-full text-gray-500">
              [ Gráfico de Barras: Emisiones por Mes ]
            </div>
          </div>

          {/* Gráfico Top 5 Empresas */}
          <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-md">
            <h2 className="font-semibold text-gray-800 mb-4">Top 5 Empresas con más Emisiones</h2>
            <div className="space-y-4">
              {/* Ejemplo de una barra */}
              <div>
                <span className="text-sm font-medium text-blue-700">Rapid empresa S.A.C</span>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
              {/* Ejemplo de otra barra */}
              <div>
                <span className="text-sm font-medium text-blue-700">Innovatech Solutions</span>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '56%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha (Gráfico de Torta y Actividad) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Gráfico Distribución por Estado */}
          <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-md">
            <h2 className="font-semibold text-gray-800 mb-2">Distribución por Estado</h2>
            <div className="flex items-center justify-center min-h-[200px] text-gray-500">
              [ Placeholder para Gráfico de Torta (Donut) ]
            </div>
            <div className="flex justify-center gap-4 text-sm">
                <span className="flex items-center"><span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>Válidos (100%)</span>
                <span className="flex items-center"><span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>Anulados (0%)</span>
            </div>
          </div>

          {/* Actividad Reciente */}
          <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-md">
            <h2 className="font-semibold text-gray-800 mb-4">Actividad Reciente del Sistema</h2>
            <ul className="space-y-3">
              <li className="text-sm">
                <p className="font-medium text-gray-900">Nueva empresa registrada: Innovatech Solutions</p>
                <p className="text-gray-500">Hace 3 horas</p>
              </li>
              <li className="text-sm">
                <p className="font-medium text-gray-900">Se emitieron 50 certificados para Innovatech Solutions</p>
                <p className="text-gray-500">Hace 4 horas</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}