import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { RiAddLine, RiFileTextLine, RiPencilLine, RiFileCopyLine, RiImageLine, RiPaletteLine, RiFontSize, RiCloseLine, RiImageAddLine } from 'react-icons/ri';
import ModalBase from '../../components/common/ModalBase'; // Importamos el modal base

// --- MOCK DATA ---
const mockPlantillas = [ { id: 1, nombre: 'Plantilla Corporativa Global' }, { id: 2, nombre: 'Constancia Prácticas General' } ];
const mockFondos = [ { id: 1, nombre: 'Olas Azules', url: 'https://placehold.co/150x100/00416A/E8E8E8?text=Olas' }, { id: 2, nombre: 'Abstracto Gris', url: 'https://placehold.co/150x100/BDBDBD/424242?text=Gris' }, { id: 3, nombre: 'Geo Dorado', url: 'https://placehold.co/150x100/D4AF37/222222?text=Dorado' } ];
const mockTemas = [ { id: 1, nombre: 'Tema Corporativo', colors: ['#1e3a8a', '#1f2937'] }, { id: 2, nombre: 'Tema Clásico', colors: ['#1f2937', '#4b5563'] }, { id: 3, nombre: 'Tema Elegante', colors: ['#b45309', '#1f2937'] } ];
const mockFuentes = [ { id: 1, nombre: 'Fuente Moderna', titleFont: "'Playfair Display', serif", baseFont: "'Lato', sans-serif" }, { id: 2, nombre: 'Fuente Clásica', titleFont: "'Merriweather', serif", baseFont: "'Merriweather', serif" } ];

