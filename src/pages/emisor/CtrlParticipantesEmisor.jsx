import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
  MagnifyingGlassIcon, PlusIcon, ChevronDownIcon, PencilIcon,
  TrashIcon, EyeIcon, EyeSlashIcon, ChevronLeftIcon, ChevronRightIcon,
  DocumentArrowUpIcon, DocumentArrowDownIcon,
  ArrowPathIcon
} from '@heroicons/react/24/solid';
import ModalBase from '../../components/common/ModalBase';
import FormularioParticipante from '../admin/FormularioParticipante'; 
import ModalConfirmacion from '../../components/common/ModalConfirmacion';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const participantesIniciales = [
  { id: 1, nombres: 'Carlos', apellidos: 'López', dni: '12345678', correo: 'carlos.lopez@example.com', area: 'Desarrollo de Software', fechaRegistro: '2025-10-01', activo: true },
  { id: 2, nombres: 'Julio', apellidos: 'Bejar', dni: '87654321', correo: 'julio.bejar@example.com', area: 'Soporte de TI', fechaRegistro: '2025-10-02', activo: false },
  { id: 3, nombres: 'Ana', apellidos: 'García', dni: '11223344', correo: 'ana.garcia@example.com', area: 'Análisis de Datos', fechaRegistro: '2025-10-05', activo: true },
  { id: 4, nombres: 'Luis', apellidos: 'Martinez', dni: '44556677', correo: 'luis.martinez@example.com', area: 'Desarrollo de Software', fechaRegistro: '2025-10-10', activo: true },
  { id: 5, nombres: 'Maria', apellidos: 'Rodriguez', dni: '88990011', correo: 'maria.r@example.com', area: 'Participante', fechaRegistro: '2025-10-12', activo: true },
  { id: 6, nombres: 'Sofia', apellidos: 'Hernandez', dni: '22334455', correo: 'sofia.h@example.com', area: 'Marketing Digital', fechaRegistro: '2025-10-15', activo: true },
  { id: 7, nombres: 'Jorge', apellidos: 'Perez', dni: '66778899', correo: 'jorge.p@example.com', area: 'Desarrollo de Software', fechaRegistro: '2025-10-20', activo: false },
  { id: 8, nombres: 'Laura', apellidos: 'Gomez', dni: '10203040', correo: 'laura.g@example.com', area: 'Análisis de Datos', fechaRegistro: '2025-10-22', activo: true },
  { id: 9, nombres: 'Pedro', apellidos: 'Ramirez', dni: '50607080', correo: 'pedro.r@example.com', area: 'Participante', fechaRegistro: '2025-10-25', activo: true },
];

const ITEMS_PER_PAGE = 5;

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

