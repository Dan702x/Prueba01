import React from 'react';
import { Link } from 'react-router-dom';
// Importamos los íconos que usaremos (Plus para el botón, Document para la tarjeta)
import { PlusIcon, DocumentIcon } from '@heroicons/react/24/solid';

// --- Datos de ejemplo. El Figma solo muestra uno. ---
const mockPlantillas = [
  {
    id: 1,
    nombre: 'Plantilla Corporativa',
  },
  // Puedes añadir más aquí y aparecerán en la cuadrícula
  // {
  //   id: 2,
  //   nombre: 'Constancia de Prácticas',
  // },
];

// --- Componente interno para la tarjeta (idéntico al Figma) ---
function PlantillaCard({ nombre, to }) {
  return (
    <Link 
      to={to} 
      className="block border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-200"
    >
      {/* Ícono gris grande */}
      <div className="flex items-center justify-center w-full h-32 bg-gray-100 rounded-md mx-auto mb-4">
        <DocumentIcon className="w-16 h-16 text-gray-400" />
      </div>
      {/* Título de la plantilla */}
      <span className="font-semibold text-gray-700">{nombre}</span>
    </Link>
  );
}


export default function ListaPlantillas() {
  return (
    // Contenedor blanco principal con sombra
    <div className="bg-white p-6 rounded-2xl shadow-lg space-y-6">
      
      {/* --- 1. Título (del Figma) --- */}
      <h1 className="text-3xl font-bold text-gray-800">Mnt. de Plantillas</h1>

      {/* --- 2. Sub-cabecera con el botón (del Figma) --- */}
      <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Gestión de Plantillas de Certificados</h2>
          <Link
            to="/plantillas/crear" // Esto te lleva al Editor Visual
            className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 shadow-sm flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            Subir Plantilla {/* <-- Texto idéntico al Figma */}
          </Link>
        </div>
      </div>

      {/* --- 3. Cuadrícula de Plantillas (del Figma) --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {mockPlantillas.map((plantilla) => (
          <PlantillaCard
            key={plantilla.id}
            nombre={plantilla.nombre}
            to={`/plantillas/editar/${plantilla.id}`} // Al hacer clic en la tarjeta, vas al editor
          />
        ))}
      </div>

    </div>
  );
}