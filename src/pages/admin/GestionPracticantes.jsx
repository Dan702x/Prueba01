import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
  MagnifyingGlassIcon, PlusIcon, ChevronDownIcon, PencilIcon,
  TrashIcon, EyeIcon, EyeSlashIcon, ChevronLeftIcon, ChevronRightIcon,
  DocumentArrowUpIcon, DocumentArrowDownIcon
} from '@heroicons/react/24/solid';
import ModalBase from '../../components/common/ModalBase';
import FormularioPracticante from './FormularioPracticante';
import ModalConfirmacion from '../../components/common/ModalConfirmacion';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';


const practicantesIniciales = [
  { id: 1, nombres: 'Carlos', apellidos: 'López', dni: '12345678', correo: 'carlos.lopez@example.com', areaProyecto: 'Desarrollo de Software', fechaInicio: '2025-08-01', fechaFin: '2025-10-31', activo: true },
  { id: 2, nombres: 'Julio', apellidos: 'Bejar', dni: '87654321', correo: 'julio.bejar@example.com', areaProyecto: 'Soporte de TI', fechaInicio: '2025-08-01', fechaFin: '2025-10-31', activo: false },
  { id: 3, nombres: 'Ana', apellidos: 'García', dni: '11223344', correo: 'ana.garcia@example.com', areaProyecto: 'Análisis de Datos', fechaInicio: '2025-09-15', fechaFin: '2025-12-15', activo: true },
  { id: 4, nombres: 'Luis', apellidos: 'Martinez', dni: '44556677', correo: 'luis.martinez@example.com', areaProyecto: 'Desarrollo de Software', fechaInicio: '2025-10-01', fechaFin: '2025-12-31', activo: true },
  { id: 5, nombres: 'Maria', apellidos: 'Rodriguez', dni: '88990011', correo: 'maria.r@example.com', areaProyecto: 'Soporte de TI', fechaInicio: '2025-08-01', fechaFin: '2025-10-31', activo: true },
  { id: 6, nombres: 'Sofia', apellidos: 'Hernandez', dni: '22334455', correo: 'sofia.h@example.com', areaProyecto: 'Marketing Digital', fechaInicio: '2025-09-20', fechaFin: '2025-12-20', activo: true },
  { id: 7, nombres: 'Jorge', apellidos: 'Perez', dni: '66778899', correo: 'jorge.p@example.com', areaProyecto: 'Desarrollo de Software', fechaInicio: '2025-11-01', fechaFin: '2026-01-31', activo: false },
  { id: 8, nombres: 'Laura', apellidos: 'Gomez', dni: '10203040', correo: 'laura.g@example.com', areaProyecto: 'Análisis de Datos', fechaInicio: '2025-08-01', fechaFin: '2025-10-31', activo: true },
  { id: 9, nombres: 'Pedro', apellidos: 'Ramirez', dni: '50607080', correo: 'pedro.r@example.com', areaProyecto: 'Soporte de TI', fechaInicio: '2025-09-15', fechaFin: '2025-12-15', activo: true },
];
const ITEMS_PER_PAGE = 7;

