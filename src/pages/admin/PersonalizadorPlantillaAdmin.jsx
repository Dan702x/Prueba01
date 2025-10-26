import React, { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeftIcon, PhotoIcon, PencilSquareIcon, IdentificationIcon, ArrowUpOnSquareIcon } from '@heroicons/react/24/outline';

const plantillaData = {
  nombre: "Plantilla Corporativa Global",
  textoBase: `
    <h1 class="certificate-title text-4xl font-bold mb-4 text-center">CERTIFICADO</h1>
    <p class="certificate-body text-lg mb-4 text-center">Se otorga el presente certificado a:</p>
    <h2 class="certificate-recipient text-4xl font-bold mb-6 text-center">{{nombre_completo}}</h2>
    <p class="certificate-body text-base max-w-2xl mx-auto mb-4 text-center">
      Por su destacada participación en calidad de <strong>{{calidad_participacion}}</strong> en el evento <strong>{{nombre_evento}}</strong>,
      realizado del {{fecha_inicio}} al {{fecha_fin}} con una duración de {{duracion}}.
    </p>
    <p class="certificate-body text-sm text-gray-500 text-center">
      Emitido en {{lugar_evento}}, el {{fecha_emision_larga}}.
    </p>
  `,
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
      { id: 'bg-waves', nombre: 'Olas Azules', url: 'https://placehold.co/840x1188/00416A/E8E8E8?text=Fondo+Olas', thumb: 'https://placehold.co/150x212/00416A/E8E8E8?text=Olas' },
      { id: 'bg-abstract', nombre: 'Abstracto Gris', url: 'https://placehold.co/840x1188/BDBDBD/424242?text=Fondo+Abstracto', thumb: 'https://placehold.co/150x212/BDBDBD/424242?text=Gris' },
      { id: 'bg-geo', nombre: 'Geométrico Dorado', url: 'https://placehold.co/840x1188/D4AF37/222222?text=Fondo+Geométrico', thumb: 'https://placehold.co/150x212/D4AF37/222222?text=Dorado' },
    ]
  }
};


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


