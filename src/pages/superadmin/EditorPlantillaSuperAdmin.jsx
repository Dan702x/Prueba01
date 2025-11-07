import React, { useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
    EyeIcon, 
    CodeBracketIcon, 
    ClipboardIcon,
    DocumentDuplicateIcon,
    PhotoIcon,
    PencilSquareIcon,
    CogIcon,
    IdentificationIcon
} from '@heroicons/react/24/outline';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// =============================================
// PLANTILLAS BASE CON MARCOS (PARA SUPERADMIN)
// =============================================

const PLANTILLAS_BASE = [
  {
    id: 'marco-dorado',
    nombre: 'Marco Dorado Elegante',
    descripcion: 'Certificado formal con marco dorado para eventos importantes',
    categoria: 'certificados',
    orientacion: 'vertical',
    cuerpo: `
<div class="certificado-marco-dorado">
  <div class="marco-exterior">
    <div class="marco-interior">
      <div class="encabezado">
        <h1>CERTIFICADO</h1>
        <p>De Reconocimiento Oficial</p>
      </div>
      
      <div class="contenido">
        <p>Se otorga el presente certificado a:</p>
        <div class="nombre-destacado">
          <h2>{{nombre_completo}}</h2>
        </div>
        <p>Por completar satisfactoriamente <strong>{{nombre_evento}}</strong></p>
        <p>Duración: <strong>{{duracion}}</strong></p>
      </div>
      
      <div class="firmas">
        <div class="firma">
          <div class="linea-firma"></div>
          <p><strong>{{responsable_nombre}}</strong></p>
          <p>{{responsable_cargo}}</p>
        </div>
        <div class="firma">
          <div class="linea-firma"></div>
          <p><strong>{{firmante_2_nombre}}</strong></p>
          <p>{{firmante_2_cargo}}</p>
        </div>
      </div>
      
      <div class="pie">
        <p>Emitido el {{fecha_emision_larga}} | ID: {{id_certificado}}</p>
      </div>
    </div>
  </div>
</div>

<style>
.certificado-marco-dorado {
  min-height: 100vh;
  padding: 20px;
  font-family: 'Georgia', serif;
}

.marco-exterior {
  border: 25px solid transparent;
  border-image: linear-gradient(45deg, #d4af37, #f9e076, #d4af37);
  border-image-slice: 1;
  background: #fdf6e3;
  height: 100%;
  position: relative;
}

.marco-interior {
  border: 2px solid #d4af37;
  margin: 10px;
  padding: 40px;
  height: calc(100% - 20px);
  background: white;
}

.encabezado {
  text-align: center;
  margin-bottom: 40px;
  border-bottom: 2px solid #d4af37;
  padding-bottom: 20px;
}

.encabezado h1 {
  color: #8b4513;
  font-size: 36px;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 3px;
}

.encabezado p {
  color: #a52a2a;
  font-style: italic;
  margin: 10px 0 0 0;
}

.contenido {
  text-align: center;
  margin: 40px 0;
}

.nombre-destacado {
  background: linear-gradient(135deg, #fffaf0, #f9e076);
  border: 2px solid #d4af37;
  padding: 25px;
  margin: 25px 0;
  border-radius: 10px;
}

.nombre-destacado h2 {
  color: #8b4513;
  margin: 0;
  font-size: 32px;
}

.firmas {
  display: flex;
  justify-content: space-between;
  margin-top: 60px;
  padding: 0 50px;
}

.firma {
  text-align: center;
}

.linea-firma {
  border-top: 2px solid #8b4513;
  width: 180px;
  margin-bottom: 10px;
}

.pie {
  text-align: center;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #ddd;
  color: #666;
  font-size: 14px;
}
</style>
    `,
    esPlantillaBase: true
  },
  {
    id: 'marco-moderno',
    nombre: 'Marco Moderno Azul', 
    descripcion: 'Diseño contemporáneo con marco azul para empresas',
    categoria: 'diplomas',
    orientacion: 'horizontal',
    cuerpo: `
<div class="diploma-marco-moderno">
  <div class="contenedor-horizontal">
    <div class="logo-seccion">
      <div class="logo">LOGO</div>
    </div>
    
    <div class="contenido-principal">
      <h1>DIPLOMA</h1>
      <p class="subtitulo">De Excelencia Profesional</p>
      
      <div class="destinatario">
        <p>Otorgado a:</p>
        <h2>{{nombre_completo}}</h2>
      </div>
      
      <div class="detalles">
        <p>Por completar: <strong>{{nombre_evento}}</strong></p>
        <p>Duración: <strong>{{duracion}}</strong></p>
        <p>Fecha: <strong>{{fecha_emision_larga}}</strong></p>
      </div>
    </div>
    
    <div class="firmas-modernas">
      <div class="firmante">
        <div class="linea"></div>
        <p><strong>{{responsable_nombre}}</strong></p>
        <p>{{responsable_cargo}}</p>
      </div>
    </div>
  </div>
</div>

<style>
.diploma-marco-moderno {
  background: linear-gradient(135deg, #1e3c72, #2a5298);
  color: white;
  min-height: 100vh;
  padding: 30px;
  font-family: 'Arial', sans-serif;
}

.contenedor-horizontal {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 30px;
  align-items: center;
  height: 100%;
  border: 3px solid rgba(255,255,255,0.3);
  padding: 40px;
  border-radius: 15px;
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
}

.logo-seccion {
  text-align: center;
}

.logo {
  width: 120px;
  height: 120px;
  border: 3px solid rgba(255,255,255,0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  font-weight: bold;
  background: rgba(255,255,255,0.1);
}

.contenido-principal {
  text-align: center;
}

.contenido-principal h1 {
  font-size: 42px;
  font-weight: 300;
  margin: 0 0 10px 0;
  letter-spacing: 2px;
}

.subtitulo {
  opacity: 0.9;
  margin: 0 0 30px 0;
}

.destinatario {
  margin: 30px 0;
}

.destinatario h2 {
  font-size: 32px;
  color: #4fc3f7;
  margin: 10px 0;
}

.detalles {
  background: rgba(255,255,255,0.1);
  padding: 20px;
  border-radius: 10px;
  margin: 20px 0;
}

.firmas-modernas {
  text-align: center;
}

.linea {
  border-top: 2px solid #4fc3f7;
  width: 150px;
  margin: 0 auto 10px;
}
</style>
    `,
    esPlantillaBase: true
  },
  {
    id: 'marco-simple',
    nombre: 'Marco Simple Elegante',
    descripcion: 'Diseño minimalista con marco sutil para certificados rápidos',
    categoria: 'certificados',
    orientacion: 'vertical',
    cuerpo: `
<div class="certificado-marco-simple">
  <div class="marco-sutil">
    <div class="contenido-simple">
      <h1>CERTIFICATE</h1>
      <div class="linea-divisoria"></div>
      
      <p>This certifies that</p>
      <h2>{{nombre_completo}}</h2>
      <p>has successfully completed</p>
      <p class="evento-destacado">{{nombre_evento}}</p>
      
      <div class="detalles-simples">
        <div>
          <span>Duration</span>
          <strong>{{duracion}}</strong>
        </div>
        <div>
          <span>Date</span>
          <strong>{{fecha_emision_corta}}</strong>
        </div>
      </div>
      
      <div class="firma-simple">
        <div class="linea-firma-simple"></div>
        <p><strong>{{responsable_nombre}}</strong></p>
        <p>{{responsable_cargo}}</p>
      </div>
    </div>
  </div>
</div>

<style>
.certificado-marco-simple {
  min-height: 100vh;
  padding: 40px;
  font-family: 'Inter', sans-serif;
  background: #f8f9fa;
}

.marco-sutil {
  border: 2px solid #3f51b5;
  padding: 50px;
  background: white;
  height: 100%;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.contenido-simple {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

h1 {
  font-size: 36px;
  font-weight: 300;
  color: #333;
  margin: 0 0 20px 0;
  letter-spacing: 4px;
}

.linea-divisoria {
  width: 100px;
  height: 3px;
  background: #3f51b5;
  margin: 0 auto 40px;
}

h2 {
  font-size: 28px;
  color: #3f51b5;
  margin: 20px 0;
  padding: 20px 0;
  border-top: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
}

.evento-destacado {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin: 25px 0;
}

.detalles-simples {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin: 40px 0;
  text-align: center;
}

.detalles-simples span {
  display: block;
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.detalles-simples strong {
  font-size: 18px;
  color: #333;
}

.firma-simple {
  margin-top: 60px;
}

.linea-firma-simple {
  border-top: 2px solid #3f51b5;
  width: 200px;
  margin: 0 auto 15px;
}
</style>
    `,
    esPlantillaBase: true
  }
];

