import React, { useState, useMemo, useCallback } from 'react';
import {
  PlusIcon,
  PencilIcon, // <-- CAMBIO DE ICONO
  ArrowPathIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TrashIcon, 
  EyeIcon, 
  EyeSlashIcon 
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
  const [responsableFilter, setResponsableFilter] = useState('');

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
    const parseDateUTC = (dateString) => {
        if (!dateString) return null;
        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(Date.UTC(year, month - 1, day));
    };

    return eventos.filter(evento => {
      const searchTermMatch = evento.nombre.toLowerCase().includes(searchTerm.toLowerCase());
      const statusMatch = statusFilter === 'Todos' || (statusFilter === 'Activo' && evento.estado) || (statusFilter === 'Inactivo' && !evento.estado);
      const responsableMatch = responsableFilter === '' || 
        (evento.responsable && evento.responsable.toLowerCase().includes(responsableFilter.toLowerCase()));

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

  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setStatusFilter('Todos');
    setStartDate('');
    setEndDate('');
    setResponsableFilter('');
    setCurrentPage(1);
  }, []);

  const handleCloseModal = useCallback(() => { setModalAbierto(null); setEventoSeleccionado(null); }, []);
  const handleOpenCreateModal = useCallback(() => { setEventoSeleccionado(null); setModalAbierto('crear'); }, []);
  const handleOpenEditModal = useCallback((evento) => { setEventoSeleccionado(evento); setModalAbierto('editar'); }, []);
  const handleOpenDesactivarModal = useCallback((evento) => { setEventoSeleccionado(evento); setModalAbierto('desactivar'); }, []);
  const handleOpenActivarModal = useCallback((evento) => { setEventoSeleccionado(evento); setModalAbierto('activar'); }, []);
  const handleOpenEliminarModal = useCallback((evento) => { setEventoSeleccionado(evento); setModalAbierto('eliminar'); }, []);
  
  const handleConfirmEliminar = useCallback(() => {
    setEventos(prevEventos => prevEventos.filter(e => e.id !== eventoSeleccionado.id));
    handleCloseModal();
  }, [eventoSeleccionado, handleCloseModal]);

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
      <h1 className="text-3xl font-bold text-gray-800">Control de Eventos</h1>

      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        {/* --- CAMBIO: Título H2 "Filtros" eliminado --- */}

        {/* --- CAMBIO: Layout del grid y col-spans actualizados para 5 filtros --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-x-6 gap-y-4 items-end">

          {/* Fila 1 (en LG) */}
          <div className="col-span-1 md:col-span-1 lg:col-span-3">
            <label htmlFor="search-evento" className="block text-sm font-medium text-gray-700 mb-1">Evento</label>
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" id="search-evento" placeholder="Buscar por nombre..." value={searchTerm} onChange={handleFilterChange(setSearchTerm)}
                className="form-input block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="col-span-1 md:col-span-1 lg:col-span-3">
            <label htmlFor="responsable-filter" className="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
            <input 
              type="text" 
              id="responsable-filter" 
              placeholder="Buscar por responsable..." 
              value={responsableFilter} 
              onChange={handleFilterChange(setResponsableFilter)}
              className="form-input block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="col-span-1 md:col-span-1 lg:col-span-2">
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select id="status-filter" value={statusFilter} onChange={handleFilterChange(setStatusFilter)}
              className="form-select block w-full border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 py-2 pl-3 pr-10">
              <option>Todos</option><option>Activo</option><option>Inactivo</option>
            </select>
          </div>
          
          <div className="col-span-1 md:col-span-1 lg:col-span-2">
              <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
              <input type="date" id="start-date" value={startDate} onChange={handleFilterChange(setStartDate)} className="form-input block w-full border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 py-1.5 px-3" />
          </div>
          <div className="col-span-1 md:col-span-1 lg:col-span-2">
              <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
              <input type="date" id="end-date" value={endDate} onChange={handleFilterChange(setEndDate)} className="form-input block w-full border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 py-1.5 px-3" />
          </div>
          {/* --- CAMBIO: Botón Limpiar ELIMINADO de aquí --- */}
        </div>
        {/* --- FIN CAMBIO LAYOUT --- */}


        {/* --- CAMBIO: Botones de acción "Limpiar" y "Crear" juntos --- */}
        <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-6 mt-6 border-t border-gray-200">
          <button 
            onClick={handleClearFilters} 
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700"
          >
            <ArrowPathIcon className="h-5 w-5" />
            Limpiar
          </button>
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
                  <tr key={evento.id} className={`bg-white border-b hover:bg-gray-50 ${!evento.estado ? 'bg-gray-50' : ''}`}>
                    <td className={`px-6 py-4 font-medium whitespace-nowrap ${!evento.estado ? 'text-gray-400' : 'text-gray-900'}`}>{evento.nombre}</td>
                    <td className={`px-6 py-4 ${!evento.estado ? 'text-gray-400' : ''}`}>{evento.responsable || 'N/A'}</td>
                    <td className={`px-6 py-4 ${!evento.estado ? 'text-gray-400' : ''}`}>{formatDateForDisplay(evento.fechaInicio)} - {formatDateForDisplay(evento.fechaFin)}</td>
                    <td className="px-6 py-4"><StatusBadge isActive={evento.estado} /></td>
                    <td className="px-6 py-4 text-center">
                      
                      {/* --- CAMBIOS DE HOY --- */}
                      <div className="flex justify-center items-center gap-3">
                        {/* 1. Botón Editar */}
                        <button 
                          onClick={() => handleOpenEditModal(evento)} 
                          title="Editar" 
                          disabled={!evento.estado} // Deshabilitado si el evento está inactivo
                          className="p-2 rounded-full text-blue-600 bg-blue-100 hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <PencilIcon className="h-5 w-5" /> {/* Icono actualizado */}
                        </button>
                        
                        {/* 2. Botón Activar/Desactivar (Ojo) */}
                        <button 
                          onClick={() => evento.estado ? handleOpenDesactivarModal(evento) : handleOpenActivarModal(evento)} 
                          title={evento.estado ? 'Desactivar' : 'Reactivar'}
                          className="p-2 rounded-full text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                          {evento.estado ? <EyeIcon className="h-5 w-5"/> : <EyeSlashIcon className="h-5 w-5"/>}
                        </button>
                        
                        {/* 3. Botón Eliminar */}
                        <button 
                          onClick={() => handleOpenEliminarModal(evento)} 
                          title="Eliminar" 
                          disabled={!evento.estado} // Deshabilitado si el evento está inactivo
                          className="p-2 rounded-full text-red-600 bg-red-100 hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                      {/* --- FIN DE CAMBIOS DE HOY --- */}
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" className="text-center py-10 px-6 text-gray-500">{searchTerm ? `No hay eventos que coincidan con "${searchTerm}".` : "No hay eventos para mostrar."}</td></tr>
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

      {/* Modales */}
      <ModalBase isOpen={modalAbierto === 'crear' || modalAbierto === 'editar'} onClose={handleCloseModal} maxWidth="md:max-w-2xl"><FormularioEvento evento={eventoSeleccionado} onClose={handleCloseModal} onSave={handleSaveEvento} /></ModalBase>
      <ModalBase isOpen={modalAbierto === 'desactivar'} onClose={handleCloseModal} maxWidth="md:max-w-md"><ModalConfirmacion variant="warning" title="¿Desactivar Evento?" message="Estás a punto de desactivar este evento. No podrás editarlo ni eliminarlo." confirmText="Sí, desactivar" onConfirm={handleConfirmDesactivar} onClose={handleCloseModal} /></ModalBase>
      <ModalBase isOpen={modalAbierto === 'activar'} onClose={handleCloseModal} maxWidth="md:max-w-md"><ModalConfirmacion variant="success" title="¿Activar Evento?" message="Estás a punto de reactivar este evento." confirmText="Sí, activar" onConfirm={handleConfirmActivar} onClose={handleCloseModal} /></ModalBase>
      
      <ModalBase isOpen={modalAbierto === 'eliminar'} onClose={handleCloseModal} maxWidth="md:max-w-md">
        <ModalConfirmacion 
          variant="danger" 
          title="¿Eliminar Evento?" 
          message="¿Estás seguro de eliminar este evento permanentemente? Esta acción no se puede deshacer." 
          confirmText="Sí, Eliminar" 
          onConfirm={handleConfirmEliminar} 
          onClose={handleCloseModal} 
        />
      </ModalBase>
    </div>
  );
}