import React from 'react';
import { ArrowDownTrayIcon, FunnelIcon } from '@heroicons/react/24/solid'; // Íconos para botones

// Componente para las 4 tarjetas de KPI
function KpiCard({ title, value, valueColor = 'text-gray-900' }) {
  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
      <p className="text-sm text-gray-600">{title}</p>
      <p className={`text-3xl font-bold ${valueColor}`}>{value}</p>
    </div>
  );
}

// Componente para la lista de "Certificados Recientes"
function CertificadoReciente({ nombre, fecha }) {
  return (
    <div className="flex justify-between items-center py-2 border-b last:border-b-0">
      <span className="text-sm font-medium text-gray-700">{nombre}</span>
      <span className="text-sm text-gray-500">{fecha}</span>
    </div>
  );
}

export default function Inicio() {
  return (
    // --- ¡NUEVO! Contenedor blanco principal con sombra ---
    <div className="bg-white p-6 rounded-2xl shadow-lg space-y-6">
      
      <h1 className="text-3xl font-bold text-gray-800">Inicio / Reportes</h1>

      {/* --- SECCIÓN DE FILTROS (Sin "Empresa") --- */}
      <div className="flex flex-wrap items-end gap-4">
        {/* Filtro Fecha Desde */}
        <div>
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
        <div>
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

        {/* Botón Filtrar */}
        <button className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 shadow-sm flex items-center gap-2">
          <FunnelIcon className="w-5 h-5" />
          Filtrar
        </button>
        
        {/* Botón Exportar (nuevo estilo) */}
        <button className="bg-gray-100 text-gray-700 px-5 py-2 rounded-md border border-gray-300 hover:bg-gray-200 shadow-sm flex items-center gap-2 ml-auto">
          <ArrowDownTrayIcon className="w-5 h-5" />
          Exportar
        </button>
      </div>

      {/* --- SECCIÓN DE KPIs (4 TARJETAS) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Total Certificados Emitidos" value="1,250" />
        <KpiCard title="Certificados Válidos" value="1,235" valueColor="text-green-500" />
        <KpiCard title="Certificados Anulados" value="15" valueColor="text-red-500" />
        <KpiCard title="Practicantes Activos" value="45" />
      </div>

      {/* --- SECCIÓN DE GRÁFICOS  --- */}
      <div>
        {/* 1. Emisiones en el Periodo (Full-width) */}
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-sm min-h-[300px] mb-6">
          <h2 className="font-semibold text-gray-800 mb-2">Emisiones en el Periodo Seleccionado</h2>
          <div className="flex items-center justify-center h-full text-gray-500">
            [ Gráfico de Barras: Emisiones por Mes ]
          </div>
        </div>

        {/* 2. Dos columnas (Top 5 y Recientes) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Columna Izquierda: Top 5 Áreas */}
          <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-sm">
            <h2 className="font-semibold text-gray-800 mb-4">Top 5 Áreas con más Emisiones</h2>
            <div className="space-y-4">
              {/* Ejemplo de barra */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-blue-700">Desarrollo de Software</span>
                  <span>20</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
              {/* Ejemplo de barra 2 */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-blue-700">Soporte de TI</span>
                  <span>15</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Certificados Recientes */}
          <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-sm">
            <h2 className="font-semibold text-gray-800 mb-4">Certificados Recientes</h2>
            <div className="space-y-2">
              <CertificadoReciente nombre="Carlos López" fecha="01/10/25" />
              <CertificadoReciente nombre="Carlos López" fecha="30/09/25" />
              <CertificadoReciente nombre="Carlos López" fecha="28/09/25" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}