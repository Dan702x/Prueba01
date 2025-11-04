import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
    ArrowLeftIcon, 
    PhotoIcon, 
    PencilSquareIcon, 
    IdentificationIcon, 
    ArrowUpOnSquareIcon, 
    PaintBrushIcon, 
    SparklesIcon,
    ClipboardIcon 
} from '@heroicons/react/24/outline';

// --- REQUEST 1: "Marcos" con HTML/CSS complejo CORREGIDO ---
// He eliminado el 'text-align: center' del div de contenido
// y he quitado 'margin-top: auto' del div de firmas.
const MARCOS_BASE = [
  {
    id: 'marco-simple',
    nombre: 'Marco Simple',
    cuerpo: `
<div class="certificado-marco-simple" style="font-family: 'Arial', sans-serif; min-height: 100%; border: 1px solid #ddd; background: white; padding: 40px; height: 100%; box-sizing: border-box; display: flex; flex-direction: column;">
  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
    {{logo_aqui}}
    <span style="font-size: 10px; color: #999;">{{id_aqui}}</span>
  </div>
  <div style="flex-grow: 1; padding-top: 20px;">
    {{contenido_aqui}}
  </div>
  <div style="padding-top: 40px;">
    {{firmas_aqui}}
  </div>
</div>`
  },
  {
    id: 'marco-dorado',
    nombre: 'Marco Dorado',
    cuerpo: `
<div class="certificado-marco-dorado" style="font-family: 'Georgia', serif; height: 100%; box-sizing: border-box; background: #fdf6e3; padding: 15px;">
  <div class="marco-exterior" style="border: 20px solid transparent; border-image: linear-gradient(45deg, #d4af37, #f9e076, #d4af37); border-image-slice: 1; height: 100%; position: relative; box-sizing: border-box;">
    <div class="marco-interior" style="border: 2px solid #d4af37; margin: 5px; padding: 30px; height: calc(100% - 10px); background: white; box-sizing: border-box; display: flex; flex-direction: column;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; border-bottom: 2px solid #d4af37; padding-bottom: 15px;">
        {{logo_aqui}}
        <span style="font-size: 10px; color: #999;">{{id_aqui}}</span>
      </div>
      <div style="flex-grow: 1; padding-top: 20px;">
        {{contenido_aqui}}
      </div>
      <div style="padding-top: 40px;">
        {{firmas_aqui}}
      </div>
    </div>
  </div>
</div>`
  },
  {
    id: 'marco-moderno',
    nombre: 'Marco Moderno',
    cuerpo: `
<div class="diploma-marco-moderno" style="font-family: 'Arial', sans-serif; background: white; color: #333; min-height: 100%; padding: 20px; box-sizing: border-box; height: 100%;">
  <div class="contenedor-horizontal" style="display: flex; flex-direction: column; height: 100%; border: 10px solid #1e3c72; padding: 30px; border-radius: 5px; box-sizing: border-box;">
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; width: 100%;">
      {{logo_aqui}}
      <span style="font-size: 10px; color: #999;">{{id_aqui}}</span>
    </div>
    <div style="flex-grow: 1; padding-top: 20px;">
      {{contenido_aqui}}
    </div>
    <div style="padding-top: 40px;">
      {{firmas_aqui}}
    </div>
  </div>
</div>`
  }
];

const ADMIN_TEMPLATES_KEY = 'admin_plantillas_creadas';

