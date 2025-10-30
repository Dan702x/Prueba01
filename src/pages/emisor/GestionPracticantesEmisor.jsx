import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  ChevronDownIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DocumentArrowUpIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/solid';
// Importamos la librería xlsx (el método correcto que usamos para el diseño)
import * as XLSX from 'xlsx';

import ModalBase from '../../components/common/ModalBase';
import FormularioPracticante from '../admin/FormularioPracticante';
import ModalConfirmacion from '../../components/common/ModalConfirmacion';

const practicantesIniciales = [
    { id: 1, nombres: 'Carlos', apellidos: 'López', dni: '12345678', correo: 'carlos.lopez@example.com', areaProyecto: 'Desarrollo de Software', fechaInicio: '01/08/25', fechaFin: '31/10/25', activo: true },
    { id: 2, nombres: 'Julio', apellidos: 'Bejar', dni: '87654321', correo: 'julio.bejar@example.com', areaProyecto: 'Soporte de TI', fechaInicio: '01/08/25', fechaFin: '31/10/25', activo: false },
    { id: 3, nombres: 'Ana', apellidos: 'García', dni: '11223344', correo: 'ana.garcia@example.com', areaProyecto: 'Análisis de Datos', fechaInicio: '15/09/25', fechaFin: '15/12/25', activo: true },
    { id: 4, nombres: 'Luis', apellidos: 'Martinez', dni: '44556677', correo: 'luis.martinez@example.com', areaProyecto: 'Desarrollo de Software', fechaInicio: '01/10/25', fechaFin: '31/12/25', activo: true },
    { id: 5, nombres: 'Maria', apellidos: 'Rodriguez', dni: '88990011', correo: 'maria.r@example.com', areaProyecto: 'Soporte de TI', fechaInicio: '01/08/25', fechaFin: '31/10/25', activo: true },
];

const ITEMS_PER_PAGE = 7;

const parseDate = (dateString) => {
    if (!dateString) return null;
    const parts = dateString.split('/');
    return new Date(`20${parts[2]}`, parts[1] - 1, parts[0]);
};

