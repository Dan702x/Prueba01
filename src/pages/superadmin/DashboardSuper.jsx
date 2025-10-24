import React from 'react';
import {
  FunnelIcon,
  ArrowDownTrayIcon,
  ChevronDownIcon,
  CalendarDaysIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/solid';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const KpiCard = ({ title, value, valueColor = 'text-gray-900' }) => (
  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
    <h3 className="text-sm font-medium text-gray-500 truncate">{title}</h3>
    <p className={`mt-1 text-4xl font-semibold ${valueColor}`}>{value}</p>
  </div>
);

const emisionesData = {
  labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  datasets: [
    {
      label: 'Emisiones',
      data: [65, 59, 80, 81, 56, 55, 40, 60, 75, 90, 85, 102],
      backgroundColor: '#1E3A8A',
      borderRadius: 4,
    },
  ],
};

const topEmpresasData = {
  labels: ['Hackthevperu S.A.C', 'Innovatech Solutions', 'Empresa C', 'Empresa D', 'Empresa E'],
  datasets: [
    {
      label: '# de Emisiones',
      data: [420, 310, 280, 215, 180],
      backgroundColor: '#2563EB',
      borderRadius: 4,
    },
  ],
};

const distribucionData = {
  labels: ['Válidos', 'Anulados'],
  datasets: [
    {
      data: [2130, 20],
      backgroundColor: ['#16A34A', '#DC2626'],
      borderColor: ['#F9FAFB', '#F9FAFB'],
      borderWidth: 4,
    },
  ],
};

const empresasRecientes = [
  { 
    id: 1, 
    nombre: 'Innovatech Solutions', 
    tiempo: 'Hace 1 hora' 
  },
  { 
    id: 2, 
    nombre: 'Constructora XYZ', 
    tiempo: 'Hace 3 horas' 
  },
  { 
    id: 3, 
    nombre: 'Estudio Jurídico R&R', 
    tiempo: 'Hace 1 día' 
  },
    { 
    id: 4, 
    nombre: 'Market S.A.C', 
    tiempo: 'Hace 2 días' 
  },
];


export default function DashboardSuper() {
  
  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
      
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Inicio/Reportes
      </h1>

      {/* --- BARRA DE FILTROS (MODIFICADA) --- */}
      {/* Usamos 'lg:flex-row' para que en pantallas grandes sí estén en fila,
          pero a partir de 'md' los botones de filtrado y exportar se apilen */}
      <div className="flex flex-col lg:flex-row lg:items-end gap-4 mb-6 p-4 bg-white rounded-xl shadow-sm border border-gray-200">
        
        {/* Fecha desde */}
        <div className="w-full md:w-auto">
          <label htmlFor="fechaDesde" className="block text-sm font-medium text-gray-700 mb-1">
            Fecha desde:
          </label>
          <div className="relative">
            <input 
              type="date" 
              id="fechaDesde" 
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
              defaultValue="2023-01-01"
            />
            <CalendarDaysIcon className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Fecha hasta */}
        <div className="w-full md:w-auto">
          <label htmlFor="fechaHasta" className="block text-sm font-medium text-gray-700 mb-1">
            Fecha hasta:
          </label>
          <div className="relative">
            <input 
              type="date" 
              id="fechaHasta"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
              defaultValue="2023-12-31"
            />
            <CalendarDaysIcon className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* CONTENEDOR PARA LOS BOTONES FILTRAR Y EXPORTAR (NUEVA ESTRUCTURA) */}
        {/* En pantallas md y lg, este contenedor se volverá una columna, apilando los botones */}
        {/* En pantallas lg y más grandes, 'lg:ml-auto' empujará este grupo a la derecha */}
        <div className="w-full flex flex-col gap-3 md:w-auto lg:ml-auto lg:flex-row lg:items-center"> {/* Agregamos lg:flex-row y lg:items-center para que en desktop vuelvan a estar en fila */}
          {/* Botón Filtrar */}
          <div className="w-full lg:w-auto"> {/* Ocupa todo el ancho en móvil/md, se ajusta en lg */}
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#1E3A8A] text-white font-semibold rounded-lg shadow-md hover:bg-[#1C3274] transition-colors duration-200">
              <FunnelIcon className="h-5 w-5" />
              Filtrar
            </button>
          </div>

          {/* Botón Exportar */}
          <div className="w-full lg:w-auto"> {/* Ocupa todo el ancho en móvil/md, se ajusta en lg */}
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 transition-colors duration-200">
              <ArrowDownTrayIcon className="h-5 w-5" />
              Exportar
              <ChevronDownIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* --- Grid de KPIs (sin cambios) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5 mb-6">
        <KpiCard title="Total Empresas Activas" value="142" />
        <KpiCard title="Total Certificados Emitidos" value="2,150" />
        <KpiCard title="Certificados Válidos" value="2,130" valueColor="text-green-600" />
        <KpiCard title="Certificados Anulados" value="20" valueColor="text-red-600" />
        <KpiCard title="Nuevas Empresas (30d)" value="12" />
      </div>

      {/* --- Grid de Contenido Principal (sin cambios) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Emisiones en el Periodo Seleccionado</h3>
            <div className="h-80 md:h-96">
              <Bar 
                data={emisionesData} 
                options={{ 
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } } 
                }} 
              />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 5 Empresas con más Emisiones</h3>
            <div className="h-80 md:h-96">
              <Bar 
                data={topEmpresasData} 
                options={{ 
                  indexAxis: 'y',
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } } 
                }} 
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 flex flex-col gap-6">

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Estado</h3>
            <div className="h-72 flex justify-center items-center">
              <Doughnut 
                data={distribucionData} 
                options={{ 
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { 
                    legend: { 
                      position: 'bottom',
                    } 
                  } 
                }} 
              />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Empresas Recién Registradas</h3>
            <ul className="divide-y divide-gray-100">
              {empresasRecientes.map((item) => (
                <li key={item.id} className="flex gap-3 py-3">
                  <div className="flex-shrink-0">
                    <BuildingOfficeIcon className="h-6 w-6 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">
                      {item.nombre}
                    </p>
                    <p className="text-xs text-gray-400">{item.tiempo}</p>
                  </div>
                </li>
              ))}
            </ul>
             <button className="w-full mt-4 text-sm font-medium text-blue-700 hover:text-blue-800">
              Ver todas las empresas
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}