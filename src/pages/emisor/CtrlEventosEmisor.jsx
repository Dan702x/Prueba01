import React, { useState, useMemo, useCallback } from 'react';
import {
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowPathIcon // Importado para el botón Limpiar
} from '@heroicons/react/24/solid';

const StatusBadge = ({ isActive }) => {
  const baseClasses = "px-3 py-1 text-xs font-semibold rounded-full inline-block";
  if (isActive) return <span className={`${baseClasses} bg-green-100 text-green-800`}>Activo</span>;
  return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>Inactivo</span>;
};

const parseDate = (dateString) => {
    if (!dateString) return null;
    const parts = dateString.split('-');
    if (parts.length === 3) {
      return new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
    }
    const partsSlash = dateString.split('/');
    if (partsSlash.length === 3) {
      return new Date(`20${partsSlash[2]}`, partsSlash[1] - 1, partsSlash[0]);
    }
    return null;
};

export default function CtrlEventosEmisor() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [estadoFiltro, setEstadoFiltro] = useState('Todos');
  const [fechaInicioFiltro, setFechaInicioFiltro] = useState('');
  const [fechaFinFiltro, setFechaFinFiltro] = useState('');
  const [responsableFiltro, setResponsableFiltro] = useState('');

  const [eventos, setEventos] = useState([
    { id: 1, nombre: 'Curso de React Avanzado', responsable: 'Juan Diego Palomino', fechaInicio: '2025-08-01', fechaFin: '2025-10-31', estado: true },
    { id: 2, nombre: 'Taller de Figma para Devs.', responsable: 'Roy Silva Quesquen', fechaInicio: '2025-08-01', fechaFin: '2025-10-31', estado: false },
    { id: 3, nombre: 'Workshop: Agile Fundamentals', responsable: 'Ana Gómez', fechaInicio: '2025-09-15', fechaFin: '2025-09-16', estado: true },
    { id: 4, nombre: 'Seminario de Ciberseguridad', responsable: 'Carlos Ruiz', fechaInicio: '2025-10-05', fechaFin: '2025-10-05', estado: true },
    { id: 5, nombre: 'Bootcamp Full Stack (Ed. Verano)', responsable: 'Juan Diego Palomino', fechaInicio: '2026-01-10', fechaFin: '2026-03-30', estado: false },
    { id: 6, nombre: 'Charla: Introducción a IA', responsable: '', fechaInicio: '2025-11-20', fechaFin: '2025-11-20', estado: true },
    { id: 7, nombre: 'Curso de Node.js Intermedio', responsable: 'Ana Gómez', fechaInicio: '2025-12-01', fechaFin: '2025-12-15', estado: true },
  ]);

  const filteredItems = useMemo(() => {
    setCurrentPage(1);
    return eventos.filter(evento => {
        const searchMatch = evento.nombre.toLowerCase().includes(searchTerm.toLowerCase());
        
        const estadoMatch = estadoFiltro === 'Todos' ||
            (estadoFiltro === 'Activo' && evento.estado) ||
            (estadoFiltro === 'Inactivo' && !evento.estado);

        const responsableMatch = responsableFiltro === '' || 
          (evento.responsable && evento.responsable.toLowerCase().includes(responsableFiltro.toLowerCase()));

        const fechaInicioEvento = parseDate(evento.fechaInicio);
        const filtroInicio = fechaInicioFiltro ? new Date(fechaInicioFiltro) : null;
        const dateStartMatch = !filtroInicio || (fechaInicioEvento && fechaInicioEvento >= filtroInicio);

        const fechaFinEvento = parseDate(evento.fechaFin);
        const filtroFin = fechaFinFiltro ? new Date(fechaFinFiltro) : null;
        const dateEndMatch = !filtroFin || (fechaFinEvento && fechaFinEvento <= filtroFin);
        
        return searchMatch && estadoMatch && responsableMatch && dateStartMatch && dateEndMatch;
    });
  }, [eventos, searchTerm, estadoFiltro, responsableFiltro, fechaInicioFiltro, fechaFinFiltro]);

  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredItems, currentPage, itemsPerPage]);
  
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const goToNextPage = useCallback(() => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev)), [totalPages]);
  const goToPreviousPage = useCallback(() => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev)), []);

  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setEstadoFiltro('Todos');
    setFechaInicioFiltro('');
    setFechaFinFiltro('');
    setResponsableFiltro('');
    setCurrentPage(1);
  }, []);

  const handleFilterChange = (setter) => (event) => {
    setter(event.target.value);
  };

  const formatDateForDisplay = (dateString) => {
    const date = parseDate(dateString);
    if (!date) return 'N/A';
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = String(date.getUTCFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Control de Eventos</h1>

      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        {/* --- CAMBIO: Título H2 "Filtros" eliminado --- */}

        {/* --- CAMBIO: Layout del grid y col-spans actualizados --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-x-6 gap-y-4 items-end">
          
          <div className="col-span-1 md:col-span-1 lg:col-span-3">
            <label htmlFor="search-evento" className="block text-sm font-medium text-gray-700 mb-1">Evento</label>
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" id="search-evento" placeholder="Buscar por nombre..." value={searchTerm} onChange={handleFilterChange(setSearchTerm)}
                className="form-input block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="col-span-1 md:col-span-1 lg:col-span-3">
            <label htmlFor="responsable" className="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
            <input 
              type="text" 
              id="responsable" 
              placeholder="Buscar por responsable..."
              value={responsableFiltro} 
              onChange={handleFilterChange(setResponsableFiltro)}
              className="form-input block w-full border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 py-2 px-3"
            />
          </div>

          <div className="col-span-1 md:col-span-1 lg:col-span-2">
            <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select id="estado" value={estadoFiltro} onChange={handleFilterChange(setEstadoFiltro)}
              className="form-select block w-full border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 py-2 pl-3 pr-10">
              <option>Todos</option>
              <option>Activo</option>
              <option>Inactivo</option>
            </select>
          </div>

          <div className="col-span-1 md:col-span-1 lg:col-span-2">
            <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
            <input type="date" id="start-date" value={fechaInicioFiltro} onChange={handleFilterChange(setFechaInicioFiltro)} 
              className="form-input block w-full border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 py-1.5 px-3" />
          </div>

          <div className="col-span-1 md:col-span-1 lg:col-span-2">
            <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
            <input type="date" id="end-date" value={fechaFinFiltro} onChange={handleFilterChange(setFechaFinFiltro)} 
              className="form-input block w-full border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 py-1.5 px-3" />
          </div>
          {/* --- CAMBIO: Botón Limpiar ELIMINADO de aquí --- */}
        </div>
        
        {/* --- CAMBIO: Botón Limpiar movido aquí, en su propio div --- */}
        <div className="flex justify-end pt-6 mt-6 border-t border-gray-200">
           <button 
              onClick={handleClearFilters} 
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700"
            >
              <ArrowPathIcon className="h-5 w-5" />
              Limpiar
           </button>
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
                    <td className="px-6 py-4">{evento.responsable || 'N/A'}</td>
                    <td className="px-6 py-4">{formatDateForDisplay(evento.fechaInicio)} - {formatDateForDisplay(evento.fechaFin)}</td>
                    <td className="px-6 py-4"><StatusBadge isActive={evento.estado} /></td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" className="text-center py-10 px-6 text-gray-500">No se encontraron eventos con los filtros aplicados.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {filteredItems.length > 0 && totalPages > 1 && (
        <div className="flex justify-center items-center gap-4">
          <nav className="flex items-center gap-4" aria-label="Pagination">
            <button onClick={goToPreviousPage} disabled={currentPage === 1} className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"><ChevronLeftIcon className="h-5 w-5" /> Anterior</button>
            <span className="text-sm text-gray-700">Página {currentPage} de {totalPages}</span>
            <button onClick={goToNextPage} disabled={currentPage === totalPages} className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Siguiente <ChevronRightIcon className="h-5 w-5" /></button>
          </nav>
        </div>
      )}
    </div>
  );
}