function ToolsDropdown({ onImport, onExport }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => { if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false); };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-white text-gray-700 font-semibold rounded-lg border border-gray-300 shadow-sm hover:bg-gray-50">
        Herramientas <ChevronDownIcon className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
          <ul className="py-1">
            <li><button onClick={onImport} className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><DocumentArrowUpIcon className="h-5 w-5 text-teal-500" /> Importar CSV</button></li>
            <li><button onClick={onExport} className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><DocumentArrowDownIcon className="h-5 w-5 text-blue-500" /> Exportar</button></li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default function GestionPracticantesEmisor() {
  const [practicantes, setPracticantes] = useState(practicantesIniciales);
  const [currentPage, setCurrentPage] = useState(1);
  const [modal, setModal] = useState({ isOpen: false, type: null, data: null });
  const fileInputRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [areaFiltro, setAreaFiltro] = useState('Todos');
  const [fechaInicioFiltro, setFechaInicioFiltro] = useState('');
  const [fechaFinFiltro, setFechaFinFiltro] = useState('');

  const practicantesFiltrados = useMemo(() => {
    setCurrentPage(1);
    return practicantes.filter(p => {
        const nombreCompleto = `${p.nombres} ${p.apellidos}`.toLowerCase();
        const searchMatch = nombreCompleto.includes(searchTerm.toLowerCase()) || p.dni.includes(searchTerm);
        const areaMatch = areaFiltro === 'Todos' || p.areaProyecto === areaFiltro;
        const fechaInicioPracticante = parseDate(p.fechaInicio);
        const filtroInicio = fechaInicioFiltro ? new Date(fechaInicioFiltro) : null;
        const dateStartMatch = !filtroInicio || fechaInicioPracticante >= filtroInicio;
        const fechaFinPracticante = parseDate(p.fechaFin);
        const filtroFin = fechaFinFiltro ? new Date(fechaFinFiltro) : null;
        const dateEndMatch = !filtroFin || fechaFinPracticante <= filtroFin;
        return searchMatch && areaMatch && dateStartMatch && dateEndMatch;
    });
  }, [practicantes, searchTerm, areaFiltro, fechaInicioFiltro, fechaFinFiltro]);

  const paginasTotales = Math.ceil(practicantesFiltrados.length / ITEMS_PER_PAGE);

  const practicantesActuales = useMemo(() => {
    const inicio = (currentPage - 1) * ITEMS_PER_PAGE;
    return practicantesFiltrados.slice(inicio, inicio + ITEMS_PER_PAGE);
  }, [practicantesFiltrados, currentPage]);

  const nextPage = useCallback(() => setCurrentPage(current => Math.min(current + 1, paginasTotales)), [paginasTotales]);
  const prevPage = useCallback(() => setCurrentPage(current => Math.max(current - 1, 1)), []);
  const closeModal = () => setModal({ isOpen: false, type: null, data: null });

  const handleSave = (formData) => {
    if (modal.type === 'edit') {
      setPracticantes(practicantes.map(p => p.id === modal.data.id ? { ...p, ...formData } : p));
    } else {
      setPracticantes([{ id: Date.now(), ...formData, activo: true }, ...practicantes]);
    }
    closeModal();
  };

  const handleDelete = () => { setPracticantes(practicantes.filter(p => p.id !== modal.data.id)); closeModal(); };
  const handleToggleActivo = () => { setPracticantes(practicantes.map(p => p.id === modal.data.id ? { ...p, activo: !p.activo } : p)); closeModal(); };
  
  // --- LÓGICA DE EXPORTACIÓN Y PLANTILLA CON ESTILOS USANDO XLSX ---

  const createStyledExcel = (data, headers, colWidths, fileName) => {
    const wb = XLSX.utils.book_new();
    const ws_data = [headers, ...data.map(obj => headers.map(key => obj[key]))];
    const ws = XLSX.utils.aoa_to_sheet(ws_data);

    // Estilos de la cabecera
    const headerStyle = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "4F46E5" } }, // Color índigo similar a Tailwind
      alignment: { horizontal: "center", vertical: "center" }
    };

    // Aplicar estilos a cada celda de la cabecera
    headers.forEach((_, i) => {
        const cellRef = XLSX.utils.encode_cell({ c: i, r: 0 });
        if (ws[cellRef]) {
            ws[cellRef].s = headerStyle;
        }
    });

    // Asignar anchos de columna
    ws['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, "Practicantes");
    XLSX.writeFile(wb, fileName);
  };

  const handleDownloadTemplate = () => {
    const headers = {
        nombres: "Nombres",
        apellidos: "Apellidos",
        dni: "DNI",
        correo: "Correo",
        areaProyecto: "Área/Proyecto",
        "fechaInicio(dd/mm/yy)": "Fecha Inicio (dd/mm/yy)",
        "fechaFin(dd/mm/yy)": "Fecha Fin (dd/mm/yy)"
    };
    const colWidths = [
        { wch: 20 }, { wch: 20 }, { wch: 15 }, { wch: 30 }, 
        { wch: 25 }, { wch: 25 }, { wch: 25 }
    ];
    // Se pasa un array vacío de datos para solo generar la cabecera
    createStyledExcel([{}], Object.values(headers), colWidths, "plantilla_practicantes.xlsx");
  };

  const handleExport = () => {
    if (practicantesFiltrados.length === 0) {
      alert("No hay datos para exportar con los filtros actuales.");
      return;
    }

    const headers = {
        nombres: "Nombres",
        apellidos: "Apellidos",
        dni: "DNI",
        correo: "Correo",
        areaProyecto: "Área/Proyecto",
        fechaInicio: "Fecha Inicio",
        fechaFin: "Fecha Fin",
        estado: "Estado"
    };

    const dataToExport = practicantesFiltrados.map(p => ({
      nombres: p.nombres,
      apellidos: p.apellidos,
      dni: p.dni,
      correo: p.correo,
      areaProyecto: p.areaProyecto,
      fechaInicio: p.fechaInicio,
      fechaFin: p.fechaFin,
      estado: p.activo ? 'Activo' : 'Inactivo'
    }));
    
    const colWidths = [
        { wch: 20 }, { wch: 20 }, { wch: 15 }, { wch: 30 },
        { wch: 25 }, { wch: 20 }, { wch: 20 }, { wch: 10 }
    ];

    createStyledExcel(dataToExport, Object.values(headers), colWidths, "reporte_practicantes.xlsx");
  };
  
  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const rows = text.split('\n').slice(1);
        const nuevosPracticantes = rows.map((row, index) => {
          const columns = row.trim().split(',');
          if (columns.length < 7) return null;
          return {
            id: Date.now() + index,
            nombres: columns[0] || '',
            apellidos: columns[1] || '',
            dni: columns[2] || '',
            correo: columns[3] || '',
            areaProyecto: columns[4] || '',
            fechaInicio: columns[5] || '',
            fechaFin: columns[6] || '',
            activo: true
          };
        }).filter(Boolean);
        setPracticantes(prev => [...prev, ...nuevosPracticantes]);
        alert(`${nuevosPracticantes.length} practicantes importados con éxito.`);
      };
      reader.readAsText(file);
    }
    event.target.value = null;
  };

  return (
    <div className="space-y-6">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".csv" />
      <h1 className="text-3xl font-bold text-gray-800">Mnt. Practicantes</h1>
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Gestión de practicantes</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
          <div className="col-span-1 lg:col-span-4">
            <label htmlFor="search-practicante" className="block text-sm font-medium text-gray-700 mb-1">Practicante</label>
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" id="search-practicante" placeholder="Buscar por Nombre o DNI" value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} className="form-input block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div className="col-span-1 sm:col-span-1 lg:col-span-3">
            <label htmlFor="area-proyecto" className="block text-sm font-medium text-gray-700 mb-1">Área/Proyecto</label>
            <select id="area-proyecto" value={areaFiltro} onChange={(e) => setAreaFiltro(e.target.value)} className="form-select block w-full border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 py-2 pl-3 pr-10">
              <option>Todos</option><option>Desarrollo de Software</option><option>Soporte de TI</option><option>Análisis de Datos</option><option>Marketing Digital</option>
            </select>
          </div>
          <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">Rango de Fechas</label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <input type="date" value={fechaInicioFiltro} onChange={(e) => setFechaInicioFiltro(e.target.value)} className="form-input block w-full border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 py-1.5 px-3" />
              <span className="hidden sm:block">-</span>
              <input type="date" value={fechaFinFiltro} onChange={(e) => setFechaFinFiltro(e.target.value)} className="form-input block w-full border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 py-1.5 px-3" />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-6 mt-6 border-t border-gray-200">
          <button onClick={handleDownloadTemplate} className="flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium">
            <DocumentArrowDownIcon className="h-5 w-5" /> Descargar plantilla
          </button>
          <div className="flex items-center gap-4 sm:ml-auto w-full sm:w-auto">
            <div className="w-full sm:w-auto"><ToolsDropdown onImport={handleImportClick} onExport={handleExport}/></div>
            <button onClick={() => setModal({ isOpen: true, type: 'new' })} className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 w-full sm:w-auto">
              <PlusIcon className="h-5 w-5" />
              <span className="sm/hidden">Practicante</span><span className="hidden sm:inline">Crear Practicante</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden flex flex-col min-h-[400px]">
        <div className="overflow-x-auto flex-grow">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
              <tr>
                <th scope="col" className="px-6 py-4">Practicante</th><th scope="col" className="px-6 py-4">DNI</th><th scope="col" className="px-6 py-4">Correo</th><th scope="col" className="px-6 py-4">Área/Proyecto</th><th scope="col" className="px-6 py-4">Periodo</th><th scope="col" className="px-6 py-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {practicantesActuales.length > 0 ? (
                practicantesActuales.map((p) => (
                  <tr key={p.id} className={`bg-white border-b hover:bg-gray-50 ${!p.activo ? 'bg-gray-50 text-gray-400' : ''}`}>
                    <td className="px-6 py-4"><div className={`font-medium ${p.activo ? 'text-gray-900' : ''}`}>{p.nombres} {p.apellidos}</div></td>
                    <td className="px-6 py-4">{p.dni}</td><td className="px-6 py-4">{p.correo}</td><td className="px-6 py-4">{p.areaProyecto}</td><td className="px-6 py-4">{p.fechaInicio} - {p.fechaFin}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center items-center gap-3">
                        <button onClick={() => setModal({ isOpen: true, type: 'edit', data: p })} title="Editar" className="text-yellow-500 hover:text-yellow-700 disabled:opacity-50" disabled={!p.activo}><PencilIcon className="h-5 w-5"/></button>
                        <button onClick={() => setModal({ isOpen: true, type: p.activo ? 'deactivate' : 'reactivate', data: p })} title={p.activo ? 'Desactivar' : 'Reactivar'}>
                          {p.activo ? <EyeIcon className="h-5 w-5 text-gray-500 hover:text-gray-700"/> : <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600"/>}
                        </button>
                        <button onClick={() => setModal({ isOpen: true, type: 'delete', data: p })} title="Eliminar" className="text-red-500 hover:text-red-700 disabled:opacity-50" disabled={!p.activo}><TrashIcon className="h-5 w-5"/></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" className="text-center py-16 px-6 text-gray-500">No se encontraron practicantes con los filtros aplicados.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        
        {practicantesFiltrados.length > 0 && paginasTotales > 1 && (
            <div className="flex justify-center items-center p-4 bg-white border-t border-gray-200">
                <nav className="flex items-center gap-4" aria-label="Pagination">
                  <button onClick={prevPage} disabled={currentPage === 1} className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"><ChevronLeftIcon className="h-5 w-5" /> Anterior</button>
                  <span className="text-sm text-gray-700">Página {currentPage} de {paginasTotales}</span>
                  <button onClick={nextPage} disabled={currentPage === paginasTotales} className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Siguiente <ChevronRightIcon className="h-5 w-5" /></button>
                </nav>
            </div>
        )}
      </div>

      <ModalBase isOpen={modal.isOpen} onClose={closeModal} maxWidth="md:max-w-xl">
        { (modal.type === 'new' || modal.type === 'edit') && <FormularioPracticante onClose={closeModal} onSave={handleSave} practicante={modal.data} /> }
        { modal.type === 'delete' && <ModalConfirmacion variant="danger" title="¿Estás seguro?" message={`Esta acción eliminará al practicante permanentemente.`} confirmText="Sí, eliminar" onConfirm={handleDelete} onClose={closeModal}/> }
        { modal.type === 'deactivate' && <ModalConfirmacion variant="warning" title="¿Estás seguro?" message={`Vas a desactivar este practicante.`} confirmText="Sí, desactivar" onConfirm={handleToggleActivo} onClose={closeModal}/> }
        { modal.type === 'reactivate' && <ModalConfirmacion variant="success" title="¿Estás seguro?" message={`Vas a reactivar este practicante.`} confirmText="Sí, reactivar" onConfirm={handleToggleActivo} onClose={closeModal}/> }
      </ModalBase>
    </div>
  );
}