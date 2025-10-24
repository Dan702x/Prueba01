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

// Variables y texto de ejemplo (sin cambios)
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
    // ... (función descargarPdf sin cambios) ...
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
          {/* --- ¡¡¡CORRECCIÓN AQUÍ!!! --- */}
          <Link 
            to="/super/plantillas" // Cambiado a /super/
            className="bg-white text-gray-700 px-5 py-2 rounded-md border border-gray-300 hover:bg-gray-50"
          >
            Cancelar
          </Link>
          <button className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 shadow-sm">
            {isEditing ? 'Actualizar Plantilla' : 'Guardar Plantilla'}
          </button>
        </div>
      </div>

      {/* --- Resto del componente (Grid, Tabs, Editor, Preview, Variables) sin cambios --- */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 space-y-4">

         <div className="border-b border-gray-200">
           <nav className="flex gap-4">
             
             <button 
               onClick={() => setTabActual('configuracion')} 
               className={`py-2 px-3 text-sm font-medium flex items-center gap-1 ${tabActual === 'configuracion' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
               <CogIcon className="w-5 h-5"/> Configuración
             </button>
             
             <button 
               onClick={() => setTabActual('editor')} 
               className={`py-2 px-3 text-sm font-medium flex items-center gap-1 ${tabActual === 'editor' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
               <CodeBracketIcon className="w-5 h-5"/> Editor
             </button>
             
             <button 
               onClick={() => setTabActual('preview')} 
               className={`py-2 px-3 text-sm font-medium flex items-center gap-1 ${tabActual === 'preview' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
               <EyeIcon className="w-5 h-5"/> Previsualizar
             </button>
             
           </nav>
         </div>

         {tabActual === 'configuracion' && (
           <div className="space-y-4 pt-4">
         
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                 <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">Nombre Plantilla</label>
                 <input type="text" id="nombre" value={nombrePlantilla} onChange={e => setNombrePlantilla(e.target.value)} placeholder="Ej: Certificado Global" className="form-input block w-full border-gray-300 rounded-md shadow-sm" />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Orientación</label>
                 <div className="flex gap-4 mt-2">
                   <label className="flex items-center"><input type="radio" name="orientacion" value="vertical" checked={orientacion === 'vertical'} onChange={() => setOrientacion('vertical')} className="form-radio"/><span className="ml-2">Vertical</span></label>
                   <label className="flex items-center"><input type="radio" name="orientacion" value="horizontal" checked={orientacion === 'horizontal'} onChange={() => setOrientacion('horizontal')} className="form-radio"/><span className="ml-2">Horizontal</span></label>
                 </div>
               </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div>
                 <label htmlFor="fondo" className="block text-sm font-medium text-gray-700 mb-1">Imagen de Fondo (A4)</label>
                 <label htmlFor="fondo" className="cursor-pointer mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400"><span className="space-y-1 text-center"><PhotoIcon className="mx-auto h-8 w-8 text-gray-400"/> <span className="text-sm text-blue-600 hover:text-blue-500"> {imagenFondo ? 'Cambiar archivo' : 'Subir archivo'}</span></span></label>
                 <input type="file" id="fondo" onChange={(e) => handleFileChange(e, setImagenFondo)} className="sr-only" accept="image/*"/>
                 {imagenFondo && <img src={imagenFondo} alt="Fondo Preview" className="mt-2 h-16 border rounded"/>}
               </div>
               <div>
                 <label htmlFor="firma" className="block text-sm font-medium text-gray-700 mb-1">Firma 1 (Principal)</label>
                  <label htmlFor="firma" className="cursor-pointer mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400"><span className="space-y-1 text-center"><PencilSquareIcon className="mx-auto h-8 w-8 text-gray-400"/> <span className="text-sm text-blue-600 hover:text-blue-500"> {imagenFirma ? 'Cambiar archivo' : 'Subir archivo'}</span></span></label>
                 <input type="file" id="firma" onChange={(e) => handleFileChange(e, setImagenFirma)} className="sr-only" accept="image/*"/>
                 {imagenFirma && <img src={imagenFirma} alt="Firma 1 Preview" className="mt-2 h-16 border rounded"/>}
               </div>
               <div>
                 <label htmlFor="firma2" className="block text-sm font-medium text-gray-700 mb-1">Firma 2 (Opcional)</label>
                  <label htmlFor="firma2" className="cursor-pointer mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400"><span className="space-y-1 text-center"><IdentificationIcon className="mx-auto h-8 w-8 text-gray-400"/> <span className="text-sm text-blue-600 hover:text-blue-500"> {imagenFirma2 ? 'Cambiar archivo' : 'Subir archivo'}</span></span></label>
                 <input type="file" id="firma2" onChange={(e) => handleFileChange(e, setImagenFirma2)} className="sr-only" accept="image/*"/>
                 {imagenFirma2 && <img src={imagenFirma2} alt="Firma 2 Preview" className="mt-2 h-16 border rounded"/>}
               </div>
             </div>
             
           </div>
         )}
         
         {tabActual === 'editor' && (
           <ReactQuill theme="snow" value={cuerpoPlantilla} onChange={setCuerpoPlantilla} modules={quillModules} className="h-96 mb-12"/>
         )}

         {tabActual === 'preview' && (
           <div className="overflow-auto border border-gray-300 bg-gray-50 p-4" style={{ maxHeight: 'calc(100vh - 200px)' }}> {/* Ajusta maxHeight según necesites */}
             <div
               ref={previewRef}
               className={`preview-page shadow-lg mx-auto bg-white ${orientacion === 'horizontal' ? 'w-[297mm] h-[210mm]' : 'w-[210mm] h-[297mm]'}`}
               style={{
                 backgroundImage: imagenFondo ? `url(${imagenFondo})` : 'none',
                 backgroundSize: 'cover',
                 backgroundPosition: 'center',
                 backgroundRepeat: 'no-repeat',
                 position: 'relative' // Necesario para posicionar firmas
               }}
             >
               {/* Contenido HTML */}
               <div
                 className="prose max-w-none p-12" // Ajusta padding según necesites 
                 dangerouslySetInnerHTML={{ __html: cuerpoPlantilla.replace(/{{(.*?)}}/g, '<span style="background-color: #fef9c3; padding: 0.1em 0.3em; border-radius: 3px;">{{$1}}</span>') }}
               />
               
               {/* Firmas posicionadas absolutamente */}
               {imagenFirma && (
                 <img src={imagenFirma} alt="Firma 1" style={{ position: 'absolute', bottom: '40px', left: '40px', maxHeight: '80px', maxWidth: '200px' }}/>
               )}
               {imagenFirma2 && (
                 <img src={imagenFirma2} alt="Firma 2" style={{ position: 'absolute', bottom: '40px', right: '40px', maxHeight: '80px', maxWidth: '200px' }}/>
               )}
             </div>
           </div>
         )}

         {tabActual === 'preview' && (
           <div className="mt-4 text-right">
             <button onClick={descargarPdf} className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors">
                 <ArrowDownTrayIcon className="w-5 h-5" /> Descargar Preview PDF
             </button>
           </div>
         )}
        </div>

        {/* --- Columna Derecha (Variables) --- */}
        <div className="lg:col-span-1">
         <div className="sticky top-6">
           <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-sm">
             <h2 className="font-semibold text-gray-800 mb-3">Variables Disponibles</h2>
             <p className="text-sm text-gray-600 mb-4">Clic para copiar.</p>
             <div className="flex flex-wrap gap-2">
               {variablesDisponibles.map((v) => ( 
                  <button 
                    key={v.var} 
                    onClick={() => copiarVariable(v.var)} 
                    title={`Copiar ${v.var}`} 
                    className="flex items-center gap-1 bg-white border border-gray-300 text-gray-700 text-xs px-2 py-1 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <ClipboardIcon className="w-3 h-3 text-gray-400" /> {v.nombre}
                  </button>
               ))}
             </div>
           </div>
         </div>
       </div>
      </div>
      
    </div>
  );
}
