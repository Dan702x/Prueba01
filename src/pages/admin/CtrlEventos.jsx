import React, { useState, useMemo, useCallback } from 'react';
import {
  PlusIcon,
  PencilSquareIcon,
  NoSymbolIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/solid';

import ModalBase from '../../components/common/ModalBase';
import FormularioEvento from './FormularioEvento';
import ModalConfirmacion from '../../components/common/ModalConfirmacion';

const StatusBadge = ({ isActive }) => {
  const baseClasses = "px-3 py-1 text-xs font-semibold rounded-full inline-block";
  if (isActive) return <span className={`${baseClasses} bg-green-100 text-green-800`}>Activo</span>;
  return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>Inactivo</span>;
};

export default function GestionEventos() {
  const [modalAbierto, setModalAbierto] = useState(null);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // --- 1. NUEVO ESTADO PARA EL FILTRO DE RESPONSABLE ---
  const [responsableFilter, setResponsableFilter] = useState('Todos');

  const [eventos, setEventos] = useState([
    { id: 1, nombre: 'Curso de React Avanzado', responsable: 'Juan Diego', fechaInicio: '2025-08-01', fechaFin: '2025-10-31', estado: true },
    { id: 2, nombre: 'Taller de Figma para Devs.', responsable: 'Roy Silva', fechaInicio: '2025-08-01', fechaFin: '2025-10-31', estado: false },
    { id: 3, nombre: 'Workshop: Agile Fundamentals', responsable: 'Ana Gómez', fechaInicio: '2025-09-15', fechaFin: '2025-09-16', estado: true },
    { id: 4, nombre: 'Seminario de Ciberseguridad', responsable: 'Carlos Ruiz', fechaInicio: '2025-10-05', fechaFin: '2025-10-05', estado: true },
    { id: 5, nombre: 'Bootcamp Full Stack (Ed. Verano)', responsable: 'Juan Diego', fechaInicio: '2026-01-10', fechaFin: '2026-03-30', estado: false },
    { id: 6, nombre: 'Charla: Introducción a IA', responsable: 'Roy Silva', fechaInicio: '2025-11-20', fechaFin: '2025-11-20', estado: true },
    { id: 7, nombre: 'Curso de Node.js Intermedio', responsable: 'Ana Gómez', fechaInicio: '2025-12-01', fechaFin: '2025-12-15', estado: true },
    { id: 8, nombre: 'Design Sprint Week', responsable: 'Carlos Ruiz', fechaInicio: '2026-02-10', fechaFin: '2026-02-14', estado: true },
    { id: 9, nombre: 'Taller de Pruebas Unitarias', responsable: 'Juan Diego', fechaInicio: '2026-03-01', fechaFin: '2026-03-02', estado: false },
    { id: 10, nombre: 'Conferencia Anual de Tecnología', responsable: 'Roy Silva', fechaInicio: '2026-05-05', fechaFin: '2026-05-07', estado: true },
    { id: 11, nombre: 'Curso de Marketing Digital', responsable: 'Ana Gómez', fechaInicio: '2026-06-15', fechaFin: '2026-06-30', estado: true },
  ]);

  // --- 2. OBTENER LISTA ÚNICA DE RESPONSABLES ---
  const responsablesUnicos = useMemo(() => {
    const responsables = eventos.map(e => e.responsable);
    return ['Todos', ...new Set(responsables)];
  }, [eventos]);

  const filteredItems = useMemo(() => {
    const parseDateUTC = (dateString) => {
        if (!dateString) return null;
        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(Date.UTC(year, month - 1, day));
    };

    return eventos.filter(evento => {
      const searchTermMatch = evento.nombre.toLowerCase().includes(searchTerm.toLowerCase());
      const statusMatch = statusFilter === 'Todos' || (statusFilter === 'Activo' && evento.estado) || (statusFilter === 'Inactivo' && !evento.estado);
      // --- 3. AÑADIR LÓGICA DEL NUEVO FILTRO ---
      const responsableMatch = responsableFilter === 'Todos' || evento.responsable === responsableFilter;

      let dateMatch = true;
      const eventStartDate = parseDateUTC(evento.fechaInicio);
      const eventEndDate = parseDateUTC(evento.fechaFin);
      const filterStartDate = parseDateUTC(startDate);
      const filterEndDate = parseDateUTC(endDate);

      if (filterStartDate && eventStartDate < filterStartDate) {
        dateMatch = false;
      }
      if (filterEndDate && eventEndDate > filterEndDate) {
        dateMatch = false;
      }

      return searchTermMatch && statusMatch && responsableMatch && dateMatch;
    });
  }, [eventos, searchTerm, statusFilter, startDate, endDate, responsableFilter]);
  
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredItems, currentPage, itemsPerPage]);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const goToNextPage = useCallback(() => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev)), [totalPages]);
  const goToPreviousPage = useCallback(() => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev)), []);
  
  const handleFilterChange = useCallback((setter) => (event) => {
    setter(event.target.value);
    setCurrentPage(1);
  }, []);

  const handleCloseModal = useCallback(() => { setModalAbierto(null); setEventoSeleccionado(null); }, []);
  const handleOpenCreateModal = useCallback(() => { setEventoSeleccionado(null); setModalAbierto('crear'); }, []);
  const handleOpenEditModal = useCallback((evento) => { setEventoSeleccionado(evento); setModalAbierto('editar'); }, []);
  const handleOpenDesactivarModal = useCallback((evento) => { setEventoSeleccionado(evento); setModalAbierto('desactivar'); }, []);
  const handleOpenActivarModal = useCallback((evento) => { setEventoSeleccionado(evento); setModalAbierto('activar'); }, []);

  const handleSaveEvento = useCallback((datosFormulario) => {
    setEventos(prevEventos => {
      if (eventoSeleccionado) {
        return prevEventos.map(e => e.id === eventoSeleccionado.id ? { ...e, ...datosFormulario } : e);
      } else {
        const nuevoEvento = { id: Date.now(), ...datosFormulario, estado: true };
        return [nuevoEvento, ...prevEventos];
      }
    });
    handleCloseModal();
  }, [eventoSeleccionado, handleCloseModal]);

  const handleConfirmDesactivar = useCallback(() => {
    setEventos(prevEventos => prevEventos.map(e => e.id === eventoSeleccionado.id ? { ...e, estado: false } : e));
    handleCloseModal();
  }, [eventoSeleccionado, handleCloseModal]);

  const handleConfirmActivar = useCallback(() => {
    setEventos(prevEventos => prevEventos.map(e => e.id === eventoSeleccionado.id ? { ...e, estado: true } : e));
    handleCloseModal();
  }, [eventoSeleccionado, handleCloseModal]);
  
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00');
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Control de Eventos y Cursos</h1>

      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Filtros</h2>

        {/* --- 4. MODIFICAR EL GRID DE FILTROS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-end">

          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <label htmlFor="search-evento" className="block text-sm font-medium text-gray-700 mb-1">Evento</label>
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" id="search-evento" placeholder="Buscar por nombre..." value={searchTerm} onChange={handleFilterChange(setSearchTerm)}
                className="form-input block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          {/* Filtro de Responsable */}
          <div className="col-span-1 md:col-span-1 lg:col-span-3">
            <label htmlFor="responsable-filter" className="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
            <select id="responsable-filter" value={responsableFilter} onChange={handleFilterChange(setResponsableFilter)}
              className="form-select block w-full border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 py-2 pl-3 pr-10">
              {responsablesUnicos.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>

          {/* Filtro de Estado */}
          <div className="col-span-1 md:col-span-1 lg:col-span-2">
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select id="status-filter" value={statusFilter} onChange={handleFilterChange(setStatusFilter)}
              className="form-select block w-full border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 py-2 pl-3 pr-10">
              <option>Todos</option><option>Activo</option><option>Inactivo</option>
            </select>
          </div>
          
          <div className="col-span-1 md:col-span-2 lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
             <div>
                <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
                <input type="date" id="start-date" value={startDate} onChange={handleFilterChange(setStartDate)} className="form-input block w-full border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 py-1.5 px-3" />
             </div>
             <div>
                <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
                <input type="date" id="end-date" value={endDate} onChange={handleFilterChange(setEndDate)} className="form-input block w-full border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 py-1.5 px-3" />
             </div>
          </div>
        </div>


        <div className="flex flex-wrap justify-end gap-4 pt-6 mt-6 border-t border-gray-200">
          <button onClick={handleOpenCreateModal} className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600">
            <PlusIcon className="h-5 w-5" />Crear Evento
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden flex flex-col min-h-[400px]">
        <div className="overflow-x-auto flex-grow">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0 z-10">
              <tr><th scope="col" className="px-6 py-4">Nombre del Evento</th><th scope="col" className="px-6 py-4">Responsable</th><th scope="col" className="px-6 py-4">Periodo</th><th scope="col" className="px-6 py-4">Estado</th><th scope="col" className="px-6 py-4 text-center">Acciones</th></tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((evento) => (
                  <tr key={evento.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{evento.nombre}</td>
                    <td className="px-6 py-4">{evento.responsable}</td>
                    <td className="px-6 py-4">{formatDateForDisplay(evento.fechaInicio)} - {formatDateForDisplay(evento.fechaFin)}</td>
                    <td className="px-6 py-4"><StatusBadge isActive={evento.estado} /></td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center items-center gap-3">
                        <button onClick={() => handleOpenEditModal(evento)} title="Editar" className="text-yellow-500 hover:text-yellow-700"><PencilSquareIcon className="h-5 w-5" /></button>
                        {evento.estado
                          ? (<button onClick={() => handleOpenDesactivarModal(evento)} title="Desactivar" className="text-red-500 hover:text-red-700"><NoSymbolIcon className="h-5 w-5" /></button>)
                          : (<button onClick={() => handleOpenActivarModal(evento)} title="Activar" className="text-green-500 hover:text-green-700"><ArrowPathIcon className="h-5 w-5" /></button>)
                        }
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" className="text-center py-10 px-6 text-gray-500">{searchTerm ? `No hay eventos que coincidan con "${searchTerm}".` : "No hay eventos para mostrar."}</td></tr>
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

      <ModalBase isOpen={modalAbierto === 'crear' || modalAbierto === 'editar'} onClose={handleCloseModal} maxWidth="md:max-w-2xl"><FormularioEvento evento={eventoSeleccionado} onClose={handleCloseModal} onSave={handleSaveEvento} /></ModalBase>
      <ModalBase isOpen={modalAbierto === 'desactivar'} onClose={handleCloseModal} maxWidth="md:max-w-md"><ModalConfirmacion variant="warning" title="¿Desactivar Evento?" message="Estás a punto de desactivar este evento. Los certificados asociados no se verán afectados." confirmText="Sí, desactivar" onConfirm={handleConfirmDesactivar} onClose={handleCloseModal} /></ModalBase>
      <ModalBase isOpen={modalAbierto === 'activar'} onClose={handleCloseModal} maxWidth="md:max-w-md"><ModalConfirmacion variant="success" title="¿Activar Evento?" message="Estás a punto de reactivar este evento." confirmText="Sí, activar" onConfirm={handleConfirmActivar} onClose={handleCloseModal} /></ModalBase>
    </div>
  );
}