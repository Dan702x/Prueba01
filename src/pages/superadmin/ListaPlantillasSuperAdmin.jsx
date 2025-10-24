import React from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, DocumentIcon, PencilIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';

const mockPlantillas = [
  { id: 1, nombre: 'Plantilla Corporativa Global' },
  { id: 2, nombre: 'Constancia Prácticas General' },
];

function PlantillaCard({ id, nombre }) {
  // --- ¡¡¡CORRECCIÓN AQUÍ!!! ---
  const editPath = `/super/plantillas/editar/${id}`; // Cambiado a /super/

  return (
    // El Link principal de la tarjeta ahora usa la ruta corregida
    <Link
      to={editPath}
      className="block border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-200 bg-white"
    >
      <div className="flex items-center justify-center w-full h-32 bg-gray-100 rounded-md mx-auto mb-4">
        <DocumentIcon className="w-16 h-16 text-gray-400" />
      </div>
      <span className="font-semibold text-gray-700">{nombre}</span>
      <div className="flex justify-center gap-2 mt-4 pt-4 border-t border-gray-200">
        {/* El Link del botón "Editar" también usa la ruta corregida */}
        <Link
          to={editPath}
          onClick={(e) => e.stopPropagation()} // Evita que el clic en el botón active el link de la tarjeta entera
          className="bg-white text-gray-700 px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-100 text-sm flex items-center gap-1 z-10 relative"
        >
          <PencilIcon className="w-4 h-4" />
          Editar
        </Link>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); e.preventDefault(); alert('Duplicar (implementar)'); }}
          className="bg-white text-gray-700 px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-100 text-sm flex items-center gap-1 z-10 relative"
        >
          <DocumentDuplicateIcon className="w-4 h-4" />
          Duplicar
        </button>
      </div>
    </Link>
  );
}

export default function ListaPlantillasSuperAdmin() {
  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Plantillas (Super Admin)</h1>
        {/* --- ¡¡¡CORRECCIÓN AQUÍ!!! --- */}
        <Link
          to="/super/plantillas/crear" // Cambiado a /super/
          className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 shadow-sm flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          Crear Plantilla Global
        </Link>
      </div>

      <p className="text-gray-600 px-1">
        Administra las plantillas base que pueden ser usadas por todas las empresas.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {mockPlantillas.map((plantilla) => (
          <PlantillaCard
            key={plantilla.id}
            id={plantilla.id}
            nombre={plantilla.nombre}
          />
        ))}
      </div>

    </div>
  );
}