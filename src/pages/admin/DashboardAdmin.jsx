import React from 'react';
import { 
  FunnelIcon, 
  ArrowDownTrayIcon, 
  ChevronDownIcon, 
  CalendarDaysIcon,
  CheckCircleIcon,
  PlusCircleIcon
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

// --- Componente KpiCard (Reutilizable) ---
// Un pequeño componente para no repetir código de las tarjetas
const KpiCard = ({ title, value, valueColor = 'text-gray-900' }) => (
  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
    <h3 className="text-sm font-medium text-gray-500 truncate">{title}</h3>
    <p className={`mt-1 text-4xl font-semibold ${valueColor}`}>{value}</p>
  </div>
);

// --- Datos de Ejemplo para los Gráficos ---
// Reemplaza esto con los datos de tu API

const emisionesData = {
  labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  datasets: [
    {
      label: 'Emisiones',
      data: [65, 59, 80, 81, 56, 55, 40, 60, 75, 90, 85, 102],
      backgroundColor: '#1E3A8A', // El azul de tu marca
      borderRadius: 4,
    },
  ],
};

const topEmpresasData = {
  labels: ['Hackthevperu S.A.C', 'Innovatech Solutions', 'Empresa C', 'Empresa D', 'Empresa E'],
  datasets: [
    {
      label: '# de Emisiones',
      data: [850, 390, 300, 250, 120],
      backgroundColor: '#2563EB',
      borderRadius: 4,
    },
  ],
};

const distribucionData = {
  labels: ['Válidos', 'Anulados'],
  datasets: [
    {
      data: [1235, 15],
      backgroundColor: [
        '#16A34A',
        '#DC2626',
      ],
      borderColor: [
        '#F9FAFB',
        '#F9FAFB',
      ],
      borderWidth: 4,
    },
  ],
};

const actividadReciente = [
  { 
    id: 1, 
    tipo: 'empresa', 
    texto: 'Nueva empresa registrada:', 
    valor: 'Innovatech Solutions', 
    tiempo: 'Hace 1 hora' 
  },
  { 
    id: 2, 
    tipo: 'emision', 
    texto: 'Se emitieron 50 certificados para', 
    valor: 'Hackthevperu S.A.C', 
    tiempo: 'Hace 2 horas' 
  },
  { 
    id: 3, 
    tipo: 'plantilla', 
    texto: 'Nueva plantilla creada:', 
    valor: 'Certificado de Asistencia - React Conf', 
    tiempo: 'Hace 5 horas' 
  },
];


export default function DashboardAdmin() {
  
  return (
    // --- Contenedor Principal ---
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
      
      {/* --- Título --- */}
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Inicio/Reportes
      </h1>

      {/* --- Barra de Filtros --- */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6 p-4 bg-white rounded-xl shadow-sm border border-gray-200">
        
        {/* Filtro Fecha Desde */}
        <div className="w-full md:w-auto">
          <label htmlFor="fechaDesde" className="block text-sm font-medium text-gray-700 mb-1">
            Fecha desde:
          </label>
          <div className="relative">
            <input 
              type="date" 
              id="fechaDesde" 
              className="form-input block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              defaultValue="2023-01-01" // Valor de ejemplo
            />
            <CalendarDaysIcon className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Filtro Fecha Hasta */}
        <div className="w-full md:w-auto">
          <label htmlFor="fechaHasta" className="block text-sm font-medium text-gray-700 mb-1">
            Fecha hasta:
          </label>
          <div className="relative">
            <input 
              type="date" 
              id="fechaHasta"
              className="form-input block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              defaultValue="2023-12-31" // Valor de ejemplo
            />
            <CalendarDaysIcon className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Botón Filtrar */}
        <div className="w-full md:w-auto md:mt-6">
          <button className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-[#1E3A8A] text-white font-semibold rounded-lg shadow-md hover:bg-[#1C3274] transition-colors duration-200">
            <FunnelIcon className="h-5 w-5" />
            Filtrar
          </button>
        </div>

        {/* Botón Exportar */}
        <div className="w-full md:w-auto md:mt-6 md:ml-auto">
          <button className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 transition-colors duration-200">
            <ArrowDownTrayIcon className="h-5 w-5" />
            Exportar
            <ChevronDownIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* --- Grid de KPIs --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5 mb-6">
        <KpiCard title="Total Empresas Activas" value="2" />
        <KpiCard title="Total Certificados Emitidos" value="1,250" />
        <KpiCard title="Certificados Válidos" value="1,235" valueColor="text-green-600" />
        <KpiCard title="Certificados Anulados" value="15" valueColor="text-red-600" />
        <KpiCard title="Practicantes Activos" value="45" />
      </div>

      {/* --- Grid de Contenido Principal (Gráficos y Actividad) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* --- Columna Izquierda (2/3) --- */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Gráfico de Emisiones */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Emisiones en el Periodo Seleccionado</h3>
            <div className="h-80"> {/* Contenedor con altura fija para el gráfico */}
              <Bar 
                data={emisionesData} 
                options={{ 
                  maintainAspectRatio: false, // Permite que el gráfico llene el div
                  plugins: { legend: { display: false } } 
                }} 
              />
            </div>
          </div>
          
          {/* Top 5 Empresas */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 5 Empresas con más Emisiones</h3>
            <div className="h-80"> {/* Contenedor con altura fija */}
              <Bar 
                data={topEmpresasData} 
                options={{ 
                  indexAxis: 'y',
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } } 
                }} 
              />
            </div>
          </div>
        </div>

        {/* --- Columna Derecha (1/3) --- */}
        <div className="lg:col-span-1 flex flex-col gap-6">

          {/* Distribución por Estado */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Estado</h3>
            <div className="h-64 flex justify-center items-center"> {/* Contenedor con altura */}
              <Doughnut 
                data={distribucionData} 
                options={{ 
                  maintainAspectRatio: false,
                  plugins: { 
                    legend: { 
                      position: 'right',
                    } 
                  } 
                }} 
              />
            </div>
          </div>
          
          {/* Actividad Reciente */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente del Sistema</h3>
            <ul>
              {actividadReciente.map((item) => (
                <li key={item.id} className="flex gap-3 py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex-shrink-0">
                    {item.tipo === 'empresa' && <PlusCircleIcon className="h-6 w-6 text-blue-500" />}
                    {item.tipo === 'emision' && <CheckCircleIcon className="h-6 w-6 text-green-500" />}
                    {item.tipo === 'plantilla' && <PlusCircleIcon className="h-6 w-6 text-indigo-500" />}
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">
                      {item.texto} <span className="font-semibold">{item.valor}</span>
                    </p>
                    <p className="text-xs text-gray-400">{item.tiempo}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
}