export default function CtrlParticipantesEmisor() {
  const [participantes, setParticipantes] = useState(participantesIniciales);
  const [searchTerm, setSearchTerm] = useState('');
  const [areaFilter, setAreaFilter] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);
  const [modal, setModal] = useState({ isOpen: false, type: null, data: null });
  const fileInputRef = useRef(null);

  const participantesFiltrados = useMemo(() => {
    return participantes.filter(p => {
      const searchMatch = `${p.nombres} ${p.apellidos}`.toLowerCase().includes(searchTerm.toLowerCase()) || p.dni.includes(searchTerm);
      const areaMatch = areaFilter === 'Todos' || p.area === areaFilter;
      return searchMatch && areaMatch;
    });
  }, [participantes, searchTerm, areaFilter]);

  const paginasTotales = Math.ceil(participantesFiltrados.length / ITEMS_PER_PAGE);
  
  const participantesActuales = useMemo(() => {
    const inicio = (currentPage - 1) * ITEMS_PER_PAGE;
    return participantesFiltrados.slice(inicio, inicio + ITEMS_PER_PAGE);
  }, [participantesFiltrados, currentPage]);

  const handleFilterChange = useCallback((setter) => (event) => {
    setter(event.target.value);
    setCurrentPage(1);
  }, []);

  const handleClearFilters = () => {
    setSearchTerm('');
    setAreaFilter('Todos');
    setCurrentPage(1);
  };
  
  const nextPage = useCallback(() => setCurrentPage(c => Math.min(c + 1, paginasTotales)), [paginasTotales]);
  const prevPage = useCallback(() => setCurrentPage(c => Math.max(c - 1, 1)), []);
  const closeModal = () => setModal({ isOpen: false, type: null, data: null });

  const handleSave = (formData) => {
    if (modal.type === 'edit') setParticipantes(participantes.map(p => p.id === modal.data.id ? { ...p, ...formData } : p));
    else setParticipantes([{ id: Date.now(), ...formData, activo: true }, ...participantes]);
    closeModal();
  };
  
  const handleToggleActivo = () => { 
    setParticipantes(participantes.map(p => p.id === modal.data.id ? { ...p, activo: !p.activo } : p)); 
    closeModal(); 
  };

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
    const templateWs = wb.addWorksheet("Plantilla");

    templateWs.addRow(["NOTA: Por favor, borre la fila de ejemplo (Fila 3) y comience a llenar sus datos en esa línea."]);
    templateWs.mergeCells('A1:E1'); 
    templateWs.getCell('A1').font = { bold: true, color: { argb: 'FFC00000' } };
    templateWs.getCell('A1').alignment = { horizontal: 'center' };
    templateWs.addRow([]);

    const headers = ["nombres", "apellidos", "dni", "area", "fechaRegistro (YYYY-MM-DD)"];
    const headerRow = templateWs.addRow(headers);
    const borderStyle = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

    headerRow.eachCell((cell) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };
        cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
        cell.border = borderStyle;
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    const exampleRow = templateWs.addRow([
        "Juan Alberto", "Pérez García", 12345678, "Desarrollo de Software", "2025-10-25"
    ]);
    
    exampleRow.eachCell(cell => {
        cell.font = { color: { argb: 'FF000000' } };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = borderStyle;
    });

    for (let i = 0; i < 50; i++) {
        const row = templateWs.addRow([]);
        row.eachCell({ includeEmpty: true }, (cell) => { cell.border = borderStyle; cell.alignment = { horizontal: 'center', vertical: 'middle' }; });
    }

    const areas = '"Desarrollo de Software,Soporte de TI,Análisis de Datos,Marketing Digital,Participante"';
    for (let i = 4; i <= 54; i++) {
        templateWs.getCell(`C${i}`).dataValidation = {
            type: 'whole', operator: 'between', formulae: [10000000, 99999999],
            allowBlank: true, showErrorMessage: true, errorStyle: 'error',
            errorTitle: 'DNI Inválido', error: 'El DNI debe ser un número de 8 dígitos.'
        };
        templateWs.getCell(`D${i}`).dataValidation = {
            type: 'list', allowBlank: true, formulae: [areas]
        };
        templateWs.getCell(`E${i}`).dataValidation = {
            type: 'date',
            allowBlank: true,
            showErrorMessage: true,
            errorTitle: 'Fecha Inválida',
            error: 'La fecha debe estar en formato YYYY-MM-DD.'
        };
    }
    
    templateWs.columns = [ { width: 25 }, { width: 25 }, { width: 15 }, { width: 35 }, { width: 30 } ]; 
    
    const buffer = await wb.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), 'plantilla_participantes.xlsx');
  };

  const handleExport = async () => {
    if (participantesFiltrados.length === 0) {
        alert("No hay datos para exportar.");
        return;
    }

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Reporte");

    ws.addRow(["Reporte de Participantes - CERTIFY"]);
    ws.mergeCells('A1:G1');
    const titleCell = ws.getCell('A1');
    titleCell.font = { name: 'Arial Black', size: 16, color: { argb: 'FF2F5597' } };
    titleCell.alignment = { horizontal: 'center' };
    ws.getRow(1).height = 30;
    ws.addRow([]);

    const filtersTitleRow = ws.addRow(["Filtros Aplicados"]);
    ws.mergeCells(`A${filtersTitleRow.number}:G${filtersTitleRow.number}`);
    const filtersTitleCell = ws.getCell(`A${filtersTitleRow.number}`);
    filtersTitleCell.font = { name: 'Arial', size: 12, bold: true, color: { argb: 'FF4472C4' } };
    filtersTitleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE9EFFF' } };

    const filtersData = [
        ["Búsqueda:", searchTerm || "Todos"],
        ["Área:", areaFilter || "Todos"],
    ];
    filtersData.forEach(([label, value]) => {
        const row = ws.addRow([label, value]);
        ws.getCell(`A${row.number}`).font = { bold: true };
    });
    ws.addRow([]);

    const headers = ['Nombres', 'Apellidos', 'DNI', 'Correo', 'Área', 'Fecha Registro', 'Estado'];
    const headerRow = ws.addRow(headers);
    headerRow.eachCell((cell) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };
        cell.font = { color: { argb: 'FFFFFFFF' }, bold: true };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    const cellBorder = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    
    participantesFiltrados.forEach(p => {
        const row = ws.addRow([
            p.nombres, p.apellidos, p.dni, p.correo, 
            p.area,
            formatDate(p.fechaRegistro), 
            p.activo ? 'Activo' : 'Inactivo'
        ]);
        row.eachCell((cell) => {
            cell.border = cellBorder;
        });
    });

    ws.columns = [
        { key: 'Nombres', width: 25 }, { key: 'Apellidos', width: 25 }, { key: 'DNI', width: 15 },
        { key: 'Correo', width: 35 }, 
        { key: 'Área', width: 30 },
        { key: 'Fecha Registro', width: 15 }, 
        { key: 'Estado', width: 12 },
    ];

    const buffer = await wb.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), 'reporte_participantes.xlsx');
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

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
            
            processImportedData(jsonData, formatDateFromExcel);

        } catch (error) {
            console.error("Error al leer el archivo Excel:", error);
            alert("Hubo un error al procesar el archivo. Asegúrate de que sea un formato válido (.xlsx, .csv).");
        }
    };
    reader.readAsArrayBuffer(file);
    fileInputRef.current.value = "";
  };
  
  const processImportedData = (data, formatDateFromExcel) => {
    const nuevosParticipantes = [];
    const errores = [];
    const dnisCorreosExistentes = new Set(participantes.map(p => `${p.dni}-${p.correo}`));
    const today = new Date().toISOString().split('T')[0];

    data.forEach((fila, index) => {
        const headerMap = Object.keys(fila).reduce((acc, key) => {
            acc[key.trim()] = fila[key];
            return acc;
        }, {});

        const { nombres, apellidos, dni, correo, area } = headerMap;
        const fechaRegistroRaw = headerMap['fechaRegistro (YYYY-MM-DD)'];
        const numFila = index + 4;
        
        if (nombres === 'Juan Alberto' && String(dni) === '12345678') return;
        if (!nombres && !apellidos && !dni && !correo) { return; }

        if (!nombres || !apellidos || !dni || !correo) {
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

        const fechaRegistro = formatDateFromExcel(fechaRegistroRaw);

        nuevosParticipantes.push({
            id: Date.now() + index,
            nombres, apellidos, correo,
            dni: String(dni),
            area: area || 'No especificado',
            fechaRegistro: fechaRegistro || today,
            activo: true
        });
        dnisCorreosExistentes.add(`${dni}-${correo}`);
    });

    if (errores.length > 0) {
        alert("Se encontraron errores en la importación:\n\n" + errores.join("\n"));
    } else if (nuevosParticipantes.length > 0) {
        // --- CAMBIO DE VARIABLES ---
        setParticipantes(prev => [...prev, ...nuevosParticipantes]);
        alert(`¡Importación exitosa! Se agregaron ${nuevosParticipantes.length} nuevos participantes.`);
    } else {
        alert("No se encontraron nuevos participantes para importar. Revisa el archivo.");
    }
  };

  const triggerImport = () => { fileInputRef.current.click(); };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Control de Participantes</h1>
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
          <div className="col-span-1 lg:col-span-6">
            <label htmlFor="search-participante" className="block text-sm font-medium text-gray-700 mb-1">Participante</label>
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" id="search-participante" placeholder="Buscar por Nombre o DNI" value={searchTerm}
                onChange={handleFilterChange(setSearchTerm)} className="form-input block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="col-span-1 sm:col-span-1 lg:col-span-4">
            <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">Área</label>
            <select id="area" value={areaFilter} onChange={handleFilterChange(setAreaFilter)} className="form-select block w-full border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 py-2 pl-3 pr-10">
              <option>Todos</option>
              <option>Desarrollo de Software</option>
              <option>Soporte de TI</option>
              <option>Análisis de Datos</option>
              <option>Marketing Digital</option>
              <option>Participante</option>
            </select>
          </div>

        <div className="col-span-1 sm:col-span-1 lg:col-span-2">
             <button 
                onClick={handleClearFilters} 
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700"
              >
                <ArrowPathIcon className="h-5 w-5" />
                Limpiar
             </button>
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
              <span className="sm:hidden">Participante</span><span className="hidden sm:inline">Crear Participante</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden flex flex-col min-h-[400px]">
        <div className="overflow-x-auto flex-grow">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
              <tr>
                <th className="px-6 py-4">Participante</th>
                <th className="px-6 py-4">DNI</th>
                <th className="px-6 py-4">Correo</th>
                <th className="px-6 py-4">Área</th>
                <th className="px-6 py-4">Fecha Registro</th>
                <th className="px-6 py-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {participantesActuales.length > 0 ? (
                participantesActuales.map((p) => (
                  <tr key={p.id} className={`bg-white border-b hover:bg-gray-50 ${!p.activo ? 'bg-gray-50 text-gray-400' : ''}`}>
                    <td className="px-6 py-4"><div className={`font-medium ${p.activo ? 'text-gray-900' : ''}`}>{p.nombres} {p.apellidos}</div></td>
                    <td className="px-6 py-4">{p.dni}</td>
                    <td className="px-6 py-4">{p.correo}</td>
                    <td className="px-6 py-4">{p.area}</td>
                    <td className="px-6 py-4">{formatDate(p.fechaRegistro)}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center items-center gap-3">
                        <button 
                          onClick={() => setModal({ isOpen: true, type: 'edit', data: p })} 
                          title="Editar" 
                          className="p-2 rounded-full text-blue-600 bg-blue-100 hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                          disabled={!p.activo}>
                            <PencilIcon className="h-5 w-5"/>
                        </button>
                        <button 
                          onClick={() => setModal({ isOpen: true, type: p.activo ? 'deactivate' : 'reactivate', data: p })} 
                          title={p.activo ? 'Desactivar' : 'Reactivar'}
                          className="p-2 rounded-full text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                          {p.activo ? <EyeIcon className="h-5 w-5"/> : <EyeSlashIcon className="h-5 w-5"/>}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" className="text-center py-16 px-6 text-gray-500">No se encontraron participantes con los filtros aplicados.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {participantesFiltrados.length > 0 && paginasTotales > 1 && (
          <div className="flex justify-center items-center gap-4">
              <nav className="flex items-center gap-4" aria-label="Pagination">
                <button onClick={prevPage} disabled={currentPage === 1} className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"><ChevronLeftIcon className="h-5 w-5" /> Anterior</button>
                <span className="text-sm text-gray-700">Página {currentPage} de {paginasTotales}</span>
                <button onClick={nextPage} disabled={currentPage === paginasTotales} className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Siguiente <ChevronRightIcon className="h-5 w-5" /></button>
              </nav>
          </div>
      )}

      <ModalBase isOpen={modal.isOpen} onClose={closeModal} maxWidth="md:max-w-xl">
        { (modal.type === 'new' || modal.type === 'edit') && <FormularioParticipante onClose={closeModal} onSave={handleSave} participante={modal.data} /> }
        { modal.type === 'deactivate' && <ModalConfirmacion variant="warning" title="¿Desactivar Participante?" message={`Vas a desactivar este participante.`} confirmText="Sí, desactivar" onConfirm={handleToggleActivo} onClose={closeModal}/> }
        { modal.type === 'reactivate' && <ModalConfirmacion variant="success" title="¿Activar Participante?" message={`Vas a reactivar este participante.`} confirmText="Sí, reactivar" onConfirm={handleToggleActivo} onClose={closeModal}/> }
      </ModalBase>
    </div>
  );
}