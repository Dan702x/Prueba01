import React from 'react';
import { Link } from 'react-router-dom';
import { DocumentIcon, PaintBrushIcon } from '@heroicons/react/24/outline';

const mockPlantillasGlobales = [
  { id: 1, nombre: 'Plantilla Corporativa Global' },
  { id: 2, nombre: 'Constancia Prácticas General' },
];

function PlantillaCard({ id, nombre }) {
  const personalizarPath = `/admin/plantillas/personalizar/${id}`;

  return (
    <div className="border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-200 bg-white">
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
          Personalizar
        </Link>
      </div>
    </div>
  );
}

export default function ListaPlantillasAdmin() {
  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-gray-800">Personalizar Plantillas</h1>
      </div>
      <p className="text-gray-600 px-1">
        Selecciona una plantilla base global para personalizarla con la identidad de tu empresa.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {mockPlantillasGlobales.map((plantilla) => (
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