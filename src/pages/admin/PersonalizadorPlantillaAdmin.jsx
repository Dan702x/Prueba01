import React, { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeftIcon, PhotoIcon, PencilSquareIcon, IdentificationIcon, ArrowUpOnSquareIcon, PaintBrushIcon, SparklesIcon } from '@heroicons/react/24/outline';

// DATOS MOCK
const plantillaData = {
  nombre: "Plantilla Corporativa Global",
  textosIniciales: {
    titulo: "CERTIFICADO",
    linea1: "Se otorga el presente certificado a:",
    cuerpo: `Por su destacada participación en calidad de <strong>{{calidad_participacion}}</strong> en el evento <strong>{{nombre_evento}}</strong>,
    realizado del {{fecha_inicio}} al {{fecha_fin}} con una duración de {{duracion}}.`,
    footer: `Emitido en {{lugar_evento}}, el {{fecha_emision_larga}}.`
  },
  opciones: {
    orientaciones: ['vertical', 'horizontal'],
    temas: [
      { id: 'theme-corporate', nombre: 'Corporativo (Azul)', value: '--primary-color: #1e3a8a; --secondary-color: #1f2937;' },
      { id: 'theme-classic', nombre: 'Clásico (Negro/Gris)', value: '--primary-color: #1f2937; --secondary-color: #4b5563;' },
      { id: 'theme-elegant', nombre: 'Elegante (Dorado)', value: '--primary-color: #b45309; --secondary-color: #1f2937;' },
    ],
    fuentes: [
      { id: 'font-sans', nombre: 'Moderno (Sans Serif)', value: "--base-font: 'Lato', sans-serif; --display-font: 'Playfair Display', serif;" },
      { id: 'font-serif', nombre: 'Clásico (Serif)', value: "--base-font: 'Merriweather', serif; --display-font: 'Merriweather', serif;" },
    ],
    fondos: [
      { id: 'bg-none', nombre: 'Sin Fondo', url: 'none', thumb: 'none' },
      { id: 'bg-waves', nombre: 'Olas Azules', url: 'https://placehold.co/842x595/00416A/E8E8E8?text=Fondo+Olas', thumb: 'https://placehold.co/150x106/00416A/E8E8E8?text=Olas' },
      { id: 'bg-abstract', nombre: 'Abstracto Gris', url: 'https://placehold.co/842x595/BDBDBD/424242?text=Fondo+Abstracto', thumb: 'https://placehold.co/150x106/BDBDBD/424242?text=Gris' },
      { id: 'bg-geo', nombre: 'Geométrico Dorado', url: 'https://placehold.co/842x595/D4AF37/222222?text=Fondo+Geométrico', thumb: 'https://placehold.co/150x106/D4AF37/222222?text=Dorado' },
    ]
  }
};

// COMPONENTE DE ESTILOS DINÁMICOS
const DynamicStyles = ({ styles }) => (
  <style>{`
    :root {
      ${Object.entries(styles)
        .filter(([key]) => key.startsWith('--'))
        .map(([key, value]) => `${key}: ${value};`)
        .join('\n')}
    }
    .certificate-title, .certificate-recipient {
      font-family: var(--display-font);
      color: var(--primary-color);
    }
    .certificate-body {
      font-family: var(--base-font);
      color: var(--secondary-color);
    }
    .signature-line {
      border-color: var(--primary-color);
    }
    .signature-text {
        font-family: var(--base-font);
        color: var(--secondary-color);
    }
  `}</style>
);