// =============================================
// VARIABLES DISPONIBLES
// =============================================

const VARIABLES_DISPONIBLES = [
  { nombre: 'Nombre Completo', variable: '{{nombre_completo}}' },
  { nombre: 'DNI', variable: '{{dni}}' },
  { nombre: 'Evento/Curso', variable: '{{nombre_evento}}' },
  { nombre: 'Duración', variable: '{{duracion}}' },
  { nombre: 'Fecha Inicio', variable: '{{fecha_inicio}}' },
  { nombre: 'Fecha Fin', variable: '{{fecha_fin}}' },
  { nombre: 'Fecha Emisión Larga', variable: '{{fecha_emision_larga}}' },
  { nombre: 'Fecha Emisión Corta', variable: '{{fecha_emision_corta}}' },
  { nombre: 'Empresa', variable: '{{empresa_nombre}}' },
  { nombre: 'RUC Empresa', variable: '{{empresa_ruc}}' },
  { nombre: 'Responsable', variable: '{{responsable_nombre}}' },
  { nombre: 'Cargo Responsable', variable: '{{responsable_cargo}}' },
  { nombre: 'Firmante 2', variable: '{{firmante_2_nombre}}' },
  { nombre: 'Cargo Firmante 2', variable: '{{firmante_2_cargo}}' },
  { nombre: 'ID Certificado', variable: '{{id_certificado}}' },
  { nombre: 'Link QR', variable: '{{qr_link}}' }
];