// --- REQUEST 2: Presets de Texto (ACTUALIZADO CON TUS IMÁGENES) ---
const TIPO_TEXTO_PRESETS = {
  certificado: {
    titulo: "CERTIFICADO",
    linea1: "Se otorga el presente certificado a:",
    cuerpo: `Por su destacada participación en calidad de <strong>{{calidad_participacion}}</strong> en el evento <strong>{{nombre_evento}}</strong>,
realizado del {{fecha_inicio}} al {{fecha_fin}} con una duración de {{duracion}}.`,
    footer: `Emitido en {{lugar_evento}}, el {{fecha_emision_larga}}.`,
    styleType: 'moderno' // --- REQUEST 1: Estilo de fuente
  },
  diploma: {
    titulo: "DIPLOMA",
    linea1: "Otorgado a:",
    cuerpo: `Por haber culminado con éxito el programa <strong>{{nombre_evento}}</strong>,
completando un total de {{duracion}}.`,
    footer: `Dado en {{lugar_evento}}, el {{fecha_emision_larga}}.`,
    styleType: 'moderno' // --- REQUEST 1: Estilo de fuente
  },
  // --- NUEVOS PRESETS ---
  constancia_practicas_v1: { // --- REQUEST 2: Renombrado
    titulo: "",
    linea1: "Por medio de la presente, se hace constar que:",
    cuerpo: `El estudiante <strong>{{nombre_completo}}</strong>, con documento de identidad número <strong>{{dni}}</strong>, ha sido aceptado en nuestra empresa para realizar prácticas pre profesionales como parte de su formación académica en la carrera de {{carrera}}, en la {{universidad}}.

Las prácticas pre profesionales tendrán una duración de {{duracion}}, comenzando desde el {{fecha_inicio}} y finalizando el {{fecha_fin}}.

Durante este período, el estudiante desempeñará diversas actividades en la Oficina de {{area}}, las cuales están relacionadas con {{descripcion_actividades}}.`,
    footer: `Se extiende la presente constancia a solicitud del interesado para los fines que estime conveniente.`,
    styleType: 'formal' // --- REQUEST 1: Estilo de fuente
  },
  certificado_participacion_1: {
    titulo: "CERTIFICADO DE PARTICIPACIÓN",
    linea1: "EL PRESENTE CERTIFICADO SE CONCEDE A",
    cuerpo: `En reconocimiento a su compromiso activo y a sus valiosas contribuciones demostradas durante el seminario web internacional de tres días sobre "<strong>{{nombre_evento}}</strong>" celebrado del {{fecha_inicio}} al {{fecha_fin}} en {{lugar_evento}}.`,
    footer: `Certificado ID: {{id_certificado}}`,
    styleType: 'moderno' // --- REQUEST 1: Estilo de fuente
  },
  certificado_trabajo_1: {
    titulo: "CERTIFICADO DE TRABAJO",
    linea1: `Quien suscribe, <strong>{{firmante_1_nombre}}</strong>, Gerente General del <strong>{{empresa_nombre}}</strong>, con RUC: <strong>{{empresa_ruc}}</strong>, con dirección legal en {{empresa_direccion}}.`,
    cuerpo: `Por media de la presente, se hace constar que la Srta. <strong>{{nombre_completo}}</strong>, identificada con DNI N.o <strong>{{dni}}</strong>, se encuentra trabajando como <strong>{{cargo}}</strong> en nuestra empresa, desempeñándose en el <strong>{{area}}</strong> desde el <strong>{{fecha_inicio}}</strong> hasta la actualidad.

Durante los períodos, ha demostrado responsabilidad, puntualidad y compromiso en el cumplimiento de todas sus funciones, que son las siguientes: {{descripcion_actividades}}.`,
    footer: `Se expide la presente constancia a solicitud de la interesada, para los fines que estime conveniente.

Atentamente,
{{lugar_evento}}, {{fecha_emision_larga}}.`,
    styleType: 'formal' // --- REQUEST 1: Estilo de fuente
  },
  constancia_practicas_v2: { // --- REQUEST 2: Renombrado
    titulo: "CONSTANCIA DE PRÁCTICAS PRE-PROFESIONALES",
    linea1: `Por medio de la presente, se certifica que el Sr. <strong>{{nombre_completo}}</strong>, con DNI N° <strong>{{dni}}</strong>, del décimo ciclo de la carrera de Ingeniería de Sistemas, ha estado realizando sus prácticas pre profesionales en la empresa {{empresa_nombre}} con Razón Social {{empresa_razon_social}} RUC: {{empresa_ruc}} desde el {{fecha_inicio}} hasta el {{fecha_fin}}.`,
    cuerpo: `Durante su periodo de prácticas, el practicante estará trabajando en el área de {{area}} como {{cargo}}, brindando apoyo al desarrollo de software que ayudan a la empresa a optimizar procesos y gestionar todos los datos de ventas y de almacenamiento.

Agradecemos su dedicación y esfuerzo en las tareas asignadas y esperamos que esta experiencia contribuya a su formación profesional.`,
    footer: `Lima, {{fecha_emision_larga}}.`,
    styleType: 'formal' // --- REQUEST 1: Estilo de fuente
  }
};

const textosBase = TIPO_TEXTO_PRESETS.certificado;

// --- DATOS MOCK (PLANTILLA GLOBAL) ---
const plantillaGlobalMock = {
  nombre: "Plantilla Corporativa Global",
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
    // --- Opciones de marcos (solo IDs y nombres) ---
    marcos: [
      { id: 'marco-simple', nombre: 'Simple', thumb: 'https://placehold.co/150x106/ffffff/4b5563?text=Simple' },
      { id: 'marco-dorado', nombre: 'Dorado', thumb: 'https://placehold.co/150x106/ffffff/d4af37?text=Dorado' },
      { id: 'marco-moderno', nombre: 'Moderno', thumb: 'https://placehold.co/150x106/ffffff/1e3a8a?text=Azul' },
    ]
  }
};