export default function PersonalizadorPlantillaAdmin() {
  const { id } = useParams();

  const [logo, setLogo] = useState(null);
  const [firma1, setFirma1] = useState(null);
  const [firma2, setFirma2] = useState(null);
  const [orientacion, setOrientacion] = useState('vertical');
  const [tema, setTema] = useState(plantillaData.opciones.temas[0].id);
  const [fuente, setFuente] = useState(plantillaData.opciones.fuentes[0].id);
  const [fondo, setFondo] = useState(plantillaData.opciones.fondos[0].id);

  const handleFileChange = (e, setter) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setter(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const certificateStyles = useMemo(() => {
    const selectedTheme = plantillaData.opciones.temas.find(t => t.id === tema);
    const selectedFont = plantillaData.opciones.fuentes.find(f => f.id === fuente);
    const selectedFondo = plantillaData.opciones.fondos.find(f => f.id === fondo);
    
    let styles = {};
    if (selectedTheme) styles = { ...styles, ...Object.fromEntries(selectedTheme.value.split(';').filter(Boolean).map(s => s.split(':').map(p => p.trim()))) };
    if (selectedFont) styles = { ...styles, ...Object.fromEntries(selectedFont.value.split(';').filter(Boolean).map(s => s.split(':').map(p => p.trim()))) };
    if (selectedFondo && selectedFondo.url !== 'none') {
        styles.backgroundImage = `url(${selectedFondo.url})`;
    } else {
        styles.backgroundImage = 'none';
    }

    return styles;
  }, [tema, fuente, fondo]);


  const handleSave = () => {
    const personalizacion = {
      plantillaId: id,
      logo: logo ? 'logo_data_url...' : 'no-logo',
      firma1: firma1 ? 'firma1_data_url...' : 'no-firma1',
      firma2: firma2 ? 'firma2_data_url...' : 'no-firma2',
      orientacion,
      tema,
      fuente,
      fondo,
    };
    console.log('Guardando:', personalizacion);
    alert(`Guardando personalización para la plantilla ${id}.\n\nOrientación: ${orientacion}\nTema: ${tema}\nFuente: ${fuente}\nFondo: ${fondo}\n\nRevisa la consola para ver el objeto completo.`);
  };


  return (
    <div className="space-y-6">
      <DynamicStyles styles={certificateStyles} />
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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <aside className="lg:col-span-1 bg-white p-6 rounded-lg shadow-lg h-fit sticky top-6">
          <h2 className="text-xl font-bold mb-6 border-b pb-2 text-gray-700">Opciones de Estilo</h2>
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Logo de la Empresa</label>
              <input id="logo-upload" type="file" accept="image/*" className="sr-only" onChange={e => handleFileChange(e, setLogo)} />
              <label htmlFor="logo-upload" className="cursor-pointer mt-1 flex justify-center items-center gap-2 px-4 py-2 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 text-sm text-blue-600"> <PhotoIcon className="w-5 h-5 text-gray-400"/> {logo ? 'Cambiar logo' : 'Subir logo'} </label>
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Firma 1</label>
              <input id="firma1-upload" type="file" accept="image/*" className="sr-only" onChange={e => handleFileChange(e, setFirma1)} />
              <label htmlFor="firma1-upload" className="cursor-pointer mt-1 flex justify-center items-center gap-2 px-4 py-2 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 text-sm text-blue-600"> <PencilSquareIcon className="w-5 h-5 text-gray-400"/> {firma1 ? 'Cambiar firma 1' : 'Subir firma 1'} </label>
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Firma 2</label>
              <input id="firma2-upload" type="file" accept="image/*" className="sr-only" onChange={e => handleFileChange(e, setFirma2)} />
              <label htmlFor="firma2-upload" className="cursor-pointer mt-1 flex justify-center items-center gap-2 px-4 py-2 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 text-sm text-blue-600"> <IdentificationIcon className="w-5 h-5 text-gray-400"/> {firma2 ? 'Cambiar firma 2' : 'Subir firma 2'} </label>
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Orientación</label>
            <div className="flex gap-4">
              {plantillaData.opciones.orientaciones.map(o => (
                <label key={o} className="flex items-center"><input type="radio" name="orientacion" value={o} checked={orientacion === o} onChange={() => setOrientacion(o)} className="form-radio"/><span className="ml-2 capitalize">{o}</span></label>
              ))}
            </div>
          </div>
          {['temas', 'fuentes', 'fondos'].map(tipo => (
            <div key={tipo} className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">{tipo}</label>
              <div className={tipo === 'fondos' ? "grid grid-cols-3 gap-2" : "flex flex-col gap-1"}>
                {plantillaData.opciones[tipo].map(opcion => (
                  <div key={opcion.id}>
                    <input type="radio" name={tipo} id={opcion.id} value={opcion.id} checked={(tipo === 'temas' && tema === opcion.id) || (tipo === 'fuentes' && fuente === opcion.id) || (tipo === 'fondos' && fondo === opcion.id)} onChange={() => tipo === 'temas' ? setTema(opcion.id) : (tipo === 'fuentes' ? setFuente(opcion.id) : setFondo(opcion.id))} className="sr-only"/>
                    <label htmlFor={opcion.id} className={`cursor-pointer block p-2 rounded-md border-2 transition-all ${((tipo === 'temas' && tema === opcion.id) || (tipo === 'fuentes' && fuente === opcion.id) || (tipo === 'fondos' && fondo === opcion.id)) ? 'border-blue-500 bg-blue-50' : 'border-transparent hover:bg-gray-100'}`}>
                      {tipo === 'fondos' ? (
                        opcion.thumb === 'none' ? <div className="h-20 flex items-center justify-center text-xs bg-gray-50 border-2 border-dashed rounded">Sin Fondo</div> : <img src={opcion.thumb} alt={opcion.nombre} className="h-20 w-full object-cover rounded" />
                      ) : <span className="text-sm">{opcion.nombre}</span>}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </aside>
        
        <main className="lg:col-span-2">
            <div className={`bg-white rounded-lg shadow-2xl mx-auto transition-all duration-300 ease-in-out ${orientacion === 'horizontal' ? 'aspect-[1.414/1] max-w-4xl' : 'aspect-[1/1.414] max-w-xl'}`} style={{ backgroundImage: certificateStyles.backgroundImage }}>
                <div className="bg-white/80 backdrop-blur-sm p-8 h-full flex flex-col">
                    <header className="flex justify-between items-start mb-8">
                        <img id="logo-preview" src={logo || 'https://placehold.co/200x80/f1f1f1/ccc?text=Logo'} alt="Logo" className="h-16 max-w-xs object-contain" />
                        <span className="text-xs text-gray-400">ID: {'{{id_certificado}}'}</span>
                    </header>
                    <section className="flex-grow flex flex-col justify-center" dangerouslySetInnerHTML={{ __html: plantillaData.textoBase.replace(/{{(.*?)}}/g, '<span class="bg-yellow-200/50 px-1 rounded">{{$1}}</span>') }} />
                    <footer className="mt-auto flex justify-around items-end gap-8 pt-8">
                        <div className="text-center w-1/2">
                            <img id="signature1-preview" src={firma1 || 'https://placehold.co/250x100/f1f1f1/ccc?text=Firma+1'} alt="Firma 1" className="h-16 mx-auto object-contain mb-1" />
                            <hr className="signature-line border-t-2 w-full max-w-xs mx-auto mb-1" />
                            <p className="signature-text text-xs font-bold">{'{{firmante_1_nombre}}'}</p>
                            <p className="text-xs text-gray-500">{'{{firmante_1_cargo}}'}</p>
                        </div>
                        <div className="text-center w-1/2">
                            <img id="signature2-preview" src={firma2 || 'https://placehold.co/250x100/f1f1f1/ccc?text=Firma+2'} alt="Firma 2" className="h-16 mx-auto object-contain mb-1" />
                            <hr className="signature-line border-t-2 w-full max-w-xs mx-auto mb-1" />
                            <p className="signature-text text-xs font-bold">{'{{firmante_2_nombre}}'}</p>
                            <p className="text-xs text-gray-500">{'{{firmante_2_cargo}}'}</p>
                        </div>
                    </footer>
                </div>
            </div>
        </main>
      </div>
    </div>
  );
}