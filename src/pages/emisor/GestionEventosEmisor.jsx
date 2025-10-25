import React, { useState, useMemo, useCallback } from 'react';
import {
  FunnelIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon
  // Ya no necesitamos PlusIcon, PencilSquareIcon, NoSymbolIcon, ArrowPathIcon
} from '@heroicons/react/24/solid';

// Ya no necesitamos importar los modales ni el formulario
// import ModalBase from '../../components/common/ModalBase';
// import FormularioEvento from '../admin/FormularioEvento';
// import ModalConfirmacion from '../../components/common/ModalConfirmacion';

// --- Componente StatusBadge ---
const StatusBadge = ({ isActive }) => {
  const baseClasses = "px-3 py-1 text-xs font-semibold rounded-full inline-block";
  if (isActive) return <span className={`${baseClasses} bg-green-100 text-green-800`}>Activo</span>;
  return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>Inactivo</span>;
};

// --- Componente Principal ---
export default function GestionEventosEmisor() {

  // Ya no necesitamos estado para los modales
  // const [modalAbierto, setModalAbierto] = useState(null);
  // const [eventoSeleccionado, setEventoSeleccionado] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Ajustado a 8 como en tu GestionEventos.jsx original

  // Datos de ejemplo ampliados
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

  // --- Lógica de Filtrado y Paginación ---
  const filteredItems = useMemo(() => {
    return eventos.filter(evento =>
      evento.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [eventos, searchTerm]);

  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredItems.slice(startIndex, endIndex);
  }, [filteredItems, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  // --- Funciones para Paginación y Búsqueda ---
  const goToNextPage = useCallback(() => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  }, [totalPages]);

  const goToPreviousPage = useCallback(() => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  }, []);

  const handleSearchChange = useCallback((event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  }, []);

  // Ya no necesitamos las funciones para manejar modales de acciones

  return (
    // --- CONTENEDOR PRINCIPAL CON FLEX Y ALTURA ---
    <div className="flex flex-col h-full">

      {/* --- Cabecera con padding propio --- */}
      <div className="mb-6 shrink-0 pt-4 md:pt-8 px-4 md:px-8">
        <h1 className="text-4xl font-bold text-gray-800">
          Gestión de Eventos y Cursos
        </h1>
      </div>

      {/* --- Contenedor de Filtros (SIN BOTÓN CREAR) --- */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-6 shrink-0 mx-4 md:mx-8">
        <div className="flex flex-wrap items-end gap-4">

          {/* Buscar por nombre */}
          <div className="w-full sm:w-auto flex-grow">
            <label htmlFor="search-event" className="block text-sm font-medium text-gray-700 mb-1">Buscar por nombre</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" /></div>
              <input type="text" id="search-event" placeholder="Ej. Curso de React Avanzado" value={searchTerm} onChange={handleSearchChange}
                className="form-input block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"/>
            </div>
          </div>

          {/* Estado */}
          <div className="w-full sm:w-auto">
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select id="status-filter" className="form-select block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm py-2 pl-3 pr-10">
              <option>Todos</option><option>Activo</option><option>Inactivo</option>
            </select>
          </div>

          {/* Botón Filtrar */}
          {/* Añadimos ml-auto en pantallas pequeñas para empujarlo a la derecha */}
          <div className="w-full sm:w-auto sm:ml-auto mt-4 sm:mt-0">
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 min-w-[100px]"><FunnelIcon className="h-5 w-5" />Filtrar</button>
          </div>
          {/* Botón Crear eliminado */}
        </div>
      </div>

      {/* --- CONTENEDOR DE TABLA Y PAGINACIÓN --- */}
      <div className="flex-1 overflow-hidden flex flex-col px-4 md:px-8 pb-4 md:pb-8">
        {/* Tabla */}
        <div className="flex-1 overflow-y-auto bg-white rounded-xl shadow-md border border-gray-200">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0 z-10">
              <tr>
                <th scope="col" className="px-6 py-4">Nombre del Evento</th>
                <th scope="col" className="px-6 py-4">Responsable</th>
                <th scope="col" className="px-6 py-4">Fecha Inicio</th>
                <th scope="col" className="px-6 py-4">Fecha Fin</th>
                <th scope="col" className="px-6 py-4">Estado</th>
                {/* Columna Acciones eliminada */}
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((evento) => (
                  <tr key={evento.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{evento.nombre}</td>
                    <td className="px-6 py-4">{evento.responsable}</td>
                    <td className="px-6 py-4">{evento.fechaInicio}</td>
                    <td className="px-6 py-4">{evento.fechaFin}</td>
                    <td className="px-6 py-4"><StatusBadge isActive={evento.estado} /></td>
                    {/* Celda Acciones eliminada */}
                  </tr>
                ))
              ) : (
                // Ajustamos colSpan a 5
                <tr><td colSpan="5" className="text-center py-10 px-6 text-gray-500">{searchTerm ? `No hay eventos que coincidan con "${searchTerm}".` : "No hay eventos para mostrar."}</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* --- CONTROLES DE PAGINACIÓN --- */}
        {filteredItems.length > 0 && totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 pt-6 shrink-0">
            <button onClick={goToPreviousPage} disabled={currentPage === 1} className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              <ChevronLeftIcon className="h-5 w-5" /> Anterior
            </button>
            <span className="text-sm text-gray-700">Página {currentPage} de {totalPages}</span>
            <button onClick={goToNextPage} disabled={currentPage === totalPages} className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              Siguiente <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* Renderizado de Modales eliminado */}

    </div>
  );
}