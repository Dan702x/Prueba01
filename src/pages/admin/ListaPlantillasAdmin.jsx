import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    DocumentIcon, 
    PaintBrushIcon, 
    PlusIcon, 
    PencilIcon, 
    BookmarkIcon // Icono para "Personalizada"
} from '@heroicons/react/24/outline';

// --- DATOS GLOBALES (Simulando venir del SuperAdmin) ---
const mockPlantillasGlobales = [
  { id: 'global_1', nombre: 'Plantilla Corporativa Global' },
  { id: 'global_2', nombre: 'Constancia Prácticas General' },
];

// --- NUEVA KEY PARA LOCALSTORAGE ---
const ADMIN_TEMPLATES_KEY = 'admin_plantillas_creadas';

// --- TARJETA PARA PLANTILLAS GLOBALES ---
function PlantillaGlobalCard({ id, nombre }) {
  const personalizarPath = `/admin/plantillas/personalizar/${id}`;
  
  // Revisa si ya existe una personalización guardada
  const [isCustomized, setIsCustomized] = useState(false);
  useEffect(() => {
    const checkStorage = () => {
      const datosGuardados = localStorage.getItem(`custom_plantilla_global_${id}`);
      setIsCustomized(Boolean(datosGuardados));
    };
    checkStorage();
    // Escucha eventos de storage por si se guarda en otra pestaña (opcional)
    window.addEventListener('storage', checkStorage);
    return () => window.removeEventListener('storage', checkStorage);
  }, [id]);

  return (
    <div className="border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-200 bg-white relative">
      {isCustomized && (
        <span 
          className="absolute top-2 right-2 flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium"
          title="Ya has guardado una personalización para esta plantilla"
        >
          <BookmarkIcon className="w-3 h-3" />
          Personalizada
        </span>
      )}
      <div className="flex items-center justify-center w-full h-32 bg-gray-100 rounded-md mx-auto mb-4">
        <DocumentIcon className="w-16 h-16 text-gray-400" />
      </div>
      <h3 className="font-semibold text-gray-700 h-12 flex items-center justify-center">{nombre}</h3>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <Link
          to={personalizarPath}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 shadow-sm flex items-center gap-2 justify-center"
        >
          <PaintBrushIcon className="w-5 h-5" />
          {isCustomized ? 'Editar Personalización' : 'Personalizar'}
        </Link>
      </div>
    </div>
  );
}

// --- TARJETA PARA PLANTILLAS CREADAS POR EL ADMIN ---
function PlantillaAdminCard({ id, nombre }) {
  const editarPath = `/admin/plantillas/editar/${id}`; // Usaremos "editar" para las creadas
  
  // ¡CORRECCIÓN IMPORTANTE!
  // El router actual no distingue /editar/:id. Usaremos /personalizar/:id
  // para editar también. El componente Personalizador lo manejará.
  const path = `/admin/plantillas/personalizar/${id}`;

  return (
    <div className="border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-200 bg-white">
      <div className="flex items-center justify-center w-full h-32 bg-gray-50 rounded-md mx-auto mb-4">
        <DocumentIcon className="w-16 h-16 text-blue-400" />
      </div>
      <h3 className="font-semibold text-gray-700 h-12 flex items-center justify-center">{nombre}</h3>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <Link
          to={path}
          className="bg-white text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100 border border-gray-300 shadow-sm flex items-center gap-2 justify-center"
        >
          <PencilIcon className="w-5 h-5" />
          Editar
        </Link>
      </div>
    </div>
  );
}

// --- TARJETA PARA "CREAR NUEVO" ---
function CrearPlantillaCard() {
  return (
    <Link
      to="/admin/plantillas/crear"
      className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-200 bg-gray-50 hover:border-blue-400 hover:bg-white flex flex-col items-center justify-center min-h-[280px]"
    >
      <div className="flex items-center justify-center w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4">
        <PlusIcon className="w-12 h-12 text-gray-500" />
      </div>
      <h3 className="font-semibold text-gray-700">Crear Nueva Plantilla</h3>
      <p className="text-sm text-gray-500 mt-1">Empezar desde cero</p>
    </Link>
  );
}


export default function ListaPlantillasAdmin() {
  
  // --- NUEVO: Estado para plantillas creadas por el admin ---
  const [plantillasAdmin, setPlantillasAdmin] = useState([]);

  useEffect(() => {
    // Carga las plantillas guardadas en localStorage al montar
    const datosGuardados = localStorage.getItem(ADMIN_TEMPLATES_KEY);
    if (datosGuardados) {
      setPlantillasAdmin(JSON.parse(datosGuardados));
    }
  }, []);

  return (
    <div className="space-y-8">
      <div className="bg-white p-4 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-gray-800">Control de Plantillas</h1>
      </div>

      {/* --- SECCIÓN 1: Plantillas Creadas por ti --- */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4 px-1">Mis Plantillas Creadas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Botón de Crear siempre primero */}
          <CrearPlantillaCard />

          {/* Lista de plantillas creadas */}
          {plantillasAdmin.map((plantilla) => (
            <PlantillaAdminCard
              key={plantilla.id}
              id={plantilla.id}
              nombre={plantilla.nombre}
            />
          ))}
        </div>
      </div>

      {/* --- SECCIÓN 2: Plantillas Globales --- */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4 px-1">Plantillas Globales (Base)</h2>
        <p className="text-gray-600 px-1 mb-4">
          Selecciona una plantilla base global para personalizarla con la identidad de tu empresa.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mockPlantillasGlobales.map((plantilla) => (
            <PlantillaGlobalCard
              key={plantilla.id}
              id={plantilla.id}
              nombre={plantilla.nombre}
            />
          ))}
        </div>
      </div>
    </div>
  );
}