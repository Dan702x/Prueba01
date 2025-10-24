import React, { useState, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
    EyeIcon, 
    CodeBracketIcon, 
    ClipboardIcon, 
    ArrowDownTrayIcon, 
    PhotoIcon, 
    PencilSquareIcon,
    CogIcon,
    IdentificationIcon
} from '@heroicons/react/24/outline';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const variablesDisponibles = [
  { nombre: 'Nombre Completo', var: '{{nombre_completo}}' },
  { nombre: 'DNI', var: '{{dni}}' },
  { nombre: 'Puesto (para Trab.)', var: '{{puesto}}' },
  { nombre: 'Área (para Trab.)', var: '{{area}}' },
  { nombre: 'Carrera (para Prac.)', var: '{{carrera}}' },
  { nombre: 'Nombre Evento/Curso', var: '{{nombre_evento}}' },
  { nombre: 'Duración (ej: 16 horas)', var: '{{duracion}}' },
  { nombre: 'Calidad (ej: Participante)', var: '{{calidad_participacion}}' },
  { nombre: 'Lugar del Evento', var: '{{lugar_evento}}' },
  { nombre: 'Lista de Funciones (HTML)', var: '{{lista_funciones}}' },
  { nombre: 'Fecha Inicio', var: '{{fecha_inicio}}' },
  { nombre: 'Fecha Fin', var: '{{fecha_fin}}' },
  { nombre: 'Fecha Emisión (Larga)', var: '{{fecha_emision_larga}}' },
  { nombre: 'Fecha Emisión (Corta)', var: '{{fecha_emision_corta}}' },
  { nombre: 'Empresa Nombre', var: '{{empresa_nombre}}' },
  { nombre: 'RUC Empresa', var: '{{empresa_ruc}}' },
  { nombre: 'Dirección Empresa', var: '{{empresa_direccion}}' },
  { nombre: 'Responsable Nombre', var: '{{responsable_nombre}}' },
  { nombre: 'Responsable Cargo', var: '{{responsable_cargo}}' },
  { nombre: 'Firmante 2 Nombre', var: '{{firmante_2_nombre}}' },
  { nombre: 'Firmante 2 Cargo', var: '{{firmante_2_cargo}}' },
  { nombre: 'ID Certificado', var: '{{id_certificado}}' },
  { nombre: 'Link QR (URL)', var: '{{qr_link}}' },
  { nombre: 'N° Resolución', var: '{{resolucion_numero}}' },
];

const textoEjemplo = `<p style="text-align: center;">Se otorga el presente certificado a:</p><h1 style="text-align: center;"><strong>{{nombre_completo}}</strong></h1><p>Por su destacada participación en calidad de <strong>{{calidad_participacion}}</strong> en el <strong>{{nombre_evento}}</strong>, realizado del {{fecha_inicio}} al {{fecha_fin}} con una duración de {{duracion}}.</p><p><br></p><p>Emitido en {{lugar_evento}}, el {{fecha_emision_larga}}.</p>`;

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline'],
    [{'list': 'ordered'}, {'list': 'bullet'}],
    ['link', 'image'],
    [{'align': [] }], ['clean']
  ],
};

