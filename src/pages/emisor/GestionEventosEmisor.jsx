import React, { useState, useMemo, useCallback } from 'react';
import {
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/solid';

const StatusBadge = ({ isActive }) => {
  const baseClasses = "px-3 py-1 text-xs font-semibold rounded-full inline-block";
  if (isActive) return <span className={`${baseClasses} bg-green-100 text-green-800`}>Activo</span>;
  return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>Inactivo</span>;
};

// --- Helper para convertir fecha DD/MM/YY a un objeto Date comparable ---
const parseDate = (dateString) => {
    if (!dateString) return null;
    const parts = dateString.split('/');
    // Asume formato DD/MM/YY y lo convierte a YYYY-MM-DD para el objeto Date
    return new Date(`20${parts[2]}`, parts[1] - 1, parts[0]);
};

export default function GestionEventosEmisor() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // --- Estados para los filtros ---
  const [estadoFiltro, setEstadoFiltro] = useState('Todos');
  const [fechaInicioFiltro, setFechaInicioFiltro] = useState('');
  const [fechaFinFiltro, setFechaFinFiltro] = useState('');

  const [eventos, setEventos] = useState([
    { id: 1, nombre: 'Curso de React Avanzado', responsable: 'Juan Diego', fechaInicio: '01/08/25', fechaFin: '31/10/25', estado: true },
    { id: 2, nombre: 'Taller de Figma para Devs.', responsable: 'Roy Silva', fechaInicio: '01/08/25', fechaFin: '31/10/25', estado: false },
    { id: 3, nombre: 'Workshop: Agile Fundamentals', responsable: 'Ana Gómez', fechaInicio: '15/09/25', fechaFin: '16/09/25', estado: true },
    { id: 4, nombre: 'Seminario de Ciberseguridad', responsable: 'Carlos Ruiz', fechaInicio: '05/10/25', fechaFin: '05/10/25', estado: true },
    { id: 5, nombre: 'Bootcamp Full Stack (Ed. Verano)', responsable: 'Juan Diego', fechaInicio: '10/01/26', fechaFin: '30/03/26', estado: false },
    { id: 6, nombre: 'Charla: Introducción a IA', responsable: 'Roy Silva', fechaInicio: '20/11/25', fechaFin: '20/11/25', estado: true },
    { id: 7, nombre: 'Curso de Node.js Intermedio', responsable: 'Ana Gómez', fechaInicio: '01/12/25', fechaFin: '15/12/25', estado: true },
    { id: 8, nombre: 'Design Sprint Week', responsable: 'Carlos Ruiz', fechaInicio: '10/02/26', fechaFin: '14/02/26', estado: true },
    { id: 9, nombre: 'Taller de Pruebas Unitarias', responsable: 'Juan Diego', fechaInicio: '01/03/26', fechaFin: '02/03/26', estado: false },
    { id: 10, nombre: 'Conferencia Anual de Tecnología', responsable: 'Roy Silva', fechaInicio: '05/05/26', fechaFin: '07/05/26', estado: true },
    { id: 11, nombre: 'Curso de Marketing Digital', responsable: 'Ana Gómez', fechaInicio: '15/06/26', fechaFin: '30/06/26', estado: true },
  ]);

  // --- Lógica de filtrado actualizada ---
  const filteredItems = useMemo(() => {
    setCurrentPage(1); // Resetea la página con cada cambio de filtro
    return eventos.filter(evento => {
        const searchMatch = evento.nombre.toLowerCase().includes(searchTerm.toLowerCase());
        
        const estadoMatch = estadoFiltro === 'Todos' ||
            (estadoFiltro === 'Activo' && evento.estado) ||
            (estadoFiltro === 'Inactivo' && !evento.estado);

        const fechaInicioEvento = parseDate(evento.fechaInicio);
        const filtroInicio = fechaInicioFiltro ? new Date(fechaInicioFiltro) : null;
        const dateStartMatch = !filtroInicio || fechaInicioEvento >= filtroInicio;

        const fechaFinEvento = parseDate(evento.fechaFin);
        const filtroFin = fechaFinFiltro ? new Date(fechaFinFiltro) : null;
        const dateEndMatch = !filtroFin || fechaFinEvento <= filtroFin;
        
        return searchMatch && estadoMatch && dateStartMatch && dateEndMatch;
    });
  }, [eventos, searchTerm, estadoFiltro, fechaInicioFiltro, fechaFinFiltro]);

  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredItems, currentPage, itemsPerPage]);
  
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const goToNextPage = useCallback(() => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev)), [totalPages]);
  const goToPreviousPage = useCallback(() => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev)), []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Gestión de Eventos y Cursos</h1>

      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Filtros</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
          
          {/* Campo 1: Nombre del Evento */}
          <div className="col-span-1 lg:col-span-4">
            <label htmlFor="search-evento" className="block text-sm font-medium text-gray-700 mb-1">Evento</label>
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                id="search-evento"
                placeholder="Buscar por nombre o código"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Campo 2: Estado */}
          <div className="col-span-1 sm:col-span-1 lg:col-span-3">
            <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select
              id="estado"
              value={estadoFiltro}
              onChange={(e) => setEstadoFiltro(e.target.value)}
              className="form-select block w-full border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 py-2 pl-3 pr-10"
            >
              <option>Todos</option>
              <option>Activo</option>
              <option>Inactivo</option>
            </select>
          </div>

          {/* Campo 3: Rango de fechas */}
          <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">Rango de Fechas</label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <input 
                type="date"
                value={fechaInicioFiltro}
                onChange={(e) => setFechaInicioFiltro(e.target.value)} 
                className="form-input block w-full border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 py-1.5 px-3" />
              <span className="hidden sm:block">-</span>
              <input 
                type="date"
                value={fechaFinFiltro}
                onChange={(e) => setFechaFinFiltro(e.target.value)} 
                className="form-input block w-full border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 py-1.5 px-3" />
            </div>
          </div>
          
          {/* Botón Filtrar ELIMINADO */}

        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden flex flex-col min-h-[400px]">
        <div className="overflow-x-auto flex-grow">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0 z-10">
              <tr>
                <th scope="col" className="px-6 py-4">Nombre del Evento</th>
                <th scope="col" className="px-6 py-4">Responsable</th>
                <th scope="col" className="px-6 py-4">Periodo</th>
                <th scope="col" className="px-6 py-4">Estado</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((evento) => (
                  <tr key={evento.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{evento.nombre}</td>
                    <td className="px-6 py-4">{evento.responsable}</td>
                    <td className="px-6 py-4">{evento.fechaInicio} - {evento.fechaFin}</td>
                    <td className="px-6 py-4"><StatusBadge isActive={evento.estado} /></td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" className="text-center py-10 px-6 text-gray-500">No se encontraron eventos con los filtros aplicados.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {filteredItems.length > 0 && totalPages > 1 && (
          <div className="flex justify-center items-center p-4 bg-white border-t border-gray-200">
            <nav className="flex items-center gap-4" aria-label="Pagination">
              <button onClick={goToPreviousPage} disabled={currentPage === 1} className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"><ChevronLeftIcon className="h-5 w-5" /> Anterior</button>
              <span className="text-sm text-gray-700">Página {currentPage} de {totalPages}</span>
              <button onClick={goToNextPage} disabled={currentPage === totalPages} className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Siguiente <ChevronRightIcon className="h-5 w-5" /></button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}