// =============================================
// COMPONENTE PRINCIPAL UNIFICADO
// =============================================

export default function EditorPlantillaSuperAdmin() {
  const { id } = useParams();
  const esEdicion = Boolean(id);

  // Estado principal
  const [plantilla, setPlantilla] = useState({
    nombre: esEdicion ? `Plantilla ${id}` : 'Mi Nueva Plantilla',
    cuerpo: PLANTILLAS_BASE[0].cuerpo,
    categoria: 'certificados',
    orientacion: 'vertical',
    esPublica: true,
    imagenFondo: null,
    imagenFirma: null,
    imagenFirma2: null
  });

  const [vistaActual, setVistaActual] = useState('editor');
  const previewRef = useRef(null);

  // Funciones principales
  const actualizarCampo = (campo, valor) => {
    setPlantilla(prev => ({ ...prev, [campo]: valor }));
  };

  const copiarVariable = (variable) => {
    navigator.clipboard.writeText(variable);
  };

  const usarPlantillaBase = (plantillaBase) => {
    setPlantilla(prev => ({
      ...prev,
      cuerpo: plantillaBase.cuerpo,
      orientacion: plantillaBase.orientacion,
      categoria: plantillaBase.categoria
    }));
  };

  const handleFileChange = (event, tipoImagen) => {
    const file = event.target.files[0];
    if (!file || !file.type.startsWith('image/')) {
      alert('Por favor, selecciona un archivo de imagen válido');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => actualizarCampo(tipoImagen, reader.result);
    reader.readAsDataURL(file);
  };

  const guardarPlantilla = () => {
    console.log('Guardando plantilla:', plantilla);
    alert(`✅ Plantilla "${plantilla.nombre}" guardada exitosamente\n\nLos administradores ahora podrán usar esta plantilla base.`);
  };

  // Componente auxiliar para campos de imagen
  const CampoImagen = ({ id, label, icon: Icon, imagen, onChange }) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <label htmlFor={id} className="cursor-pointer flex justify-center px-4 pt-4 pb-5 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400">
        <span className="text-center">
          <Icon className="mx-auto h-6 w-6 text-gray-400"/> 
          <span className="text-sm text-blue-600 hover:text-blue-500 block mt-1">
            {imagen ? 'Cambiar archivo' : 'Subir archivo'}
          </span>
        </span>
      </label>
      <input type="file" id={id} onChange={onChange} className="sr-only" accept="image/*"/>
      {imagen && <img src={imagen} alt={`Preview ${label}`} className="mt-2 h-16 border rounded mx-auto" />}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Principal */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <PencilSquareIcon className="w-6 h-6 text-blue-600" />
                {esEdicion ? 'Editar Plantilla Base' : 'Crear Plantilla Base'}
              </h1>
              <p className="text-gray-600 mt-1">
                {esEdicion ? 
                  'Modifica la plantilla para que los administradores la usen' : 
                  'Crea una plantilla con marcos para que los administradores la personalicen'
                }
              </p>
            </div>
            
            <div className="flex gap-3">
              <Link
                to="/super/plantillas"
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </Link>
              <button
                onClick={guardarPlantilla}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {esEdicion ? 'Actualizar' : 'Guardar'} Plantilla
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* ===== PANEL LATERAL ===== */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Plantillas Base */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <DocumentDuplicateIcon className="w-5 h-5 text-blue-600" />
                Plantillas con Marcos
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Usa estas plantillas base como punto de partida
              </p>
              
              <div className="space-y-3">
                {PLANTILLAS_BASE.map((plantillaBase) => (
                  <button
                    key={plantillaBase.id}
                    onClick={() => usarPlantillaBase(plantillaBase)}
                    className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                  >
                    <div className="font-medium text-gray-800 group-hover:text-blue-700">
                      {plantillaBase.nombre}
                    </div>
                    <div className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {plantillaBase.descripcion}
                    </div>
                    <div className="text-xs text-blue-600 mt-2 font-medium">
                      Usar esta plantilla →
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Variables */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <ClipboardIcon className="w-5 h-5 text-green-600" />
                Variables Disponibles
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                Clic para copiar en el editor
              </p>
              
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {VARIABLES_DISPONIBLES.map((variable) => (
                  <button
                    key={variable.variable}
                    onClick={() => copiarVariable(variable.variable)}
                    className="w-full flex items-center justify-between p-2 text-sm border border-gray-200 rounded hover:bg-gray-50 transition-colors group"
                  >
                    <span className="text-gray-700 group-hover:text-gray-900">
                      {variable.nombre}
                    </span>
                    <ClipboardIcon className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                  </button>
                ))}
              </div>
            </div>

            {/* Configuración Rápida */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <CogIcon className="w-5 h-5 text-purple-600" />
                Configuración
              </h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Orientación
                  </label>
                  <div className="flex gap-4">
                    {['vertical', 'horizontal'].map((orient) => (
                      <label key={orient} className="flex items-center">
                        <input
                          type="radio"
                          checked={plantilla.orientacion === orient}
                          onChange={() => actualizarCampo('orientacion', orient)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">
                          {orient}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={plantilla.esPublica}
                      onChange={(e) => actualizarCampo('esPublica', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Disponible para administradores
                    </span>
                  </label>
                  <p className="text-xs text-gray-500 mt-1 ml-6">
                    Los admins podrán ver y usar esta plantilla
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ===== ÁREA PRINCIPAL ===== */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm">
              
              {/* Barra de Navegación */}
              <div className="border-b">
                <nav className="flex overflow-x-auto">
                  <button
                    onClick={() => setVistaActual('configuracion')}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap ${
                      vistaActual === 'configuracion' 
                        ? 'border-b-2 border-blue-600 text-blue-600' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <CogIcon className="w-4 h-4" />
                    Configuración
                  </button>
                  <button
                    onClick={() => setVistaActual('editor')}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap ${
                      vistaActual === 'editor' 
                        ? 'border-b-2 border-blue-600 text-blue-600' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <CodeBracketIcon className="w-4 h-4" />
                    Editor
                  </button>
                  <button
                    onClick={() => setVistaActual('preview')}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap ${
                      vistaActual === 'preview' 
                        ? 'border-b-2 border-blue-600 text-blue-600' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <EyeIcon className="w-4 h-4" />
                    Vista Previa
                  </button>
                </nav>
              </div>

              {/* Contenido de la Vista Actual */}
              <div className="p-6">
                {vistaActual === 'configuracion' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre de la Plantilla
                      </label>
                      <input
                        type="text"
                        value={plantilla.nombre}
                        onChange={(e) => actualizarCampo('nombre', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ej: Certificado de Participación con Marco Dorado"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <CampoImagen 
                        id="fondo" 
                        label="Imagen de Fondo" 
                        icon={PhotoIcon}
                        imagen={plantilla.imagenFondo} 
                        onChange={(e) => handleFileChange(e, 'imagenFondo')}
                      />
                      <CampoImagen 
                        id="firma" 
                        label="Firma Principal" 
                        icon={PencilSquareIcon}
                        imagen={plantilla.imagenFirma} 
                        onChange={(e) => handleFileChange(e, 'imagenFirma')}
                      />
                      <CampoImagen 
                        id="firma2" 
                        label="Firma Secundaria" 
                        icon={IdentificationIcon}
                        imagen={plantilla.imagenFirma2} 
                        onChange={(e) => handleFileChange(e, 'imagenFirma2')}
                      />
                    </div>
                  </div>
                )}

                {vistaActual === 'editor' && (
                  <div className="border rounded-lg overflow-hidden">
                    <ReactQuill
                      theme="snow"
                      value={plantilla.cuerpo}
                      onChange={(valor) => actualizarCampo('cuerpo', valor)}
                      modules={{
                        toolbar: [
                          [{ 'header': [1, 2, 3, false] }],
                          ['bold', 'italic', 'underline'],
                          [{'list': 'ordered'}, {'list': 'bullet'}],
                          ['link', 'image'],
                          [{'align': []}],
                          ['clean']
                        ]
                      }}
                      className="h-96"
                    />
                  </div>
                )}

                {vistaActual === 'preview' && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <h3 className="font-semibold text-gray-800 text-lg">Vista Previa</h3>
                      <p className="text-gray-600">
                        Así verán los administradores tu plantilla base
                      </p>
                    </div>
                    
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                      <div 
                        ref={previewRef}
                        className="bg-white mx-auto shadow-lg"
                        style={{ 
                          width: plantilla.orientacion === 'horizontal' ? '297mm' : '210mm',
                          height: plantilla.orientacion === 'horizontal' ? '210mm' : '297mm',
                          minHeight: '400px'
                        }}
                      >
                        <div dangerouslySetInnerHTML={{ __html: plantilla.cuerpo }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Información para SuperAdmin */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                💡 Información para SuperAdmin
              </h4>
              <div className="text-sm text-blue-700 space-y-1">
                <p>• Estás creando una <strong>plantilla base</strong> con marcos profesionales</p>
                <p>• Los <strong>administradores</strong> podrán seleccionar esta plantilla</p>
                <p>• Ellos podrán <strong>personalizarla</strong> con sus logos y colores</p>
                <p>• Las <strong>variables</strong> se llenarán automáticamente con sus datos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}