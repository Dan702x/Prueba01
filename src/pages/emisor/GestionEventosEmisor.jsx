import React, { useState } from 'react';
import { 
  FunnelIcon, 
  // Ya no necesitamos PlusIcon
  PencilSquareIcon,
  NoSymbolIcon,
  ArrowPathIcon
} from '@heroicons/react/24/solid';

// --- Importamos los modales desde 'common' y el formulario específico ---
// ¡Asegúrate que las rutas sean correctas desde src/pages/emisor/!
import ModalBase from '../../components/common/ModalBase'; 
// Asumimos que el formulario de Edición SÍ lo puede usar el emisor
// Si no, podemos quitarlo también. Usaremos el mismo formulario por ahora.
import FormularioEvento from '../admin/FormularioEvento'; // Reutilizamos el de admin
import ModalConfirmacion from '../../components/common/ModalConfirmacion';


// --- Componente para la Píldora de Estado ---
const StatusBadge = ({ isActive }) => {
  const baseClasses = "px-3 py-1 text-xs font-semibold rounded-full inline-block";
  if (isActive) {
    return <span className={`${baseClasses} bg-green-100 text-green-800`}>Activo</span>;
  }
  return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>Inactivo</span>;
};


export default function GestionEventosEmisor() {
  
  // Estado para manejar los modales (solo Editar, Desactivar, Activar)
  const [modalAbierto, setModalAbierto] = useState(null); // 'editar', 'desactivar', 'activar'
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);

  // Datos de ejemplo (iguales que antes)
  const [eventos, setEventos] = useState([
    { id: 1, nombre: 'Curso de React Avanzado', responsable: 'Juan Diego', fechaInicio: '01/08/25', fechaFin: '31/10/25', estado: true },
    { id: 2, nombre: 'Taller de Figma para Devs.', responsable: 'Roy Silva', fechaInicio: '01/08/25', fechaFin: '31/10/25', estado: false }
  ]);

  // --- Funciones para manejar los modales (sin 'crear') ---
  const handleOpenEditModal = (evento) => { setEventoSeleccionado(evento); setModalAbierto('editar'); };
  const handleOpenDesactivarModal = (evento) => { setEventoSeleccionado(evento); setModalAbierto('desactivar'); };
  const handleOpenActivarModal = (evento) => { setEventoSeleccionado(evento); setModalAbierto('activar'); };
  const handleCloseModal = () => { setModalAbierto(null); setEventoSeleccionado(null); };

  // --- Lógica de "Guardar" (solo edición) ---
  const handleSaveEvento = (datosFormulario) => {
    if (eventoSeleccionado) { 
      console.log("Editando evento (Emisor)...", eventoSeleccionado.id, datosFormulario);
      setEventos(eventos.map(e => e.id === eventoSeleccionado.id ? { ...e, ...datosFormulario, nombre: datosFormulario.nombre } : e ));
    } 
    // No hay lógica de creación
    handleCloseModal(); 
  };

  const handleConfirmDesactivar = () => {
    console.log("Desactivando evento (Emisor):", eventoSeleccionado.id);
    setEventos(eventos.map(e => e.id === eventoSeleccionado.id ? { ...e, estado: false } : e ));
    handleCloseModal();
  };

  const handleConfirmActivar = () => {
    console.log("Activando evento (Emisor):", eventoSeleccionado.id);
    setEventos(eventos.map(e => e.id === eventoSeleccionado.id ? { ...e, estado: true } : e ));
    handleCloseModal();
  };


  return (
    <div className="p-4 md:p-8">
      
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-800">
          Gestión de Eventos y Cursos
        </h1>
      </div>

      {/* --- Contenedor de Filtros (SIN BOTÓN CREAR) --- */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            
            {/* Buscar por nombre */}
            <div className="w-full sm:w-auto flex-grow sm:flex-grow-0"> 
              <label htmlFor="search-event" className="block text-sm font-medium text-gray-700 mb-1">
                Buscar por nombre
              </label>
              <input 
                type="text" 
                id="search-event"
                placeholder="Ej. Curso de React Avanzado"
                className="form-input block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* Estado */}
            <div className="w-full sm:w-auto">
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select 
                id="status-filter"
                className="form-select block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option>Todos</option>
                <option>Activo</option>
                <option>Inactivo</option>
              </select>
            </div>
            
            {/* Botón Filtrar (ahora ocupa el espacio restante a la derecha en móvil) */}
            <div className="w-full sm:w-auto sm:ml-auto"> {/* ml-auto lo empuja a la derecha en sm+ */}
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200 min-w-[100px]">
                <FunnelIcon className="h-5 w-5" />
                Filtrar
              </button>
            </div>
            {/* El botón Crear Nuevo Evento ha sido eliminado */}
        </div>
      </div>


      {/* --- Tabla de Eventos --- */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-4">Nombre del Evento</th>
              <th scope="col" className="px-6 py-4">Responsable</th>
              <th scope="col" className="px-6 py-4">Fecha Inicio</th>
              <th scope="col" className="px-6 py-4">Fecha Fin</th>
              <th scope="col" className="px-6 py-4">Estado</th>
              <th scope="col" className="px-6 py-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {eventos.length > 0 ? (
              eventos.map((evento) => (
                <tr key={evento.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{evento.nombre}</td>
                  <td className="px-6 py-4">{evento.responsable}</td>
                  <td className="px-6 py-4">{evento.fechaInicio}</td>
                  <td className="px-6 py-4">{evento.fechaFin}</td>
                  <td className="px-6 py-4"><StatusBadge isActive={evento.estado} /></td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center items-center gap-3">
                      <button onClick={() => handleOpenEditModal(evento)} className="text-yellow-500 hover:text-yellow-700">
                        <PencilSquareIcon className="h-5 w-5" />
                      </button>
                      {evento.estado ? (
                        <button onClick={() => handleOpenDesactivarModal(evento)} className="text-red-500 hover:text-red-700">
                          <NoSymbolIcon className="h-5 w-5" />
                        </button>
                      ) : (
                        <button onClick={() => handleOpenActivarModal(evento)} className="text-green-500 hover:text-green-700">
                          <ArrowPathIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6" className="text-center py-10 px-6 text-gray-500">No hay eventos para mostrar.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- Renderizado de Modales (Sin el de Crear) --- */}
      <ModalBase isOpen={modalAbierto === 'editar'} onClose={handleCloseModal} maxWidth="md:max-w-2xl">
        <FormularioEvento evento={eventoSeleccionado} onClose={handleCloseModal} onSave={handleSaveEvento} />
      </ModalBase>
      
      <ModalBase isOpen={modalAbierto === 'desactivar'} onClose={handleCloseModal} maxWidth="md:max-w-md">
        <ModalConfirmacion modo="desactivar" onClose={handleCloseModal} onConfirm={handleConfirmDesactivar} />
      </ModalBase>

      <ModalBase isOpen={modalAbierto === 'activar'} onClose={handleCloseModal} maxWidth="md:max-w-md">
        <ModalConfirmacion modo="activar" onClose={handleCloseModal} onConfirm={handleConfirmActivar} />
      </ModalBase>

    </div>
  );
}