export default function EditorPlantillaSuperAdmin() {
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [nombrePlantilla, setNombrePlantilla] = useState(isEditing ? `Plantilla Global ${id}` : 'Nueva Plantilla Global');
  const [cuerpoPlantilla, setCuerpoPlantilla] = useState(textoEjemplo);
  const [orientacion, setOrientacion] = useState('vertical');
  const [imagenFondo, setImagenFondo] = useState(null);
  const [imagenFirma, setImagenFirma] = useState(null);
  const [imagenFirma2, setImagenFirma2] = useState(null);
  const [tabActual, setTabActual] = useState('configuracion');
  const previewRef = useRef(null);

  const copiarVariable = (variable) => {
    navigator.clipboard.writeText(variable);
  };

  const handleFileChange = (event, setImageState) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setImageState(reader.result); };
      reader.readAsDataURL(file);
    }
  };

  const descargarPdf = () => {
    if (!previewRef.current) {
        alert("Error: No se encontró el elemento de previsualización.");
        return;
      }
      console.log("Iniciando descarga PDF...");
      const elementToCapture = previewRef.current;
      const scale = 2; 
      const originalOverflow = elementToCapture.style.overflow;
      elementToCapture.style.overflow = 'hidden';

      html2canvas(elementToCapture, {
        scale: scale,
        useCORS: true, 
        logging: true, 
        width: elementToCapture.scrollWidth, 
        height: elementToCapture.scrollHeight,
        windowWidth: elementToCapture.scrollWidth,
        windowHeight: elementToCapture.scrollHeight
        }).then((canvas) => {
        console.log("Canvas generado.");
        elementToCapture.style.overflow = originalOverflow;
        try {
          const imgData = canvas.toDataURL('image/png');
          console.log("Imagen DataURL creada.");
          const pdfOrientation = orientacion === 'horizontal' ? 'l' : 'p';
          const pdfWidth = orientacion === 'horizontal' ? 297 : 210;
          const pdfHeight = orientacion === 'horizontal' ? 210 : 297;
          const pdf = new jsPDF(pdfOrientation, 'mm', [pdfWidth, pdfHeight]);
          console.log(`PDF creado (${pdfOrientation}, ${pdfWidth}x${pdfHeight}mm).`);

          pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          console.log("Imagen añadida al PDF.");

          pdf.save(`${nombrePlantilla || 'plantilla'}.pdf`);
          console.log("PDF guardado.");
        } catch (pdfError) {
          console.error("Error específico de jsPDF:", pdfError);
          alert("Hubo un error al generar el PDF con jsPDF. Revisa la consola.");
        }
        }).catch(err => {
        elementToCapture.style.overflow = originalOverflow;
        console.error("Error con html2canvas:", err);
        alert("Hubo un error al capturar la previsualización con html2canvas. Revisa la consola.");
        });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg space-y-6">

      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <PencilSquareIcon className="w-7 h-7 mr-2 text-blue-600"/>
          {isEditing ? `Editando Plantilla: ${nombrePlantilla}` : 'Crear Nueva Plantilla Global'}
        </h1>
        <div className="flex gap-2">
          <Link to="/superadmin/plantillas" className="bg-white text-gray-700 px-5 py-2 rounded-md border border-gray-300 hover:bg-gray-50">
            Cancelar
          </Link>
          <button className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 shadow-sm">
            {isEditing ? 'Actualizar Plantilla' : 'Guardar Plantilla'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 space-y-4">

          <div className="border-b border-gray-200">
            <nav className="flex gap-4">
              
              <button 
                onClick={() => setTabActual('configuracion')} 
                className={`tab-button ${tabActual === 'configuracion' ? 'active' : ''}`}>
                <CogIcon className="w-5 h-5"/> Configuración
              </button>
              
              <button 
                onClick={() => setTabActual('editor')} 
                className={`tab-button ${tabActual === 'editor' ? 'active' : ''}`}>
                <CodeBracketIcon className="w-5 h-5"/> Editor
              </button>
              
              <button 
                onClick={() => setTabActual('preview')} 
                className={`tab-button ${tabActual === 'preview' ? 'active' : ''}`}>
                <EyeIcon className="w-5 h-5"/> Previsualizar
              </button>
              
            </nav>
          </div>

          {tabActual === 'configuracion' && (
            <div className="space-y-4 pt-4">
          
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nombre" className="label-estilo">Nombre Plantilla</label>
                  <input type="text" id="nombre" value={nombrePlantilla} onChange={e => setNombrePlantilla(e.target.value)} placeholder="Ej: Certificado Global" className="input-estilo" />
                </div>
                <div>
                  <label className="label-estilo">Orientación</label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center"><input type="radio" name="orientacion" value="vertical" checked={orientacion === 'vertical'} onChange={() => setOrientacion('vertical')} className="radio-estilo"/><span className="ml-2">Vertical</span></label>
                    <label className="flex items-center"><input type="radio" name="orientacion" value="horizontal" checked={orientacion === 'horizontal'} onChange={() => setOrientacion('horizontal')} className="radio-estilo"/><span className="ml-2">Horizontal</span></label>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="fondo" className="label-estilo">Imagen de Fondo (A4)</label>
                  <label htmlFor="fondo" className="file-input-label"><PhotoIcon className="w-5 h-5 mr-2"/> {imagenFondo ? 'Cambiar' : 'Subir'}</label>
                  <input type="file" id="fondo" onChange={(e) => handleFileChange(e, setImagenFondo)} className="sr-only" accept="image/*"/>
                  {imagenFondo && <img src={imagenFondo} alt="Fondo" className="mt-2 h-10 border rounded"/>}
                </div>
                <div>
                  <label htmlFor="firma" className="label-estilo">Firma 1 (Principal)</label>
                  <label htmlFor="firma" className="file-input-label"><PencilSquareIcon className="w-5 h-5 mr-2"/> {imagenFirma ? 'Cambiar' : 'Subir'}</label>
                  <input type="file" id="firma" onChange={(e) => handleFileChange(e, setImagenFirma)} className="sr-only" accept="image/*"/>
                  {imagenFirma && <img src={imagenFirma} alt="Firma" className="mt-2 h-10 border rounded"/>}
                </div>
                <div>
                  <label htmlFor="firma2" className="label-estilo">Firma 2 (Opcional)</label>
                  <label htmlFor="firma2" className="file-input-label"><IdentificationIcon className="w-5 h-5 mr-2"/> {imagenFirma2 ? 'Cambiar' : 'Subir'}</label>
                  <input type="file" id="firma2" onChange={(e) => handleFileChange(e, setImagenFirma2)} className="sr-only" accept="image/*"/>
                  {imagenFirma2 && <img src={imagenFirma2} alt="Firma 2" className="mt-2 h-10 border rounded"/>}
                </div>
              </div>
              
            </div>
          )}
          
          {tabActual === 'editor' && (
            <ReactQuill theme="snow" value={cuerpoPlantilla} onChange={setCuerpoPlantilla} modules={quillModules} className="h-96 mb-12"/>
          )}

          {tabActual === 'preview' && (
            <div className="overflow-auto border border-gray-300" style={{ maxHeight: '80vh' }}>
              <div
                ref={previewRef}
                className={`preview-container ${orientacion}`}
                style={{
                  backgroundImage: imagenFondo ? `url(${imagenFondo})` : 'none',
                  width: orientacion === 'horizontal' ? '297mm' : '210mm',
                  height: orientacion === 'horizontal' ? '210mm' : '297mm',
                  margin: 'auto'
                }}
              >
                <div
                  className="prose max-w-none p-8" 
                  dangerouslySetInnerHTML={{ __html: cuerpoPlantilla.replace(/{{(.*?)}}/g, '<span class="variable-highlight">{{$1}}</span>') }}
                />
                {imagenFirma && (
                  <img src={imagenFirma} alt="Firma" className="firma-preview"/>
                )}
                {imagenFirma2 && (
                  <img src={imagenFirma2} alt="Firma 2" className="firma-preview-2"/>
                )}
              </div>
            </div>
          )}

          {tabActual === 'preview' && (
            <div className="mt-4 text-right">
              <button onClick={descargarPdf} className="download-button"><ArrowDownTrayIcon className="w-5 h-5" /> Descargar Preview PDF</button>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-sm">
              <h2 className="font-semibold text-gray-800 mb-3">Variables Disponibles</h2>
              <p className="text-sm text-gray-600 mb-4">Clic para copiar.</p>
              <div className="flex flex-wrap gap-2">
                {variablesDisponibles.map((v) => ( <button key={v.var} onClick={() => copiarVariable(v.var)} title={`Copiar ${v.var}`} className="variable-button"><ClipboardIcon className="w-3 h-3" /> {v.nombre}</button>))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}