const estadoInicialNuevo = {
  id: null,
  nombre: "Mi Nueva Plantilla",
  logo: null,
  firma1: null,
  firma2: null,
  orientacion: 'vertical',
  tema: plantillaGlobalMock.opciones.temas[0].id,
  fuente: plantillaGlobalMock.opciones.fuentes[0].id,
  marcoId: MARCOS_BASE[0].id,
  numFirmas: 2,
  tipoTexto: 'certificado',
  textos: textosBase,
  primaryColor: '#1e3a8a',
  secondaryColor: '#1f2937',
  customMarco: null,
  customMarcoName: 'Subir marco (PNG Transparente)',
};

const VARIABLES_DISPONIBLES_ADMIN = [
    { nombre: 'Nombre Completo', variable: '{{nombre_completo}}' },
    { nombre: 'DNI', variable: '{{dni}}' },
    { nombre: 'Calidad Participación', variable: '{{calidad_participacion}}' },
    { nombre: 'Nombre Evento', variable: '{{nombre_evento}}' },
    { nombre: 'Carrera', variable: '{{carrera}}' },
    { nombre: 'Universidad', variable: '{{universidad}}' },
    { nombre: 'Duración', variable: '{{duracion}}' },
    { nombre: 'Fecha Inicio', variable: '{{fecha_inicio}}' },
    { nombre: 'Fecha Fin', variable: '{{fecha_fin}}' },
    { nombre: 'Area', variable: '{{area}}' },
    { nombre: 'Cargo', variable: '{{cargo}}' },
    { nombre: 'Descripción Actividades', variable: '{{descripcion_actividades}}' },
    { nombre: 'Empresa Nombre', variable: '{{empresa_nombre}}' },
    { nombre: 'Empresa RUC', variable: '{{empresa_ruc}}' },
    { nombre: 'Empresa Razón Social', variable: '{{empresa_razon_social}}' },
    { nombre: 'Empresa Dirección', variable: '{{empresa_direccion}}' },
    { nombre: 'Lugar Evento', variable: '{{lugar_evento}}' },
    { nombre: 'Fecha Emisión Larga', variable: '{{fecha_emision_larga}}' },
    { nombre: 'ID Certificado', variable: '{{id_certificado}}' },
    { nombre: 'Firmante 1 Nombre', variable: '{{firmante_1_nombre}}' },
    { nombre: 'Firmante 1 Cargo', variable: '{{firmante_1_cargo}}' },
    { nombre: 'Firmante 2 Nombre', variable: '{{firmante_2_nombre}}' },
    { nombre: 'Firmante 2 Cargo', variable: '{{firmante_2_cargo}}' },
];

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
  const navigate = useNavigate();

  const esModoCrear = !id;
  const esPersonalizacionGlobal = id && id.startsWith('global_'); 
  const esEdicionAdmin = id && !id.startsWith('global_'); 

  const getStorageKey = () => {
    if (esPersonalizacionGlobal) return `custom_plantilla_global_${id}`;
    if (esEdicionAdmin) return ADMIN_TEMPLATES_KEY;
    return null;
  };

  const [plantilla, setPlantilla] = useState(estadoInicialNuevo);
  const [lastFocus, setLastFocus] = useState({ name: '', pos: 0 });
  const inputRefs = {
    titulo: useRef(null),
    linea1: useRef(null),
    cuerpo: useRef(null),
    footer: useRef(null)
  };

  useEffect(() => {
    let datosCargados = null;
    if (esPersonalizacionGlobal) {
      const datosGuardados = localStorage.getItem(getStorageKey());
      if (datosGuardados) {
        datosCargados = JSON.parse(datosGuardados);
      } else {
        datosCargados = { id: id, nombre: plantillaGlobalMock.nombre, marcoId: MARCOS_BASE[0].id };
      }
    } else if (esEdicionAdmin) {
      const plantillasAdminGuardadas = localStorage.getItem(ADMIN_TEMPLATES_KEY);
      if (plantillasAdminGuardadas) {
        const plantillas = JSON.parse(plantillasAdminGuardadas);
        datosCargados = plantillas.find(p => String(p.id) === String(id));
      }
      if (!datosCargados) {
        alert("Error: No se encontró la plantilla.");
        navigate('/admin/plantillas');
        return;
      }
    }
    
    if (datosCargados) {
        setPlantilla(prev => ({ ...estadoInicialNuevo, ...prev, ...datosCargados }));
    } else {
        setPlantilla(estadoInicialNuevo);
    }
  }, [id, esModoCrear, esEdicionAdmin, esPersonalizacionGlobal, navigate]);

  const actualizarCampo = (campo, valor) => {
    setPlantilla(prev => ({ ...prev, [campo]: valor }));
  };
  
  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setPlantilla(prev => ({ 
      ...prev, 
      textos: { ...prev.textos, [name]: value }
    }));
  };

  const handleFileChange = (e, campoEstado, campoNombre = null) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPlantilla(prev => ({
          ...prev,
          [campoEstado]: reader.result,
          ...(campoNombre && { [campoNombre]: file.name })
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTemaChange = (id) => {
    actualizarCampo('tema', id);
    const selectedTheme = plantillaGlobalMock.opciones.temas.find(t => t.id === id);
    if (selectedTheme) {
      const styles = Object.fromEntries(selectedTheme.value.split(';').filter(Boolean).map(s => s.split(':').map(p => p.trim())));
      actualizarCampo('primaryColor', styles['--primary-color'] || '#000000');
      actualizarCampo('secondaryColor', styles['--secondary-color'] || '#333333');
    }
  };

  const handleMarcoChange = (id) => {
    actualizarCampo('marcoId', id);
    actualizarCampo('customMarco', null);
    actualizarCampo('customMarcoName', 'Subir marco (PNG Transparente)');
  };

  const handleCustomMarcoChange = (e) => {
    handleFileChange(e, 'customMarco', 'customMarcoName');
  };

  const handleTipoTextoChange = (e) => {
    const tipo = e.target.value;
    const preset = TIPO_TEXTO_PRESETS[tipo] || TIPO_TEXTO_PRESETS.certificado;
    
    setPlantilla(prev => ({
      ...prev,
      tipoTexto: tipo,
      textos: preset
    }));
  };

  const handleRestoreText = () => {
    const tipo = plantilla.tipoTexto || 'certificado';
    const preset = TIPO_TEXTO_PRESETS[tipo];
    setPlantilla(prev => ({ ...prev, textos: preset }));
  };
  
  const handleSave = () => {
    if (esPersonalizacionGlobal) {
      localStorage.setItem(getStorageKey(), JSON.stringify(plantilla));
      alert(`Personalización "${plantilla.nombre}" guardada.`);
    } else {
      const plantillasAdminGuardadas = localStorage.getItem(ADMIN_TEMPLATES_KEY);
      let plantillas = plantillasAdminGuardadas ? JSON.parse(plantillasAdminGuardadas) : [];
      if (esEdicionAdmin) {
        plantillas = plantillas.map(p => (String(p.id) === String(id) ? plantilla : p));
        alert(`Plantilla "${plantilla.nombre}" actualizada.`);
      } else {
        const nuevaPlantilla = { ...plantilla, id: Date.now() };
        plantillas.push(nuevaPlantilla);
        alert(`Plantilla "${plantilla.nombre}" creada.`);
      }
      localStorage.setItem(ADMIN_TEMPLATES_KEY, JSON.stringify(plantillas));
    }
    navigate('/admin/plantillas');
  };
  
  const isVertical = plantilla.orientacion === 'vertical';

  const certificateStyles = useMemo(() => {
    let styles = {
      '--primary-color': plantilla.primaryColor,
      '--secondary-color': plantilla.secondaryColor,
    };
    const selectedFont = plantillaGlobalMock.opciones.fuentes.find(f => f.id === plantilla.fuente);
    if (selectedFont) styles = { ...styles, ...Object.fromEntries(selectedFont.value.split(';').filter(Boolean).map(s => s.split(':').map(p => p.trim()))) };
    return styles;
  }, [plantilla.primaryColor, plantilla.secondaryColor, plantilla.fuente]);

  // --- HTML de la vista previa (Corregido) ---
  const previewHtml = useMemo(() => {
    // --- REQUEST 1: Lógica de Estilo de Fuente ---
    const tipoTexto = plantilla.tipoTexto || 'certificado';
    const presetStyle = TIPO_TEXTO_PRESETS[tipoTexto]?.styleType || 'moderno';
    const isFormal = presetStyle === 'formal';
    
    // --- REQUEST 1: Estilo de Fuente y Alineación ---
    const textAlign = isFormal ? 'left' : 'center';
    
    // --- REQUEST 1: Tamaños de Fuente Corregidos ---
    // 'moderno' (grande) vs 'formal' (pequeño)
    const tituloSize = isFormal ? '1.25rem' : (isVertical ? '2.25rem' : '1.875rem'); // formal: 20px
    const linea1Size = isFormal ? '0.875rem' : (isVertical ? '1.125rem' : '1rem'); // formal: 14px
    const nombreSize = isFormal ? '0.875rem' : (isVertical ? '2.25rem' : '1.875rem'); // formal: 14px
    const cuerpoSize = isFormal ? '0.875rem' : '1rem'; // formal: 14px
    const footerSize = isFormal ? '0.75rem' : (isVertical ? '0.875rem' : '0.75rem'); // formal: 12px
    
    // Estilo del nombre: sin fondo amarillo para formal
    const nombreStyle = isFormal 
      ? 'font-weight: bold; background-color: transparent; padding: 0; border-radius: 0; display: inline;' 
      : 'font-weight: bold; background-color: rgba(254, 249, 195, 0.5); padding: 2px 4px; border-radius: 4px; display: inline-block;';
    
    // Estilo de variables: sin fondo amarillo para formal
    const variableStyle = isFormal 
      ? 'font-weight: bold; background-color: transparent;' 
      : 'background-color: rgba(254, 249, 195, 0.5); padding: 1px 2px; border-radius: 4px;';
    
    const variableReplaceRegex = /{{(.*?)}}/g;
    const variableReplaceString = `<span style="${variableStyle}">{{$1}}</span>`;
    
    // --- FIN Lógica Estilo ---

    const logoHtml = `<img src="${plantilla.logo || 'https://placehold.co/200x80/f1f1f1/ccc?text=Logo'}" alt="Logo" style="max-height: ${isVertical ? '64px' : '48px'}; object-fit: contain;" />`;
    
    const contenidoHtml = `
      <div style="text-align: ${textAlign};">
        <h1 class="certificate-title" style="font-size: ${tituloSize}; font-weight: bold; margin-bottom: 1.5rem; ${plantilla.textos.titulo ? '' : 'display: none;'} ${isFormal ? 'text-align: center;' : ''}">${plantilla.textos.titulo}</h1>
        <p class="certificate-body" style="font-size: ${linea1Size}; margin-bottom: 1.5rem; white-space: pre-wrap;">${(plantilla.textos.linea1 || '').replace(variableReplaceRegex, variableReplaceString)}</p>
        
        <div style="margin-bottom: 1.5rem; ${isFormal ? 'text-align: left;' : 'text-align: center;'}">
          <h2 class="certificate-recipient" style="font-size: ${nombreSize}; ${nombreStyle}">{{nombre_completo}}</h2>
        </div>

        <div class="certificate-body" style="font-size: ${cuerpoSize}; margin-bottom: 1.5rem; max-width: 48rem; margin-left: ${textAlign === 'left' ? '0' : 'auto'}; margin-right: ${textAlign === 'left' ? '0' : 'auto'}; white-space: pre-wrap;">
          ${(plantilla.textos.cuerpo || '').replace(variableReplaceRegex, variableReplaceString)}
        </div>
        <p class="certificate-body" style="font-size: ${footerSize}; color: #6b7280; white-space: pre-wrap; margin-top: 2rem;">
          ${(plantilla.textos.footer || '').replace(variableReplaceRegex, variableReplaceString)}
        </p>
      </div>
    `;

    const firma1Html = `
      <div style="text-align: center; width: 45%; max-w: 200px;">
        <img src="${plantilla.firma1 || 'https://placehold.co/250x100/f1f1f1/ccc?text=Firma+1'}" alt="Firma 1" style="max-height: ${isVertical ? '64px' : '48px'}; object-fit: contain; margin: 0 auto 4px;" />
        <hr class="signature-line" style="border-top: 2px solid; width: 100%; margin: 0 auto 4px;" />
        <p class="signature-text" style="font-size: 0.75rem; font-weight: bold;">{{firmante_1_nombre}}</p>
        <p class="signature-text" style="font-size: 0.75rem; color: #6b7280;">{{firmante_1_cargo}}</p>
      </div>
    `;
    const firma2Html = `
      <div style="text-align: center; width: 45%; max-w: 200px;">
        <img src="${plantilla.firma2 || 'https://placehold.co/250x100/f1f1f1/ccc?text=Firma+2'}" alt="Firma 2" style="max-height: ${isVertical ? '64px' : '48px'}; object-fit: contain; margin: 0 auto 4px;" />
        <hr class="signature-line" style="border-top: 2px solid; width: 100%; margin: 0 auto 4px;" />
        <p class="signature-text" style="font-size: 0.75rem; font-weight: bold;">{{firmante_2_nombre}}</p>
        <p class="signature-text" style="font-size: 0.75rem; color: #6b7280;">{{firmante_2_cargo}}</p>
      </div>
    `;

    let firmasHtml = '';
    if (plantilla.numFirmas === 1) {
      firmasHtml = `<div style="display: flex; justify-content: center; gap: 2rem;">${firma1Html}</div>`;
    } else if (plantilla.numFirmas === 2) {
      firmasHtml = `<div style="display: flex; justify-content: space-around; gap: 2rem;">${firma1Html}${firma2Html}</div>`;
    }

    let finalHtml;
    
    if (plantilla.customMarco) {
      finalHtml = `
        <div style="background-image: url(${plantilla.customMarco}); background-size: 100% 100%; background-position: center; background-repeat: no-repeat; height: 100%; box-sizing: border-box; display: flex; flex-direction: column; padding: 40px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
            ${logoHtml}
            <span style="font-size: 10px; color: #999;">ID: {{id_certificado}}</span>
          </div>
          <div style="flex-grow: 1; padding-top: 20px;">
            ${contenidoHtml}
          </div>
          <div style="padding-top: 40px;">
            ${firmasHtml}
          </div>
        </div>
      `;
    } else {
      const selectedMarco = MARCOS_BASE.find(m => m.id === plantilla.marcoId) || MARCOS_BASE[0];
      finalHtml = selectedMarco.cuerpo
        .replace('{{logo_aqui}}', logoHtml)
        .replace('{{id_aqui}}', 'ID: {{id_certificado}}')
        .replace('{{contenido_aqui}}', contenidoHtml)
        .replace('{{firmas_aqui}}', firmasHtml);
    }
      
    return finalHtml;
  }, [plantilla, isVertical]);

  const handleFocus = (e) => {
    setLastFocus({ name: e.target.name, pos: e.target.selectionStart });
  };
  
  const handleBlur = (e) => {
    setLastFocus({ name: e.target.name, pos: e.target.selectionStart });
  };
  
  const insertarVariable = (variable) => {
    const { name, pos } = lastFocus;
    if (!name || !inputRefs[name]) {
      navigator.clipboard.writeText(variable);
      alert(`"${variable}" copiado. Por favor, haz clic en el campo donde deseas pegarlo.`);
      return;
    }
    const valorActual = plantilla.textos[name];
    const nuevoValor = valorActual.slice(0, pos) + variable + valorActual.slice(pos);
    
    setPlantilla(prev => ({ 
      ...prev, 
      textos: { ...prev.textos, [name]: nuevoValor }
    }));
    
    setTimeout(() => {
      const input = inputRefs[name].current;
      if (input) {
        input.focus();
        const newPos = pos + variable.length;
        input.setSelectionRange(newPos, newPos);
        setLastFocus({ name, pos: newPos });
      }
    }, 0);
  };


  return (
    <div className="space-y-6">
      <DynamicStyles styles={certificateStyles} />
      
      {/* Cabecera Principal */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white p-4 rounded-lg shadow">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {esModoCrear ? 'Crear Nueva Plantilla' : (esPersonalizacionGlobal ? 'Personalizar Plantilla Global' : 'Editar Mi Plantilla')}
          </h1>
          <p className="text-sm text-gray-500">{plantilla.nombre}</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/plantillas" className="bg-white text-gray-700 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 flex items-center gap-2">
            <ArrowLeftIcon className="w-5 h-5" /> Volver
          </Link>
          <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 shadow-sm flex items-center gap-2">
            <ArrowUpOnSquareIcon className="w-5 h-5" /> 
            {esModoCrear ? 'Crear Plantilla' : 'Guardar Cambios'}
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
                {plantillaGlobalMock.opciones.orientaciones.map(o => (
                  <label key={o} className="flex items-center"><input type="radio" name="orientacion" value={o} checked={plantilla.orientacion === o} onChange={() => actualizarCampo('orientacion', o)} className="form-radio"/><span className="ml-2 capitalize text-sm">{o}</span></label>
                ))}
              </div>
            </div>
            {/* Temas y Fuentes */}
            <div className="md:col-span-1">
              <label htmlFor="tema-select" className="block text-sm font-medium text-gray-700">Tema</label>
              <select id="tema-select" value={plantilla.tema} onChange={e => handleTemaChange(e.target.value)} className="w-full mt-1 border-gray-300 rounded-md shadow-sm text-sm">
                {plantillaGlobalMock.opciones.temas.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
              </select>
              <label htmlFor="fuente-select" className="block text-sm font-medium text-gray-700 mt-2">Fuente</label>
              <select id="fuente-select" value={plantilla.fuente} onChange={e => actualizarCampo('fuente', e.target.value)} className="w-full mt-1 border-gray-300 rounded-md shadow-sm text-sm">
                {plantillaGlobalMock.opciones.fuentes.map(f => <option key={f.id} value={f.id}>{f.nombre}</option>)}
              </select>
            </div>
            {/* Colores */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Colores</label>
              <div className="flex gap-4">
                <div>
                  <label htmlFor="primary-color-picker" className="text-xs text-gray-500">Primario</label>
                  <input id="primary-color-picker" type="color" value={plantilla.primaryColor} onChange={e => actualizarCampo('primaryColor', e.target.value)} className="w-full h-8 p-0.5 border border-gray-300 rounded-md cursor-pointer"/>
                </div>
                <div>
                  <label htmlFor="secondary-color-picker" className="text-xs text-gray-500">Secundario</label>
                  <input id="secondary-color-picker" type="color" value={plantilla.secondaryColor} onChange={e => actualizarCampo('secondaryColor', e.target.value)} className="w-full h-8 p-0.5 border border-gray-300 rounded-md cursor-pointer"/>
                </div>
              </div>
            </div>
            {/* Marcos (REQUEST 1) */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Marcos (Base)</label>
              <div className="flex gap-2 items-center">
                <div className="grid grid-cols-3 gap-2 flex-grow">
                  {plantillaGlobalMock.opciones.marcos.map(opcion => (
                    <div key={opcion.id}>
                      <input type="radio" name="marcos" id={opcion.id} value={opcion.id} checked={plantilla.marcoId === opcion.id} onChange={() => handleMarcoChange(opcion.id)} className="sr-only"/>
                      <label htmlFor={opcion.id} className={`cursor-pointer block rounded-md border-2 transition-all ${plantilla.marcoId === opcion.id ? 'border-blue-500' : 'border-transparent'}`}>
                        <img src={opcion.thumb} alt={opcion.nombre} className="h-16 w-full object-cover rounded" />
                      </label>
                    </div>
                  ))}
                </div>
                <div className="pl-2">
                  <input id="custom-marco-upload" type="file" accept="image/png" className="sr-only" onChange={handleCustomMarcoChange} />
                  <label htmlFor="custom-marco-upload" title={plantilla.customMarcoName} className={`cursor-pointer flex flex-col items-center justify-center h-16 w-16 border-2 rounded-md transition-all ${plantilla.customMarco ? 'border-blue-500' : 'border-gray-300 border-dashed hover:border-blue-400'}`}>
                    {plantilla.customMarco ? <SparklesIcon className="w-8 h-8 text-blue-500" /> : <PhotoIcon className="w-8 h-8 text-gray-400" />}
                    <span className="text-[9px] text-gray-500 mt-1 text-center leading-tight">Subir PNG</span>
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
            <h2 className="text-xl font-bold mb-6 border-b pb-2 text-gray-700">Archivos y Nombre</h2>
            <div className="space-y-4">
              {(esModoCrear || esEdicionAdmin) && (
                <div>
                  <label htmlFor="plantilla-nombre" className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Plantilla</label>
                  <input 
                    type="text" 
                    id="plantilla-nombre" 
                    value={plantilla.nombre} 
                    onChange={e => actualizarCampo('nombre', e.target.value)} 
                    className="w-full mt-1 border-gray-300 rounded-md shadow-sm"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Logo de la Empresa</label>
                <input id="logo-upload" type="file" accept="image/png, image/jpeg" className="sr-only" onChange={e => handleFileChange(e, 'logo')} />
                <label htmlFor="logo-upload" className="cursor-pointer mt-1 flex justify-center items-center gap-2 px-4 py-2 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 text-sm text-blue-600"> <PhotoIcon className="w-5 h-5 text-gray-400"/> {plantilla.logo ? 'Cambiar logo' : 'Subir logo'} </label>
              </div>
              <div>
                <label htmlFor="num-firmas-select" className="block text-sm font-medium text-gray-700 mb-1">Número de Firmas</label>
                <select id="num-firmas-select" value={plantilla.numFirmas} onChange={e => actualizarCampo('numFirmas', Number(e.target.value))} className="w-full mt-1 border-gray-300 rounded-md shadow-sm">
                  <option value={0}>0 Firmas</option>
                  <option value={1}>1 Firma</option>
                  <option value={2}>2 Firmas</option>
                </select>
              </div>
              {plantilla.numFirmas > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Firma 1</label>
                  <input id="firma1-upload" type="file" accept="image/png" className="sr-only" onChange={e => handleFileChange(e, 'firma1')} />
                  <label htmlFor="firma1-upload" className="cursor-pointer mt-1 flex justify-center items-center gap-2 px-4 py-2 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 text-sm text-blue-600"> <PencilSquareIcon className="w-5 h-5 text-gray-400"/> {plantilla.firma1 ? 'Cambiar firma 1' : 'Subir firma 1 (PNG)'} </label>
                </div>
              )}
              {plantilla.numFirmas > 1 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Firma 2</label>
                  <input id="firma2-upload" type="file" accept="image/png" className="sr-only" onChange={e => handleFileChange(e, 'firma2')} />
                  <label htmlFor="firma2-upload" className="cursor-pointer mt-1 flex justify-center items-center gap-2 px-4 py-2 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 text-sm text-blue-600"> <IdentificationIcon className="w-5 h-5 text-gray-400"/> {plantilla.firma2 ? 'Cambiar firma 2' : 'Subir firma 2 (PNG)'} </label>
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
                <label htmlFor="tipo-texto-preset" className="block text-sm font-medium text-gray-700">
                  Tipo de Documento (Preset)
                </label>
                <select
                  id="tipo-texto-preset"
                  name="tipo-texto-preset"
                  value={plantilla.tipoTexto || 'certificado'}
                  onChange={handleTipoTextoChange}
                  className="w-full mt-1 border-gray-300 rounded-md shadow-sm"
                >
                  {/* --- REQUEST 2: Opciones actualizadas --- */}
                  <option value="certificado">Certificado (Genérico)</option>
                  <option value="diploma">Diploma (Genérico)</option>
                  <option value="certificado_participacion_1">Cert. Participación (Moderno)</option>
                  <option value="certificado_trabajo_1">Cert. Trabajo (Estudio)</option>
                  <option value="constancia_practicas_v1">Constancia Prácticas v1</option>
                  <option value="constancia_practicas_v2">Constancia Prácticas v2</option>
                </select>
              </div>

              <hr/>

              <div>
                <label htmlFor="text-titulo" className="block text-sm font-medium text-gray-700">Título</label>
                <input type="text" name="titulo" id="text-titulo" 
                  ref={inputRefs.titulo}
                  value={plantilla.textos.titulo} 
                  onChange={handleTextChange} 
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  className="w-full mt-1 border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label htmlFor="text-linea1" className="block text-sm font-medium text-gray-700">Línea 1 (Saludo/Intro)</label>
                <textarea name="linea1" id="text-linea1" 
                  ref={inputRefs.linea1}
                  value={plantilla.textos.linea1} 
                  onChange={handleTextChange} 
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  rows="3" className="w-full mt-1 border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label htmlFor="text-cuerpo" className="block text-sm font-medium text-gray-700">Cuerpo del Documento</label>
                <textarea name="cuerpo" id="text-cuerpo" 
                  ref={inputRefs.cuerpo}
                  value={plantilla.textos.cuerpo} 
                  onChange={handleTextChange} 
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  rows="6" className="w-full mt-1 border-gray-300 rounded-md shadow-sm" />
                <p className="text-xs text-gray-500 mt-1">Usa {'{{variable}}'} para los datos dinámicos.</p>
              </div>
              <div>
                <label htmlFor="text-footer" className="block text-sm font-medium text-gray-700">Pie de Página</label>
                <textarea name="footer" id="text-footer" 
                  ref={inputRefs.footer}
                  value={plantilla.textos.footer} 
                  onChange={handleTextChange} 
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  rows="3" className="w-full mt-1 border-gray-300 rounded-md shadow-sm" />
              </div>
            </div>
          </div>

          {/* Panel de Variables */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h4 className="text-xl font-bold text-gray-700 mb-3 flex items-center gap-2">
              <ClipboardIcon className="w-5 h-5 text-green-600" />
              Variables Disponibles
            </h4>
            <p className="text-sm text-gray-600 mb-3">
              Clic para insertar la variable en el último campo de texto seleccionado.
            </p>
            
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {VARIABLES_DISPONIBLES_ADMIN.map((variable) => (
                <button
                  key={variable.variable}
                  onClick={() => insertarVariable(variable.variable)}
                  className="w-full flex items-center justify-between p-2 text-sm border border-gray-200 rounded hover:bg-gray-50 transition-colors group"
                >
                  <span className="text-gray-700 group-hover:text-gray-900 text-left">
                    {variable.nombre}
                  </span>
                  <code className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                    {variable.variable}
                  </code>
                </button>
              ))}
            </div>
          </div>

        </aside>
        
        {/* --- VISTA PREVIA (DERECHA) --- */}
        <main className="lg:col-span-2">
          <div className={`bg-gray-200 rounded-lg shadow-inner mx-auto transition-all duration-300 ease-in-out ${plantilla.orientacion === 'horizontal' ? 'aspect-[1.414/1] max-w-4xl' : 'aspect-[1/1.414] max-w-xl'}`}>
            <DynamicStyles styles={certificateStyles} />
            <div 
              className="h-full w-full"
              dangerouslySetInnerHTML={{ __html: previewHtml }} 
            />
          </div>
        </main>
      </div>
    </div>
  );
}