// --- COMPONENTE PRINCIPAL ---
export default function PersonalizadorPlantillaAdmin() {
  const { id } = useParams();

  // ESTADOS
  const [logo, setLogo] = useState(null);
  const [firma1, setFirma1] = useState(null);
  const [firma2, setFirma2] = useState(null);
  const [orientacion, setOrientacion] = useState('vertical');
  const [tema, setTema] = useState(plantillaData.opciones.temas[0].id);
  const [fuente, setFuente] = useState(plantillaData.opciones.fuentes[0].id);
  const [fondo, setFondo] = useState(plantillaData.opciones.fondos[0].id);
  const [numFirmas, setNumFirmas] = useState(2);
  const [textos, setTextos] = useState(plantillaData.textosIniciales);
  const [primaryColor, setPrimaryColor] = useState('#1e3a8a');
  const [secondaryColor, setSecondaryColor] = useState('#1f2937');
  const [customFondo, setCustomFondo] = useState(null);
  const [customFondoName, setCustomFondoName] = useState('Subir fondo personalizado');

  // MANEJADORES DE EVENTOS
  const handleFileChange = (e, setter, nameSetter = null, defaultName = '') => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setter(reader.result);
      reader.readAsDataURL(file);
      if (nameSetter) nameSetter(file.name);
    }
  };
  const handleTemaChange = (id) => {
    setTema(id);
    const selectedTheme = plantillaData.opciones.temas.find(t => t.id === id);
    if (selectedTheme) {
      const styles = Object.fromEntries(selectedTheme.value.split(';').filter(Boolean).map(s => s.split(':').map(p => p.trim())));
      setPrimaryColor(styles['--primary-color'] || '#000000');
      setSecondaryColor(styles['--secondary-color'] || '#333333');
    }
  };
  const handleFondoChange = (id) => {
    setFondo(id);
    setCustomFondo(null);
    setCustomFondoName('Subir fondo personalizado');
  };
  const handleCustomFondoChange = (e) => {
    handleFileChange(e, setCustomFondo, setCustomFondoName, 'Subir fondo personalizado');
    setFondo('bg-none');
  };
  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setTextos(prev => ({ ...prev, [name]: value }));
  };
  const handleRestoreText = () => {
    setTextos(plantillaData.textosIniciales);
  };
  const certificateStyles = useMemo(() => {
    let styles = {
      '--primary-color': primaryColor,
      '--secondary-color': secondaryColor,
    };
    const selectedFont = plantillaData.opciones.fuentes.find(f => f.id === fuente);
    if (selectedFont) styles = { ...styles, ...Object.fromEntries(selectedFont.value.split(';').filter(Boolean).map(s => s.split(':').map(p => p.trim()))) };
    if (customFondo) {
      styles.backgroundImage = `url(${customFondo})`;
    } else {
      const selectedFondo = plantillaData.opciones.fondos.find(f => f.id === fondo);
      if (selectedFondo && selectedFondo.url !== 'none') {
          styles.backgroundImage = `url(${selectedFondo.url})`;
      } else {
          styles.backgroundImage = 'none';
      }
    }
    styles.backgroundSize = 'cover';
    styles.backgroundPosition = 'center';
    return styles;
  }, [primaryColor, secondaryColor, fuente, fondo, customFondo]);
  const handleSave = () => {
    const personalizacion = { plantillaId: id, logo, numFirmas, firma1, firma2, orientacion, tema, fuente, fondo: customFondo ? 'custom' : fondo, colores: { primary: primaryColor, secondary: secondaryColor }, textos };
    console.log('Guardando:', personalizacion);
    alert(`Guardando personalización. Revisa la consola para ver el objeto completo.`);
  };
  const isVertical = orientacion === 'vertical';
  const getOrientationClasses = (elementType) => {
    switch(elementType) {
      case 'container': return isVertical ? 'p-10' : 'p-6';
      case 'logo': return isVertical ? 'h-16' : 'h-12';
      case 'header': return isVertical ? 'mb-8' : 'mb-4';
      case 'title': return isVertical ? 'text-4xl mb-4' : 'text-3xl mb-2';
      case 'line1': return isVertical ? 'text-lg mb-4' : 'text-base mb-2';
      case 'recipient': return isVertical ? 'text-4xl mb-6' : 'text-3xl mb-4';
      case 'body': return isVertical ? 'text-base mb-4' : 'text-sm mb-2';
      case 'footerText': return isVertical ? 'text-sm' : 'text-xs';
      case 'footerContainer': return isVertical ? 'pt-8 mt-auto' : 'pt-4 mt-4';
      case 'firmaImg': return isVertical ? 'h-16' : 'h-12';
      default: return '';
    }
  };

  // --- RENDERIZADO (JSX Reestructurado) ---
  return (
    <div className="space-y-6">
      <DynamicStyles styles={certificateStyles} />
      
      {/* Cabecera Principal */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white p-4 rounded-lg shadow">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Personalizar Plantilla</h1>
          <p className="text-sm text-gray-500">{plantillaData.nombre} (ID: {id})</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/plantillas" className="bg-white text-gray-700 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 flex items-center gap-2">
            <ArrowLeftIcon className="w-5 h-5" /> Volver
          </Link>
          <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 shadow-sm flex items-center gap-2">
            <ArrowUpOnSquareIcon className="w-5 h-5" /> Guardar Personalización
          </button>
        </div>
      </div>
      
      {/* --- BARRA DE ESTILOS --- */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
            {/* Orientación */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Orientación</label>
              <div className="flex gap-4">
                {plantillaData.opciones.orientaciones.map(o => (
                  <label key={o} className="flex items-center"><input type="radio" name="orientacion" value={o} checked={orientacion === o} onChange={() => setOrientacion(o)} className="form-radio"/><span className="ml-2 capitalize text-sm">{o}</span></label>
                ))}
              </div>
            </div>
            {/* Temas y Fuentes */}
            <div className="md:col-span-1">
              <label htmlFor="tema-select" className="block text-sm font-medium text-gray-700">Tema</label>
              <select id="tema-select" value={tema} onChange={e => handleTemaChange(e.target.value)} className="w-full mt-1 border-gray-300 rounded-md shadow-sm text-sm">
                {plantillaData.opciones.temas.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
              </select>
              <label htmlFor="fuente-select" className="block text-sm font-medium text-gray-700 mt-2">Fuente</label>
              <select id="fuente-select" value={fuente} onChange={e => setFuente(e.target.value)} className="w-full mt-1 border-gray-300 rounded-md shadow-sm text-sm">
                {plantillaData.opciones.fuentes.map(f => <option key={f.id} value={f.id}>{f.nombre}</option>)}
              </select>
            </div>
            {/* Colores --- CORREGIDO --- */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Colores</label>
              <div className="flex gap-4">
                <div>
                  <label htmlFor="primary-color-picker" className="text-xs text-gray-500">Primario</label>
                  <input id="primary-color-picker" type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="w-full h-8 p-0.5 border border-gray-300 rounded-md cursor-pointer"/>
                </div>
                <div>
                  <label htmlFor="secondary-color-picker" className="text-xs text-gray-500">Secundario</label>
                  <input id="secondary-color-picker" type="color" value={secondaryColor} onChange={e => setSecondaryColor(e.target.value)} className="w-full h-8 p-0.5 border border-gray-300 rounded-md cursor-pointer"/>
                </div>
              </div>
            </div>
            {/* Fondos */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Fondos</label>
              <div className="flex gap-2 items-center">
                <div className="grid grid-cols-4 gap-2 flex-grow">
                  {plantillaData.opciones.fondos.map(opcion => (
                    <div key={opcion.id}>
                      <input type="radio" name="fondos" id={opcion.id} value={opcion.id} checked={fondo === opcion.id} onChange={() => handleFondoChange(opcion.id)} className="sr-only"/>
                      <label htmlFor={opcion.id} className={`cursor-pointer block rounded-md border-2 transition-all ${fondo === opcion.id ? 'border-blue-500' : 'border-transparent'}`}>
                        {opcion.thumb === 'none' ? <div className="h-16 flex items-center justify-center text-xs bg-gray-50 border-2 border-dashed rounded">Sin Fondo</div> : <img src={opcion.thumb} alt={opcion.nombre} className="h-16 w-full object-cover rounded" />}
                      </label>
                    </div>
                  ))}
                </div>
                <div className="pl-2">
                  <input id="custom-fondo-upload" type="file" accept="image/*" className="sr-only" onChange={handleCustomFondoChange} />
                  <label htmlFor="custom-fondo-upload" title="Subir fondo personalizado" className={`cursor-pointer flex items-center justify-center h-16 w-16 border-2 rounded-md transition-all ${customFondo ? 'border-blue-500' : 'border-gray-300 border-dashed hover:border-blue-400'}`}>
                    {customFondo ? <SparklesIcon className="w-8 h-8 text-blue-500" /> : <PhotoIcon className="w-8 h-8 text-gray-400" />}
                  </label>
                </div>
              </div>
            </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- PANEL DE CONTENIDO (IZQUIERDA) --- */}
        <aside className="lg:col-span-1 space-y-6 h-fit sticky top-6">
          {/* Panel de Archivos */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-6 border-b pb-2 text-gray-700">Archivos</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Logo de la Empresa</label>
                <input id="logo-upload" type="file" accept="image/*" className="sr-only" onChange={e => handleFileChange(e, setLogo)} />
                <label htmlFor="logo-upload" className="cursor-pointer mt-1 flex justify-center items-center gap-2 px-4 py-2 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 text-sm text-blue-600"> <PhotoIcon className="w-5 h-5 text-gray-400"/> {logo ? 'Cambiar logo' : 'Subir logo'} </label>
              </div>
              <div>
                <label htmlFor="num-firmas-select" className="block text-sm font-medium text-gray-700 mb-1">Número de Firmas</label>
                <select id="num-firmas-select" value={numFirmas} onChange={e => setNumFirmas(Number(e.target.value))} className="w-full mt-1 border-gray-300 rounded-md shadow-sm">
                  <option value={0}>0 Firmas</option>
                  <option value={1}>1 Firma</option>
                  <option value={2}>2 Firmas</option>
                </select>
              </div>
              {numFirmas > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Firma 1</label>
                  <input id="firma1-upload" type="file" accept="image/*" className="sr-only" onChange={e => handleFileChange(e, setFirma1)} />
                  <label htmlFor="firma1-upload" className="cursor-pointer mt-1 flex justify-center items-center gap-2 px-4 py-2 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 text-sm text-blue-600"> <PencilSquareIcon className="w-5 h-5 text-gray-400"/> {firma1 ? 'Cambiar firma 1' : 'Subir firma 1'} </label>
                </div>
              )}
              {numFirmas > 1 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Firma 2</label>
                  <input id="firma2-upload" type="file" accept="image/*" className="sr-only" onChange={e => handleFileChange(e, setFirma2)} />
                  <label htmlFor="firma2-upload" className="cursor-pointer mt-1 flex justify-center items-center gap-2 px-4 py-2 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 text-sm text-blue-600"> <IdentificationIcon className="w-5 h-5 text-gray-400"/> {firma2 ? 'Cambiar firma 2' : 'Subir firma 2'} </label>
                </div>
              )}
            </div>
          </div>
          {/* Panel de Textos */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-700">Editar Contenido</h2>
              <button onClick={handleRestoreText} className="text-xs font-medium text-blue-600 hover:text-blue-800">Restaurar</button>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="text-titulo" className="block text-sm font-medium text-gray-700">Título</label>
                <input type="text" name="titulo" id="text-titulo" value={textos.titulo} onChange={handleTextChange} className="w-full mt-1 border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label htmlFor="text-linea1" className="block text-sm font-medium text-gray-700">Línea 1 (Saludo)</label>
                <input type="text" name="linea1" id="text-linea1" value={textos.linea1} onChange={handleTextChange} className="w-full mt-1 border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label htmlFor="text-cuerpo" className="block text-sm font-medium text-gray-700">Cuerpo del Certificado</label>
                <textarea name="cuerpo" id="text-cuerpo" value={textos.cuerpo} onChange={handleTextChange} rows="5" className="w-full mt-1 border-gray-300 rounded-md shadow-sm" />
                <p className="text-xs text-gray-500 mt-1">Usa {'{{variable}}'} para los datos dinámicos.</p>
              </div>
              <div>
                <label htmlFor="text-footer" className="block text-sm font-medium text-gray-700">Pie de Página</label>
                <input type="text" name="footer" id="text-footer" value={textos.footer} onChange={handleTextChange} className="w-full mt-1 border-gray-300 rounded-md shadow-sm" />
              </div>
            </div>
          </div>
        </aside>
        
        {/* --- VISTA PREVIA (DERECHA) --- */}
        <main className="lg:col-span-2">
          <div className={`bg-white rounded-lg shadow-2xl mx-auto transition-all duration-300 ease-in-out ${orientacion === 'horizontal' ? 'aspect-[1.414/1] max-w-4xl' : 'aspect-[1/1.414] max-w-xl'}`} 
               style={{ backgroundImage: certificateStyles.backgroundImage, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className={`bg-white/80 backdrop-blur-sm h-full flex flex-col ${getOrientationClasses('container')}`}>
              <header className={`flex justify-between items-start ${getOrientationClasses('header')}`}>
                <img id="logo-preview" src={logo || 'https://placehold.co/200x80/f1f1f1/ccc?text=Logo'} alt="Logo" className={`max-w-xs object-contain ${getOrientationClasses('logo')}`} />
                <span className="text-xs text-gray-400">ID: {'{{id_certificado}}'}</span>
              </header>
              <section className="flex-grow flex flex-col justify-center text-center">
                <h1 className={`certificate-title font-bold ${getOrientationClasses('title')}`}>{textos.titulo}</h1>
                <p className={`certificate-body ${getOrientationClasses('line1')}`}>{textos.linea1}</p>
                
                {/* --- LÍNEA CORREGIDA --- */}
                <h2 className={`certificate-recipient font-bold ${getOrientationClasses('recipient')}`}>
                  <span className="bg-yellow-200/50 px-1 rounded">{'{{nombre_completo}}'}</span>
                </h2>
                
                <p 
                  className={`certificate-body max-w-2xl mx-auto ${getOrientationClasses('body')}`}
                  dangerouslySetInnerHTML={{ __html: textos.cuerpo.replace(/\n/g, '<br/>').replace(/{{(.*?)}}/g, '<span class="bg-yellow-200/50 px-1 rounded">{{$1}}</span>') }}
                />
                <p 
                  className={`certificate-body text-gray-500 ${getOrientationClasses('footerText')}`}
                  dangerouslySetInnerHTML={{ __html: textos.footer.replace(/\n/g, '<br/>').replace(/{{(.*?)}}/g, '<span class="bg-yellow-200/50 px-1 rounded">{{$1}}</span>') }}
                />
              </section>
              {numFirmas > 0 && (
                <footer className={`flex items-end gap-8 ${getOrientationClasses('footerContainer')} ${numFirmas === 1 ? 'justify-center' : 'justify-around'}`}>
                  <div className="text-center w-1/2 max-w-xs">
                    <img id="signature1-preview" src={firma1 || 'https://placehold.co/250x100/f1f1f1/ccc?text=Firma+1'} alt="Firma 1" className={`mx-auto object-contain mb-1 ${getOrientationClasses('firmaImg')}`} />
                    <hr className="signature-line border-t-2 w-full mx-auto mb-1" />
                    <p className="signature-text text-xs font-bold">{'{{firmante_1_nombre}}'}</p>
                    <p className="text-xs text-gray-500">{'{{firmante_1_cargo}}'}</p>
                  </div>
                  {numFirmas === 2 && (
                    <div className="text-center w-1/2 max-w-xs">
                      <img id="signature2-preview" src={firma2 || 'https://placehold.co/250x100/f1f1f1/ccc?text=Firma+2'} alt="Firma 2" className={`mx-auto object-contain mb-1 ${getOrientationClasses('firmaImg')}`} />
                      <hr className="signature-line border-t-2 w-full mx-auto mb-1" />
                      <p className="signature-text text-xs font-bold">{'{{firmante_2_nombre}}'}</p>
                      <p className="text-xs text-gray-500">{'{{firmante_2_cargo}}'}</p>
                    </div>
                  )}
                </footer>
              )}
            </div>
            </div>
        </main>
      </div>
    </div>
  );
}