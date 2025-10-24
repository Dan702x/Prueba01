import React, { useState } from 'react';
import { 
  FunnelIcon, 
  PlusIcon,
  PencilSquareIcon,
  NoSymbolIcon,
  ArrowPathIcon
} from '@heroicons/react/24/solid';

// --- 1. IMPORTAMOS LOS NUEVOS COMPONENTES DESDE SUS UBICACIONES ---
import ModalBase from '../../components/common/ModalBase';
import FormularioEvento from './FormularioEvento';
import ModalConfirmacion from '../../components/common/ModalConfirmacion';


// --- Componente para la Píldora de Estado ---
const StatusBadge = ({ isActive }) => {
  const baseClasses = "px-3 py-1 text-xs font-semibold rounded-full inline-block";
  if (isActive) {
    return <span className={`${baseClasses} bg-green-100 text-green-800`}>Activo</span>;
  }
  return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>Inactivo</span>;
};


export default function GestionEventos() {
  
  // --- 2. ESTADO UNIFICADO PARA MANEJAR LOS MODALES ---
  const [modalAbierto, setModalAbierto] = useState(null); // 'crear', 'editar', 'desactivar', 'activar'
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);

  // --- 3. DATOS DE EJEMPLO (AHORA ES UN ESTADO PARA PODER MODIFICARLO) ---
  const [eventos, setEventos] = useState([
    {
      id: 1,
      nombre: 'Curso de React Avanzado',
      responsable: 'Juan Diego',
      fechaInicio: '01/08/25',
      fechaFin: '31/10/25',
      estado: true 
    },
    {
      id: 2,
      nombre: 'Taller de Figma para Devs.',
      responsable: 'Roy Silva',
      fechaInicio: '01/08/25',
      fechaFin: '31/10/25',
      estado: false
    }
  ]);

  // --- 4. FUNCIONES PARA MANEJAR LOS MODALES ---
  
  const handleOpenCreateModal = () => {
    setEventoSeleccionado(null); 
    setModalAbierto('crear');
  };

  const handleOpenEditModal = (evento) => {
    setEventoSeleccionado(evento); 
    setModalAbierto('editar');
  };

  const handleOpenDesactivarModal = (evento) => {
    setEventoSeleccionado(evento);
    setModalAbierto('desactivar');
  };

  const handleOpenActivarModal = (evento) => {
    setEventoSeleccionado(evento);
    setModalAbierto('activar');
  };

  // Cierra cualquier modal
  const handleCloseModal = () => {
    setModalAbierto(null);
    setEventoSeleccionado(null);
  };

  // --- 5. LÓGICA DE FRONTEND PARA GUARDAR/ACTUALIZAR DATOS ---
  // (Esto simula lo que haría el backend)

  const handleSaveEvento = (datosFormulario) => {
    if (eventoSeleccionado) { 
      // Lógica de Edición
      console.log("Editando evento...", eventoSeleccionado.id, datosFormulario);
      setEventos(eventos.map(e => 
        e.id === eventoSeleccionado.id ? { ...e, ...datosFormulario, nombre: datosFormulario.nombre } : e
      ));
    } else { 
      // Lógica de Creación
      console.log("Creando nuevo evento...", datosFormulario);
      const nuevoEvento = { 
        id: Date.now(), // ID de ejemplo
        ...datosFormulario, 
        estado: true // Los nuevos eventos empiezan como activos
      };
      setEventos([...eventos, nuevoEvento]);
    }
    handleCloseModal(); // Cierra el modal después de guardar
  };

  const handleConfirmDesactivar = () => {
    console.log("Desactivando evento:", eventoSeleccionado.id);
    setEventos(eventos.map(e => 
      e.id === eventoSeleccionado.id ? { ...e, estado: false } : e
    ));
    handleCloseModal();
  };

  const handleConfirmActivar = () => {
    console.log("Activando evento:", eventoSeleccionado.id);
    setEventos(eventos.map(e => 
      e.id === eventoSeleccionado.id ? { ...e, estado: true } : e
    ));
    handleCloseModal();
  };


  return (
    <div className="p-4 md:p-8">
      
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-800">
          Gestión de Eventos y Cursos
        </h1>
      </div>

      {/* --- Contenedor de Filtros --- */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row md:items-end gap-4">
            
            <div className="w-full sm:w-auto">
              <label htmlFor="search-event" className="block text-sm font-medium text-gray-700 mb-1">Buscar por nombre</label>
              <input type="text" id="search-event" placeholder="Ej. Curso de React Avanzado" className="form-input block w-full border-gray-300 rounded-md shadow-sm"/>
            </div>

            <div className="w-full sm:w-auto">
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select id="status-filter" className="form-select block w-full border-gray-300 rounded-md shadow-sm">
                <option>Todos</option>
                <option>Activo</option>
                <option>Inactivo</option>
              </select>
            </div>
            
            <div className="w-full sm:w-auto">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700">
                <FunnelIcon className="h-5 w-5" />
                Filtrar
              </button>
            </div>

            <div className="w-full md:w-auto md:ml-auto">
              <button 
                onClick={handleOpenCreateModal}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600">
                <PlusIcon className="h-5 w-5" />
                Crear Nuevo Evento
              </button>
            </div>
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
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {evento.nombre}
                  </td>
                  <td className="px-6 py-4">{evento.responsable}</td>
                  <td className="px-6 py-4">{evento.fechaInicio}</td>
                  <td className="px-6 py-4">{evento.fechaFin}</td>
                  <td className="px-6 py-4">
                    <StatusBadge isActive={evento.estado} />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center items-center gap-3">
                      {/* BOTONES CON onClick ACTUALIZADOS */}
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
              <tr>
                <td colSpan="6" className="text-center py-10 px-6 text-gray-500">
                  No hay eventos para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- 6. RENDERIZADO DE MODALES --- */}
      
      {/* Modal de Crear / Editar (usa el mismo formulario) */}
      <ModalBase 
        isOpen={modalAbierto === 'crear' || modalAbierto === 'editar'}
        onClose={handleCloseModal}
        maxWidth="md:max-w-2xl" // Lo hacemos un poco más ancho
      >
        <FormularioEvento 
          evento={eventoSeleccionado} // Será 'null' al crear, o un objeto al editar
          onClose={handleCloseModal}
          onSave={handleSaveEvento}
        />
      </ModalBase>
      
      {/* Modal de Desactivar */}
      <ModalBase 
        isOpen={modalAbierto === 'desactivar'} 
        onClose={handleCloseModal} 
        maxWidth="md:max-w-md" // Más angosto
      >
        <ModalConfirmacion
          modo="desactivar"
          onClose={handleCloseModal}
          onConfirm={handleConfirmDesactivar}
        />
      </ModalBase>

      {/* Modal de Activar */}
      <ModalBase 
        isOpen={modalAbierto === 'activar'} 
        onClose={handleCloseModal} 
        maxWidth="md:max-w-md" // Más angosto
      >
        <ModalConfirmacion
          modo="activar"
          onClose={handleCloseModal}
          onConfirm={handleConfirmActivar}
        />
      </ModalBase>

    </div>
  );
}

