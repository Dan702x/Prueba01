import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpOnSquareIcon, EyeIcon, CodeBracketIcon, ClipboardIcon } from '@heroicons/react/24/solid';

// Estas son las variables que usaremos, basadas en tu ejemplo
const variablesDisponibles = [
  { nombre: 'Nombre Completo', var: '{{nombre_completo}}' },
  { nombre: 'DNI', var: '{{dni}}' },
  { nombre: 'Cargo / Puesto', var: '{{cargo}}' },
  { nombre: 'Área', var: '{{area_empresa}}' },
  { nombre: 'Fecha de Inicio', var: '{{fecha_inicio}}' },
  { nombre: 'Fecha de Fin', var: '{{fecha_fin}}' },
  { nombre: 'Funciones', var: '{{funciones}}' },
  { nombre: 'Empresa Nombre', var: '{{empresa_nombre}}' },
  { nombre: 'Empresa RUC', var: '{{empresa_ruc}}' },
  { nombre: 'Empresa Dirección', var: '{{empresa_direccion}}' },
  { nombre: 'Responsable Nombre', var: '{{responsable_nombre}}' },
  { nombre: 'Responsable Cargo', var: '{{responsable_cargo}}' },
  { nombre: 'Fecha de Emisión', var: '{{fecha_emision}}' },
];

// Texto de ejemplo del certificado que me enviaste
const textoEjemplo = `Quien suscribe, {{responsable_nombre}}, Gerente General del {{empresa_nombre}} S.A.C, con RUC: {{empresa_ruc}}, con dirección legal en {{empresa_direccion}}.

Por media de la presente, se hace constar que la Srta. {{nombre_completo}}, identificada con DNI N.º {{dni}}, se encuentra trabajando como {{cargo}} en nuestra empresa, desempeñándose en el Área {{area_empresa}} desde el {{fecha_inicio}} hasta la actualidad.

Durante los periodos, ha demostrado responsabilidad, puntualidad y compromiso en el cumplimiento de todas sus funciones, que son las siguientes: {{funciones}}.

Se expide la presente constancia a solicitud de la interesada, para los fines que estime conveniente.

Atentamente,

Lima, {{fecha_emision}}`;

export default function EditorPlantilla() {
  const [cuerpoPlantilla, setCuerpoPlantilla] = useState(textoEjemplo);
  const [tabActual, setTabActual] = useState('editor'); // 'editor' o 'preview'

  const copiarVariable = (variable) => {
    navigator.clipboard.writeText(variable);
    // (Opcional: mostrar una pequeña notificación de "copiado")
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg space-y-6">
      
      {/* --- Cabecera --- */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Crear Nueva Plantilla</h1>
        <div className="flex gap-2">
          <Link to="/plantillas" className="bg-white text-gray-700 px-5 py-2 rounded-md border border-gray-300 hover:bg-gray-50">
            Cancelar
          </Link>
          <button className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 shadow-sm">
            Guardar Plantilla
          </button>
        </div>
      </div>

      {/* --- Contenedor Principal (Editor + Barra Lateral) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* --- Columna Izquierda (Campos y Editor) --- */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Nombre de Plantilla y Logo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de la Plantilla
              </label>
              <input
                type="text"
                id="nombre"
                placeholder="Ej: Certificado de Trabajo"
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div>
              <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-1">
                Logo de la Empresa (Opcional)
              </label>
              <div className="flex items-center gap-2 p-2 border border-gray-300 rounded-md shadow-sm">
                <ArrowUpOnSquareIcon className="w-5 h-5 text-gray-500" />
                <span className="text-gray-600">Subir un archivo</span>
                <input type="file" id="logo" className="sr-only" />
              </div>
            </div>
          </div>
          
          {/* Pestañas del Editor (Editor / Preview) */}
          <div className="border-b border-gray-200">
            <nav className="flex gap-4">
              <button
                onClick={() => setTabActual('editor')}
                className={`flex items-center gap-2 py-2 px-4 border-b-2 ${
                  tabActual === 'editor' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <CodeBracketIcon className="w-5 h-5" /> Editor
              </button>
              <button
                onClick={() => setTabActual('preview')}
                className={`flex items-center gap-2 py-2 px-4 border-b-2 ${
                  tabActual === 'preview' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <EyeIcon className="w-5 h-5" /> Previsualizar
              </button>
            </nav>
          </div>

          {/* Área de Texto o Preview */}
          {tabActual === 'editor' ? (
            <textarea
              value={cuerpoPlantilla}
              onChange={(e) => setCuerpoPlantilla(e.target.value)}
              rows={20}
              className="w-full p-4 border border-gray-300 rounded-md shadow-sm font-mono text-sm"
              placeholder="Escribe el cuerpo de tu certificado aquí... Usa las variables de la derecha."
            />
          ) : (
            <div 
              className="w-full p-4 border border-gray-200 rounded-md shadow-inner bg-gray-50 min-h-[400px] prose"
              dangerouslySetInnerHTML={{ __html: cuerpoPlantilla.replace(/\n/g, '<br />').replace(/{{(.*?)}}/g, '<span class="bg-yellow-200 p-1 rounded font-semibold">{{$1}}</span>') }}
            />
          )}

        </div>

        {/* --- Columna Derecha (Variables) --- */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-sm">
            <h2 className="font-semibold text-gray-800 mb-3">Variables Disponibles</h2>
            <p className="text-sm text-gray-600 mb-4">
              Haz clic en una variable para copiarla y pégala en el editor.
            </p>
            <div className="flex flex-wrap gap-2">
              {variablesDisponibles.map((v) => (
                <button
                  key={v.var}
                  onClick={() => copiarVariable(v.var)}
                  title={`Copiar ${v.var}`}
                  className="bg-blue-100 text-blue-800 text-xs font-mono p-1.5 rounded-md hover:bg-blue-200 flex items-center gap-1"
                >
                  <ClipboardIcon className="w-3 h-3" />
                  {v.nombre}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-4">
  Estas variables <code>{`{{...}}`}</code> serán reemplazadas por los datos reales al generar el PDF.
</p>
          </div>
        </div>

      </div>
    </div>
  );
}