// --- PESTAÑAS Y TARJETAS (Componentes internos sin cambios) ---
const TabButton = ({ label, icon, isActive, onClick }) => ( <button onClick={onClick} className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-4 transition-colors duration-200 ${isActive ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>{icon}{label}</button> );

// --- FORMULARIOS PARA LOS MODALES ---

const ModalAnadirFondo = ({ onClose }) => (
    <div className="p-6">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Añadir Nuevo Fondo</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><RiCloseLine className="text-2xl" /></button>
        </div>
        <div className="space-y-4">
            <div>
                <label htmlFor="fondo-nombre" className="block text-sm font-medium text-gray-700 mb-1">Nombre del Fondo</label>
                <input type="text" id="fondo-nombre" placeholder="Ej: Olas Corporativas" className="block w-full border-gray-300 rounded-md shadow-sm p-2"/>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Archivo de Imagen</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                        <RiImageAddLine className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="text-sm text-gray-600">Arrastra y suelta o <button type="button" className="font-medium text-blue-600 hover:text-blue-500">busca un archivo</button></p>
                        <p className="text-xs text-gray-500">PNG, JPG, SVG hasta 2MB</p>
                    </div>
                </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
                <button onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Cancelar</button>
                <button onClick={() => { alert('Guardando fondo...'); onClose(); }} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Guardar Fondo</button>
            </div>
        </div>
    </div>
);

const ModalAnadirTema = ({ onClose }) => (
    <div className="p-6">
        <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold text-gray-800">Añadir Nuevo Tema</h2><button onClick={onClose} className="text-gray-500 hover:text-gray-800"><RiCloseLine className="text-2xl" /></button></div>
        <div className="space-y-4">
            <div><label htmlFor="tema-nombre" className="block text-sm font-medium text-gray-700 mb-1">Nombre del Tema</label><input type="text" id="tema-nombre" placeholder="Ej: Tema Verano" className="block w-full border-gray-300 rounded-md shadow-sm p-2"/></div>
            <div className="grid grid-cols-2 gap-4">
                <div><label htmlFor="color-primario" className="block text-sm font-medium text-gray-700 mb-1">Color Primario (Títulos)</label><input type="color" id="color-primario" defaultValue="#1e3a8a" className="w-full h-10 border-gray-300 rounded-md p-1 cursor-pointer"/></div>
                <div><label htmlFor="color-secundario" className="block text-sm font-medium text-gray-700 mb-1">Color Secundario (Texto)</label><input type="color" id="color-secundario" defaultValue="#1f2937" className="w-full h-10 border-gray-300 rounded-md p-1 cursor-pointer"/></div>
            </div>
            <div className="flex justify-end gap-3 pt-4"><button onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Cancelar</button><button onClick={() => { alert('Guardando tema...'); onClose(); }} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Guardar Tema</button></div>
        </div>
    </div>
);

const ModalAnadirFuente = ({ onClose }) => (
    <div className="p-6">
        <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold text-gray-800">Añadir Estilo de Fuente</h2><button onClick={onClose} className="text-gray-500 hover:text-gray-800"><RiCloseLine className="text-2xl" /></button></div>
        <div className="space-y-4">
            <div><label htmlFor="fuente-nombre" className="block text-sm font-medium text-gray-700 mb-1">Nombre del Estilo</label><input type="text" id="fuente-nombre" placeholder="Ej: Estilo Impacto" className="block w-full border-gray-300 rounded-md shadow-sm p-2"/></div>
            <div><label htmlFor="fuente-titulo" className="block text-sm font-medium text-gray-700 mb-1">Familia de Fuente (Títulos)</label><input type="text" id="fuente-titulo" placeholder="Ej: 'Impact', sans-serif" className="block w-full border-gray-300 rounded-md shadow-sm p-2"/></div>
            <div><label htmlFor="fuente-base" className="block text-sm font-medium text-gray-700 mb-1">Familia de Fuente (Texto Base)</label><input type="text" id="fuente-base" placeholder="Ej: 'Arial', sans-serif" className="block w-full border-gray-300 rounded-md shadow-sm p-2"/></div>
            <div className="flex justify-end gap-3 pt-4"><button onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Cancelar</button><button onClick={() => { alert('Guardando estilo de fuente...'); onClose(); }} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Guardar Estilo</button></div>
        </div>
    </div>
);


export default function ListaPlantillasSuperAdmin() {
  const [activeTab, setActiveTab] = useState('plantillas');
  // --- ¡NUEVO ESTADO PARA CONTROLAR LOS MODALES! ---
  const [modalAbierto, setModalAbierto] = useState(null); // null, 'fondos', 'temas', o 'fuentes'

  // El botón ahora abre el modal correspondiente
  const mainAction = {
    plantillas: { label: 'Crear Plantilla Global', path: '/super/plantillas/crear' },
    fondos: { label: 'Añadir Nuevo Fondo', onClick: () => setModalAbierto('fondos') },
    temas: { label: 'Añadir Nuevo Tema', onClick: () => setModalAbierto('temas') },
    fuentes: { label: 'Añadir Nuevo Estilo', onClick: () => setModalAbierto('fuentes') },
  };

  const handleCloseModal = () => setModalAbierto(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Plantillas y Recursos</h1>
        {activeTab === 'plantillas' ? (
             <Link to={mainAction.plantillas.path} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 shadow-sm flex items-center gap-2"><RiAddLine className="w-5 h-5" /> {mainAction.plantillas.label}</Link>
        ) : (
             <button onClick={mainAction[activeTab].onClick} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 shadow-sm flex items-center gap-2"><RiAddLine className="w-5 h-5" /> {mainAction[activeTab].label}</button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <nav className="flex border-b border-gray-200 overflow-x-auto">
            <TabButton label="Plantillas" icon={<RiFileTextLine className="w-5 h-5"/>} isActive={activeTab === 'plantillas'} onClick={() => setActiveTab('plantillas')} />
            <TabButton label="Fondos" icon={<RiImageLine className="w-5 h-5"/>} isActive={activeTab === 'fondos'} onClick={() => setActiveTab('fondos')} />
            <TabButton label="Temas" icon={<RiPaletteLine className="w-5 h-5"/>} isActive={activeTab === 'temas'} onClick={() => setActiveTab('temas')} />
            <TabButton label="Fuentes" icon={<RiFontSize className="w-5 h-5"/>} isActive={activeTab === 'fuentes'} onClick={() => setActiveTab('fuentes')} />
        </nav>

        <div className="p-6">
            {activeTab === 'plantillas' && (
                <div>
                    <p className="text-gray-600 mb-6">Administra las plantillas base...</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {mockPlantillas.map(p => (<div key={p.id} className="border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow bg-white"><div className="flex items-center justify-center w-full h-32 bg-gray-100 rounded-md mx-auto mb-4"><RiFileTextLine className="w-16 h-16 text-gray-400" /></div><span className="font-semibold text-gray-700">{p.nombre}</span><div className="flex justify-center gap-2 mt-4 pt-4 border-t border-gray-200"><Link to={`/super/plantillas/editar/${p.id}`} className="bg-white text-gray-700 px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-100 text-sm flex items-center gap-1"><RiPencilLine className="w-4 h-4" />Editar</Link><button className="bg-white text-gray-700 px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-100 text-sm flex items-center gap-1"><RiFileCopyLine className="w-4 h-4" />Duplicar</button></div></div>))}
                    </div>
                </div>
            )}
            {activeTab === 'fondos' && ( <div><p className="text-gray-600 mb-6">Sube y administra las imágenes de fondo...</p><div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">{mockFondos.map(f => ( <div key={f.id} className="border rounded-lg p-3 text-center bg-white group relative"><img src={f.url} alt={f.nombre} className="h-24 w-full object-cover rounded-md mb-2"/><p className="text-sm font-medium text-gray-700">{f.nombre}</p></div>))}</div></div>)}
            {activeTab === 'temas' && ( <div><p className="text-gray-600 mb-6">Define las paletas de colores...</p><div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{mockTemas.map(t => (<div key={t.id} className="border rounded-lg p-4 text-center bg-white"><p className="font-semibold text-gray-800 mb-2">{t.nombre}</p><div className="flex justify-center gap-2"><div className="w-10 h-10 rounded-full border-2 border-white shadow" style={{ backgroundColor: t.colors[0] }}></div><div className="w-10 h-10 rounded-full border-2 border-white shadow" style={{ backgroundColor: t.colors[1] }}></div></div></div>))}</div></div>)}
            {activeTab === 'fuentes' && ( <div><p className="text-gray-600 mb-6">Define combinaciones de fuentes...</p><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{mockFuentes.map(f => ( <div key={f.id} className="border rounded-lg p-4 bg-white"><p className="font-semibold text-gray-800 mb-2">{f.nombre}</p><div className="bg-gray-50 p-3 rounded"><p style={{ fontFamily: f.titleFont }} className="text-lg truncate">Título de Ejemplo</p><p style={{ fontFamily: f.baseFont }} className="text-sm text-gray-600">Este es un texto base de ejemplo.</p></div></div>))}</div></div>)}
        </div>
      </div>
      
      {/* --- RENDERIZADO DE MODALES --- */}
      <ModalBase isOpen={modalAbierto === 'fondos'} onClose={handleCloseModal} maxWidth="md:max-w-lg">
          <ModalAnadirFondo onClose={handleCloseModal} />
      </ModalBase>
      <ModalBase isOpen={modalAbierto === 'temas'} onClose={handleCloseModal} maxWidth="md:max-w-lg">
          <ModalAnadirTema onClose={handleCloseModal} />
      </ModalBase>
      <ModalBase isOpen={modalAbierto === 'fuentes'} onClose={handleCloseModal} maxWidth="md:max-w-lg">
          <ModalAnadirFuente onClose={handleCloseModal} />
      </ModalBase>

    </div>
  );
}