function ToolsDropdown({ onImport, onExport }) {
  const [isOpen, setIsOpen] = useState(false); const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false); };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-white text-gray-700 font-semibold rounded-lg border border-gray-300 shadow-sm hover:bg-gray-50">
        Herramientas <ChevronDownIcon className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 bg-white rounded-md shadow-lg z-10 border border-gray-200">
          <ul className="py-1">
            <li><button onClick={onImport} className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><DocumentArrowUpIcon className="h-5 w-5 text-teal-500" /> Importar CSV/Excel</button></li>
            <li><button onClick={onExport} className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"><DocumentArrowDownIcon className="h-5 w-5 text-blue-500" /> Exportar a Excel</button></li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default function GestionPracticantes() {
  const [practicantes, setPracticantes] = useState(practicantesIniciales);
  const [searchTerm, setSearchTerm] = useState('');
  const [areaFilter, setAreaFilter] = useState('Todos');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [modal, setModal] = useState({ isOpen: false, type: null, data: null });
  const fileInputRef = useRef(null);

  const practicantesFiltrados = useMemo(() => {
    const parseDateUTC = (dateString) => {
        if (!dateString) return null;
        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(Date.UTC(year, month - 1, day));
    };
    
    return practicantes.filter(p => {
      const searchMatch = `${p.nombres} ${p.apellidos}`.toLowerCase().includes(searchTerm.toLowerCase()) || p.dni.includes(searchTerm);
      const areaMatch = areaFilter === 'Todos' || p.areaProyecto === areaFilter;

      let dateMatch = true;
      const practicanteStartDate = parseDateUTC(p.fechaInicio);
      const practicanteEndDate = parseDateUTC(p.fechaFin);
      const filterStartDate = parseDateUTC(startDate);
      const filterEndDate = parseDateUTC(endDate);

      if (filterStartDate && practicanteStartDate < filterStartDate) {
        dateMatch = false;
      }

      if (filterEndDate && practicanteEndDate > filterEndDate) {
        dateMatch = false;
      }
      
      return searchMatch && areaMatch && dateMatch;
    });
  }, [practicantes, searchTerm, areaFilter, startDate, endDate]);

  const paginasTotales = Math.ceil(practicantesFiltrados.length / ITEMS_PER_PAGE);
  const practicantesActuales = useMemo(() => {
    const inicio = (currentPage - 1) * ITEMS_PER_PAGE;
    return practicantesFiltrados.slice(inicio, inicio + ITEMS_PER_PAGE);
  }, [practicantesFiltrados, currentPage]);

  const handleFilterChange = useCallback((setter) => (event) => {
    setter(event.target.value);
    setCurrentPage(1);
  }, []);
  
  const nextPage = useCallback(() => setCurrentPage(c => Math.min(c + 1, paginasTotales)), [paginasTotales]);
  const prevPage = useCallback(() => setCurrentPage(c => Math.max(c - 1, 1)), []);
  const closeModal = () => setModal({ isOpen: false, type: null, data: null });

  const handleSave = (formData) => {
    if (modal.type === 'edit') setPracticantes(practicantes.map(p => p.id === modal.data.id ? { ...p, ...formData } : p));
    else setPracticantes([{ id: Date.now(), ...formData, activo: true }, ...practicantes]);
    closeModal();
  };
  const handleDelete = () => { setPracticantes(practicantes.filter(p => p.id !== modal.data.id)); closeModal(); };
  const handleToggleActivo = () => { setPracticantes(practicantes.map(p => p.id === modal.data.id ? { ...p, activo: !p.activo } : p)); closeModal(); };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00');
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };
  
  const handleDownloadTemplate = async () => {
    const wb = new ExcelJS.Workbook();
    
    // --- PESTAÑA DE INSTRUCCIONES ---
    const instructionsWs = wb.addWorksheet("Instrucciones");
    instructionsWs.addRow(["Guía para Llenar la Plantilla de Practicantes"]);
    instructionsWs.mergeCells('A1:B1');
    instructionsWs.getCell('A1').font = { name: 'Arial Black', size: 16, color: { argb: 'FF2F5597' } };
    instructionsWs.getCell('A1').alignment = { horizontal: 'center' };
    instructionsWs.getRow(1).height = 30;
    instructionsWs.addRow([]);

    const instructions = [
        ['Campo', 'Descripción y Formato'],
        ['nombres', 'Nombres completos del practicante. (Texto)'],
        ['apellidos', 'Apellidos completos del practicante. (Texto)'],
        ['dni', 'Documento Nacional de Identidad. (8 dígitos numéricos, sin puntos ni guiones)'],
        ['correo', 'Correo electrónico válido del practicante. (ejemplo@email.com)'],
        ['areaProyecto', 'Área o proyecto asignado. Seleccionar de la lista desplegable en la plantilla.'],
        ['fechaInicio (YYYY-MM-DD)', 'Fecha de inicio de las prácticas en formato AÑO-MES-DÍA. (Ej: 2025-10-29)'],
        ['fechaFin (YYYY-MM-DD)', 'Fecha de fin de las prácticas en formato AÑO-MES-DÍA. (Ej: 2026-01-29)'],
    ];

    // --- NUEVO: Estilo de borde para la tabla de instrucciones ---
    const borderStyle = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

    instructions.forEach((row, index) => {
        const addedRow = instructionsWs.addRow(row);
        addedRow.eachCell(cell => {
            cell.border = borderStyle; // Aplicar borde a todas las celdas
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            if (index === 0) { // Estilo especial para la cabecera
                cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };
            }
        });
    });

    instructionsWs.columns = [{ width: 30 }, { width: 80 }];

    // --- PESTAÑA DE PLANTILLA MEJORADA ---
    const templateWs = wb.addWorksheet("Plantilla");

    templateWs.addRow(["NOTA: Por favor, borre la fila de ejemplo (Fila 3) y comience a llenar sus datos en esa línea."]);
    templateWs.mergeCells('A1:G1');
    templateWs.getCell('A1').font = { bold: true, color: { argb: 'FFC00000' } };
    templateWs.getCell('A1').alignment = { horizontal: 'center' };
    templateWs.addRow([]);

    const headers = ["nombres", "apellidos", "dni", "correo", "areaProyecto", "fechaInicio (YYYY-MM-DD)", "fechaFin (YYYY-MM-DD)"];
    const headerRow = templateWs.addRow(headers);

    headerRow.eachCell((cell) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };
        cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
        cell.border = borderStyle;
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    const exampleRow = templateWs.addRow([
        "Juan Alberto", "Pérez García", 12345678, "juan.perez@email.com", "Desarrollo de Software", "2025-11-01", "2026-02-01"
    ]);
    
    // --- CAMBIO: Estilo de la fila de ejemplo a texto negro normal, manteniendo bordes y centrado ---
    exampleRow.eachCell(cell => {
        cell.font = { color: { argb: 'FF000000' } }; // Texto negro
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = borderStyle;
    });

    // Añadir bordes a 50 filas vacías para dar la apariencia de una tabla
    for (let i = 0; i < 50; i++) {
        const row = templateWs.addRow([]);
        row.eachCell({ includeEmpty: true }, (cell) => {
            cell.border = borderStyle;
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
        });
    }

    const areas = '"Desarrollo de Software,Soporte de TI,Análisis de Datos,Marketing Digital"';
    for (let i = 4; i <= 54; i++) { // Aplicar validación desde la fila 4 en adelante
        templateWs.getCell(`C${i}`).dataValidation = {
            type: 'whole', operator: 'between', formulae: [10000000, 99999999],
            allowBlank: true, showErrorMessage: true, errorStyle: 'error',
            errorTitle: 'DNI Inválido', error: 'El DNI debe ser un número de 8 dígitos.'
        };
        templateWs.getCell(`E${i}`).dataValidation = {
            type: 'list', allowBlank: true, formulae: [areas]
        };
    }
    
    templateWs.columns = [
        { width: 25 }, { width: 25 }, { width: 15 }, { width: 35 },
        { width: 30 }, { width: 25 }, { width: 25 }
    ];
    
    const buffer = await wb.xlsx.writeBuffer();
    // --- CAMBIO: Nombre del archivo sin "_v2" ---
    saveAs(new Blob([buffer]), 'plantilla_practicantes.xlsx');
  };

  const handleExport = async () => {
    if (practicantesFiltrados.length === 0) {
        alert("No hay datos para exportar.");
        return;
    }

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Reporte");

    ws.addRow(["Reporte de Practicantes - CERTIFY"]);
    ws.mergeCells('A1:H1');
    const titleCell = ws.getCell('A1');
    titleCell.font = { name: 'Arial Black', size: 16, color: { argb: 'FF2F5597' } };
    titleCell.alignment = { horizontal: 'center' };
    ws.getRow(1).height = 30;
    ws.addRow([]);

    const filtersTitleRow = ws.addRow(["Filtros Aplicados"]);
    ws.mergeCells(`A${filtersTitleRow.number}:H${filtersTitleRow.number}`);
    const filtersTitleCell = ws.getCell(`A${filtersTitleRow.number}`);
    filtersTitleCell.font = { name: 'Arial', size: 12, bold: true, color: { argb: 'FF4472C4' } };
    filtersTitleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE9EFFF' } };

    const filtersData = [
        ["Búsqueda:", searchTerm || "Todos"],
        ["Área/Proyecto:", areaFilter || "Todos"],
        ["Fecha Inicio:", startDate ? formatDate(startDate) : "N/A"],
        ["Fecha Fin:", endDate ? formatDate(endDate) : "N/A"],
    ];
    filtersData.forEach(([label, value]) => {
        const row = ws.addRow([label, value]);
        ws.getCell(`A${row.number}`).font = { bold: true };
    });
    ws.addRow([]);

    const headers = ['Nombres', 'Apellidos', 'DNI', 'Correo', 'Área/Proyecto', 'Fecha Inicio', 'Fecha Fin', 'Estado'];
    const headerRow = ws.addRow(headers);
    headerRow.eachCell((cell) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };
        cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    const cellBorder = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    practicantesFiltrados.forEach(p => {
        const row = ws.addRow([
            p.nombres, p.apellidos, p.dni, p.correo, p.areaProyecto,
            formatDate(p.fechaInicio), formatDate(p.fechaFin), p.activo ? 'Activo' : 'Inactivo'
        ]);
        row.eachCell((cell) => {
            cell.border = cellBorder;
        });
    });

    ws.columns = [
        { key: 'Nombres', width: 25 }, { key: 'Apellidos', width: 25 }, { key: 'DNI', width: 15 },
        { key: 'Correo', width: 35 }, { key: 'Área/Proyecto', width: 30 }, { key: 'Fecha Inicio', width: 15 },
        { key: 'Fecha Fin', width: 15 }, { key: 'Estado', width: 12 },
    ];

    const buffer = await wb.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), 'reporte_practicantes.xlsx');
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = new ExcelJS.Workbook();
        try {
            await workbook.xlsx.load(data);
            const worksheet = workbook.getWorksheet("Plantilla") || workbook.getWorksheet(1);
            if (!worksheet) {
                alert("No se pudo encontrar una hoja de cálculo válida en el archivo.");
                return;
            }

            const jsonData = [];
            const headers = (worksheet.getRow(3).values || []).filter(Boolean);

            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber > 3) { 
                    let rowData = {};
                    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                        const header = String(headers[colNumber-1] || '').trim();
                        if (header) {
                           rowData[header] = cell.value;
                        }
                    });
                    if(Object.values(rowData).some(val => val !== null && val !== undefined && val !== '')) {
                        jsonData.push(rowData);
                    }
                }
            });
            processImportedData(jsonData);
        } catch (error) {
            console.error("Error al leer el archivo Excel:", error);
            alert("Hubo un error al procesar el archivo. Asegúrate de que sea un formato válido (.xlsx, .csv).");
        }
    };
    reader.readAsArrayBuffer(file);
    fileInputRef.current.value = "";
  };
  
  const processImportedData = (data) => {
    const nuevosPracticantes = [];
    const errores = [];
    const dnisCorreosExistentes = new Set(practicantes.map(p => `${p.dni}-${p.correo}`));

    data.forEach((fila, index) => {
        const headerMap = Object.keys(fila).reduce((acc, key) => {
            acc[key.trim()] = fila[key];
            return acc;
        }, {});

        const { nombres, apellidos, dni, correo, areaProyecto } = headerMap;
        const fechaInicioRaw = headerMap['fechaInicio (YYYY-MM-DD)'];
        const fechaFinRaw = headerMap['fechaFin (YYYY-MM-DD)'];
        const numFila = index + 4;

        const formatDateFromExcel = (excelDate) => {
            if (excelDate instanceof Date) {
                return excelDate.toISOString().split('T')[0];
            }
            if (typeof excelDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(excelDate)) {
                return excelDate;
            }
            if (typeof excelDate === 'number' && excelDate > 1) {
                const date = new Date(Date.UTC(1900, 0, excelDate - 1));
                return date.toISOString().split('T')[0];
            }
            return null;
        }

        const fechaInicio = formatDateFromExcel(fechaInicioRaw);
        const fechaFin = formatDateFromExcel(fechaFinRaw);
        
        if (nombres === 'Juan Alberto' && String(dni) === '12345678') return;

        if (!nombres && !apellidos && !dni && !correo && !fechaInicio && !fechaFin) {
            return;
        }

        if (!nombres || !apellidos || !dni || !correo || !fechaInicio || !fechaFin) {
            errores.push(`Fila ${numFila}: Faltan campos obligatorios.`);
            return;
        }
        if (String(dni).length !== 8 || !/^\d+$/.test(dni)) {
            errores.push(`Fila ${numFila}: DNI inválido (${dni}). Debe tener 8 dígitos numéricos.`);
            return;
        }
        if (dnisCorreosExistentes.has(`${dni}-${correo}`)) {
            errores.push(`Fila ${numFila}: El DNI y correo ya existen.`);
            return;
        }

        nuevosPracticantes.push({
            id: Date.now() + index,
            nombres, apellidos, correo,
            dni: String(dni),
            areaProyecto: areaProyecto || 'No especificado',
            fechaInicio, fechaFin,
            activo: true
        });
        dnisCorreosExistentes.add(`${dni}-${correo}`);
    });

    if (errores.length > 0) {
        alert("Se encontraron errores en la importación:\n\n" + errores.join("\n"));
    } else if (nuevosPracticantes.length > 0) {
        setPracticantes(prev => [...prev, ...nuevosPracticantes]);
        alert(`¡Importación exitosa! Se agregaron ${nuevosPracticantes.length} nuevos practicantes.`);
    } else {
        alert("No se encontraron nuevos practicantes para importar. Revisa el archivo.");
    }
  };

  const triggerImport = () => { fileInputRef.current.click(); };

  // El resto del JSX se mantiene igual, no es necesario cambiarlo.
  return (
    <div className="space-y-6">
      {/* ... JSX sin cambios ... */}
       <h1 className="text-3xl font-bold text-gray-800">Gestión Practicantes</h1>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImport}
        style={{ display: 'none' }}
        accept=".xlsx, .xls, .csv"
      />
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Filtros</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
          <div className="col-span-1 lg:col-span-4">
            <label htmlFor="search-practicante" className="block text-sm font-medium text-gray-700 mb-1">Practicante</label>
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" id="search-practicante" placeholder="Buscar por Nombre o DNI" value={searchTerm}
                onChange={handleFilterChange(setSearchTerm)} className="form-input block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="col-span-1 sm:col-span-1 lg:col-span-3">
            <label htmlFor="area-proyecto" className="block text-sm font-medium text-gray-700 mb-1">Área/Proyecto</label>
            <select id="area-proyecto" value={areaFilter} onChange={handleFilterChange(setAreaFilter)} className="form-select block w-full border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 py-2 pl-3 pr-10">
              <option>Todos</option><option>Desarrollo de Software</option><option>Soporte de TI</option><option>Análisis de Datos</option><option>Marketing Digital</option>
            </select>
          </div>

          <div className="col-span-1 md:col-span-2 lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
             <div>
                <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
                <input type="date" id="start-date" value={startDate} onChange={handleFilterChange(setStartDate)} className="form-input block w-full border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 py-1.5 px-3" />
             </div>
             <div>
                <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
                <input type="date" id="end-date" value={endDate} onChange={handleFilterChange(setEndDate)} className="form-input block w-full border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 py-1.5 px-3" />
             </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-6 mt-6 border-t border-gray-200">
          <button onClick={handleDownloadTemplate} className="flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium">
              <DocumentArrowDownIcon className="h-5 w-5" /> Descargar plantilla
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4 sm:ml-auto w-full sm:w-auto">
            <div className="w-full sm:w-auto"><ToolsDropdown onImport={triggerImport} onExport={handleExport}/></div>
            <button onClick={() => setModal({ isOpen: true, type: 'new' })} className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 w-full sm:w-auto">
              <PlusIcon className="h-5 w-5" />
              <span className="sm:hidden">Practicante</span><span className="hidden sm:inline">Crear Practicante</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden flex flex-col min-h-[400px]">
        <div className="overflow-x-auto flex-grow">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
              <tr><th className="px-6 py-4">Practicante</th><th className="px-6 py-4">DNI</th><th className="px-6 py-4">Correo</th><th className="px-6 py-4">Área/Proyecto</th><th className="px-6 py-4">Periodo</th><th className="px-6 py-4 text-center">Acciones</th></tr>
            </thead>
            <tbody>
              {practicantesActuales.length > 0 ? (
                practicantesActuales.map((p) => (
                  <tr key={p.id} className={`bg-white border-b hover:bg-gray-50 ${!p.activo ? 'bg-gray-50 text-gray-400' : ''}`}>
                    <td className="px-6 py-4"><div className={`font-medium ${p.activo ? 'text-gray-900' : ''}`}>{p.nombres} {p.apellidos}</div></td>
                    <td className="px-6 py-4">{p.dni}</td><td className="px-6 py-4">{p.correo}</td><td className="px-6 py-4">{p.areaProyecto}</td><td className="px-6 py-4">{formatDate(p.fechaInicio)} - {formatDate(p.fechaFin)}</td>
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