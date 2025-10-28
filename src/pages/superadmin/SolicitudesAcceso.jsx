import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  CheckIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftEllipsisIcon,
  ChevronDownIcon,
  XMarkIcon as CloseIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  DocumentTextIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon, 
  ArrowDownTrayIcon, 
} from "@heroicons/react/24/solid";


import ExcelJS from 'exceljs';



import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";






const adminActual = "Roy Silva (Super Admin)";


const solicitudesIniciales = [
  {
    id: 1,
    nombre: "Ana García",
    email: "ana.garcia@empresa.com",
    empresa: "Empresa ABC",
    razonSocial: "ABC SAC",
    ruc: "20123456789",
    fecha: "24/10/2025",
    estado: "Pendiente",
    gestionadoPor: null,
    motivoRechazo: null,
    fechaGestion: null,
  },
  {
    id: 2,
    nombre: "Carlos Ruiz",
    email: "carlos.ruiz@constructora.pe",
    empresa: "Constructora XYZ",
    razonSocial: "Constructora XYZ S.A.",
    ruc: "20456789123",
    fecha: "23/10/2025",
    estado: "Pendiente",
    gestionadoPor: null,
    motivoRechazo: null,
    fechaGestion: null,
  },
  {
    id: 3,
    nombre: "Luisa Mendoza",
    email: "luisa.m@gmail.com",
    empresa: "Empresa de Transportes",
    razonSocial: "Transportes Mendoza E.I.R.L",
    ruc: "20567891234",
    fecha: "22/10/2025",
    estado: "Pendiente",
    gestionadoPor: null,
    motivoRechazo: null,
    fechaGestion: null,
  },
  {
    id: 4,
    nombre: "Marcos Solano",
    email: "m.solano@tech.com",
    empresa: "Tech Solutions",
    razonSocial: "Tech Solutions SAC",
    ruc: "20678912345",
    fecha: "20/10/2025",
    estado: "Aprobado",
    gestionadoPor: "Admin (Sistema)",
    motivoRechazo: null,
    fechaGestion: "20/10/2025",
  },
  {
    id: 5,
    nombre: "Julia Torres",
    email: "j.torres@legal.com",
    empresa: "Legal Asesores",
    razonSocial: "Legal Asesores y Consultores S.A.",
    ruc: "20234567890",
    fecha: "19/10/2025",
    estado: "Rechazado",
    gestionadoPor: "Admin (Sistema)",
    motivoRechazo:
      "Empresa no registrada en SUNAT. La documentación presentada no coincide con los registros públicos.",
    fechaGestion: "19/10/2025",
  },
  {
    id: 6,
    nombre: "Pedro Navarro",
    email: "p.navarro@comercial.com",
    empresa: "Comercial del Sur",
    razonSocial: "Comercial del Sur S.R.L.",
    ruc: "20111222333",
    fecha: "18/10/2025",
    estado: "Pendiente",
    gestionadoPor: null,
    motivoRechazo: null,
    fechaGestion: null,
  },
  {
    id: 7,
    nombre: "Sofía Vargas",
    email: "s.vargas@industrial.net",
    empresa: "Industrial Andina",
    razonSocial: "Industrial Andina S.A.A.",
    ruc: "20444555666",
    fecha: "17/10/2025",
    estado: "Aprobado",
    gestionadoPor: "Admin (Sistema)",
    motivoRechazo: null,
    fechaGestion: "17/10/2025",
  },
];


function FilterInput({ value, onChange, placeholder = "Filtrar..." }) {
  const handleClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="relative my-1">
      <input
        type="text"
        className="w-full pl-8 pr-2 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onClick={handleClick}
      />
      <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
    </div>
  );
}


const CustomDateInput = React.forwardRef(
  ({ value, onClick, placeholder, onClear }, ref) => (
    <div className="relative my-1">
      <input
        type="text"
        className="w-full pl-8 pr-10 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
        value={value}
        placeholder={placeholder}
        onClick={onClick}
        ref={ref}
        readOnly
      />
      
      <CalendarIcon className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />

      
      {value && (
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none"
          onClick={(e) => {
            e.stopPropagation();
            onClear();
          }}
        >
          <XMarkIcon className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
);


function StatCard({ label, value, icon, color = "blue" }) {
  
  const colorClasses = {
    blue: { bg: "bg-blue-100", text: "text-blue-600" },
    green: { bg: "bg-green-100", text: "text-green-600" },
    red: { bg: "bg-red-100", text: "text-red-600" },
    yellow: { bg: "bg-yellow-100", text: "text-yellow-600" },
  };

  const selectedColor = colorClasses[color] || colorClasses.blue;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 flex items-center">
      <div
        className={`mr-4 flex-shrink-0 p-3 ${selectedColor.bg} ${selectedColor.text} rounded-full`}
      >
        {icon}
      </div>
      <div>
        <div className="text-3xl font-bold text-gray-800">{value}</div>
        <div className="text-sm font-medium text-gray-500">{label}</div>
      </div>
    </div>
  );
}


export default function SolicitudesAcceso() {
  const [solicitudes, setSolicitudes] = useState(solicitudesIniciales);

  const [filtrosColumna, setFiltrosColumna] = useState({
    usuario: "",
    empresa: "",
    razonRuc: "",
    estado: "Todos",
  });

  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);

  const [paginaActual, setPaginaActual] = useState(1);
  const [elementosPorPagina] = useState(3);

  
  const [modalRechazoVisible, setModalRechazoVisible] = useState(false);
  const [solicitudARechazar, setSolicitudARechazar] = useState(null);
  const [motivoRechazo, setMotivoRechazo] = useState("");
  const [modalVistaVisible, setModalVistaVisible] = useState(false);
  const [motivoParaVer, setMotivoParaVer] = useState("");
  const [modalDetallesVisible, setModalDetallesVisible] = useState(false);
  const [solicitudParaDetalles, setSolicitudParaDetalles] = useState(null);

  
  const [dropdownAbierto, setDropdownAbierto] = useState(false);
  const dropdownRef = useRef(null);
  const opcionesEstado = ["Todos", "Pendiente", "Aprobado", "Rechazado"];

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownAbierto(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  
  const seleccionarEstadoDropdown = (estado) => {
    handleFiltroColumna("estado", estado);
    setDropdownAbierto(false);
  };

  
  const handleFiltroColumna = (columna, valor) => {
    setFiltrosColumna((prev) => ({
      ...prev,
      [columna]: valor,
    }));
    setPaginaActual(1);
  };

  
  const handleRangoFechaChange = (update) => {
    if (Array.isArray(update)) {
      const [start, end] = update;
      setFechaInicio(start);
      setFechaFin(end);
    } else {
      setFechaInicio(null);
      setFechaFin(null);
    }
    setPaginaActual(1);
  };

  
  const limpiarFechas = () => {
    setFechaInicio(null);
    setFechaFin(null);
    setPaginaActual(1);
  };

  
  const handleDownloadExcel = async () => {
    try {
      const wb = new ExcelJS.Workbook();
      const ws = wb.addWorksheet("Solicitudes");

      
      const titleRow = ws.addRow(["Reporte de Solicitudes de Acceso - CERTIFY"]);
      ws.mergeCells(`A${titleRow.number}:K${titleRow.number}`); 
      const titleCell = ws.getCell(`A${titleRow.number}`);
      titleCell.font = {
        name: "Arial Black", 
        size: 16,
        bold: true,
        color: { argb: "FF2F5597" }, 
      };
      titleCell.alignment = { horizontal: "center" };
      ws.getRow(titleRow.number).height = 30; 

      ws.addRow([]); 

      
      const filtersTitleRow = ws.addRow(["Filtros Aplicados"]);
      ws.mergeCells(`A${filtersTitleRow.number}:K${filtersTitleRow.number}`);
      const filtersTitleCell = ws.getCell(`A${filtersTitleRow.number}`);
      filtersTitleCell.font = {
        name: "Arial",
        size: 12,
        bold: true,
        color: { argb: "FF4472C4" }, 
      };
      filtersTitleCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE9EFFF" }, 
      };
      
      
      const formatDate = (date) => 
        date ? new Date(date).toLocaleDateString("es-ES") : "N/A";

      
      const filtersData = [
        ["Usuario:", filtrosColumna.usuario || "Todos"],
        ["Empresa:", filtrosColumna.empresa || "Todos"],
        ["Razón/RUC:", filtrosColumna.razonRuc || "Todos"],
        ["Estado:", filtrosColumna.estado || "Todos"],
        ["Rango de Fechas:", `${formatDate(fechaInicio)} - ${formatDate(fechaFin)}`],
      ];
      
      filtersData.forEach(([label, value]) => {
        const row = ws.addRow([label, value]);
        ws.getCell(`A${row.number}`).font = { bold: true }; 
      });

      ws.addRow([]); 

      
      const headers = [
        "ID",
        "Nombre",
        "Email",
        "Empresa",
        "Razón Social",
        "RUC",
        "Fecha Solicitud",
        "Estado",
        "Gestionado Por",
        "Fecha Gestión",
        "Motivo Rechazo",
      ];
      const headerRow = ws.addRow(headers);

      
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF4472C4" }, 
        };
        cell.font = {
          color: { argb: "FFFFFFFF" }, 
          bold: true,
        };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });

      
      const cellBorder = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
      };
      
      solicitudesFiltradas.forEach((s) => {
        const rowData = [
          s.id,
          s.nombre,
          s.email,
          s.empresa,
          s.razonSocial,
          s.ruc,
          s.fecha,
          s.estado,
          s.gestionadoPor || "-", 
          s.fechaGestion || "-",
          s.motivoRechazo || "-",
        ];
        const dataRow = ws.addRow(rowData);
        
        
        const idCell = dataRow.getCell(1); 
        idCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFE9EFFF" }, 
        };
        idCell.font = { bold: true };
        
        
        dataRow.eachCell((cell) => {
          cell.border = cellBorder;
        });

        
        const motivoRechazoCell = dataRow.getCell(11); 
        motivoRechazoCell.alignment = { wrapText: true };
      });

      
      
      ws.getColumn(1).width = 5;  
      ws.getColumn(2).width = 25; 
      ws.getColumn(3).width = 30; 
      ws.getColumn(4).width = 20; 
      ws.getColumn(5).width = 35; 
      ws.getColumn(6).width = 15; 
      ws.getColumn(7).width = 15; 
      ws.getColumn(8).width = 12; 
      ws.getColumn(9).width = 25; 
      ws.getColumn(10).width = 15; 
      
      ws.getColumn(11).width = 50; 

      
      ws.autoFilter = `A${headerRow.number}:K${headerRow.number}`;

      
      const buffer = await wb.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "reporte_solicitudes_profesional.xlsx";
      document.body.appendChild(a);
      a.click();
      
      
      a.remove();
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error("Error al generar el archivo Excel:", error);
      alert("Hubo un error al generar el reporte. Revisa la consola para más detalles.");
    }
  };
  
  
  const handleAprobar = (id) => {
    const fechaDeHoy = new Date().toLocaleDateString("es-ES");
    alert(`Usuario ${id} aprobado por ${adminActual}`);
    setSolicitudes(
      solicitudes.map((s) =>
        s.id === id
          ? {
              ...s,
              estado: "Aprobado",
              gestionadoPor: adminActual,
              fechaGestion: fechaDeHoy,
            }
          : s
      )
    );
    setModalDetallesVisible(false);
    setSolicitudParaDetalles(null);
  };

  const handleRechazarClick = (id) => {
    setSolicitudARechazar(id);
    setModalRechazoVisible(true);
    setModalDetallesVisible(false);
    setSolicitudParaDetalles(null);
  };

  const handleConfirmarRechazo = () => {
    if (!motivoRechazo) {
      alert("Por favor, escribe un motivo para el rechazo.");
      return;
    }
    const fechaDeHoy = new Date().toLocaleDateString("es-ES");
    setSolicitudes(
      solicitudes.map((s) =>
        s.id === solicitudARechazar
          ? {
              ...s,
              estado: "Rechazado",
              gestionadoPor: adminActual,
              motivoRechazo: motivoRechazo,
              fechaGestion: fechaDeHoy,
            }
          : s
      )
    );
    handleCerrarModalRechazo();
  };

  const handleCerrarModalRechazo = () => {
    setModalRechazoVisible(false);
    setSolicitudARechazar(null);
    setMotivoRechazo("");
  };

  const handleVerMotivo = (motivo) => {
    setMotivoParaVer(motivo);
    setModalVistaVisible(true);
  };

  const handleCerrarModalVista = () => {
    setModalVistaVisible(false);
    setMotivoParaVer("");
  };

  const handleVerDetalles = (solicitud) => {
    setSolicitudParaDetalles(solicitud);
    setModalDetallesVisible(true);
  };

  const handleCerrarModalDetalles = () => {
    setModalDetallesVisible(false);
    setSolicitudParaDetalles(null);
  };


  const solicitudesFiltradas = useMemo(() => {
    return solicitudes.filter((s) => {
      const filtroUsuarioLower = filtrosColumna.usuario.toLowerCase();
      if (
        filtrosColumna.usuario &&
        !s.nombre.toLowerCase().includes(filtroUsuarioLower) &&
        !s.email.toLowerCase().includes(filtroUsuarioLower)
      )
        return false;

      const filtroEmpresaLower = filtrosColumna.empresa.toLowerCase();
      if (
        filtrosColumna.empresa &&
        !s.empresa.toLowerCase().includes(filtroEmpresaLower)
      )
        return false;

      const filtroRazonRucLower = filtrosColumna.razonRuc.toLowerCase();
      if (
        filtrosColumna.razonRuc &&
        !s.razonSocial.toLowerCase().includes(filtroRazonRucLower) &&
        !s.ruc.toLowerCase().includes(filtroRazonRucLower)
      )
        return false;

      if (
        filtrosColumna.estado !== "Todos" &&
        s.estado !== filtrosColumna.estado
      ) {
        return false;
      }

      if (fechaInicio && fechaFin) {
        const [dia, mes, anio] = s.fecha.split("/").map(Number);
        const fechaSolicitud = new Date(anio, mes - 1, dia);
        const fechaFinAjustada = new Date(fechaFin);
        fechaFinAjustada.setHours(23, 59, 59, 999);
        const fechaInicioAjustada = new Date(fechaInicio);
        fechaInicioAjustada.setHours(0, 0, 0, 0);

        if (
          fechaSolicitud < fechaInicioAjustada ||
          fechaSolicitud > fechaFinAjustada
        ) {
          return false;
        }
      }

      return true;
    });
  }, [solicitudes, filtrosColumna, fechaInicio, fechaFin]);

  
  const estadisticasFiltradas = useMemo(() => {
    const total = solicitudesFiltradas.length;
    const aprobadas = solicitudesFiltradas.filter(
      (s) => s.estado === "Aprobado"
    ).length;
    const rechazadas = solicitudesFiltradas.filter(
      (s) => s.estado === "Rechazado"
    ).length;
    const pendientes = solicitudesFiltradas.filter(
      (s) => s.estado === "Pendiente"
    ).length;

    return { total, aprobadas, rechazadas, pendientes };
  }, [solicitudesFiltradas]);

  
  const totalPaginas = Math.ceil(
    solicitudesFiltradas.length / elementosPorPagina
  );
  const indiceUltimoElemento = paginaActual * elementosPorPagina;
  const indicePrimerElemento = indiceUltimoElemento - elementosPorPagina;
  const solicitudesPaginadas = solicitudesFiltradas.slice(
    indicePrimerElemento,
    indiceUltimoElemento
  );

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  return (
    <div>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Solicitudes de Acceso
        </h1>
        <button
          onClick={handleDownloadExcel} 
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <ArrowDownTrayIcon className="w-5 h-5" />
          Descargar Excel
        </button>
      </div>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <StatCard
          label="Total (Filtradas)"
          value={estadisticasFiltradas.total}
          icon={<DocumentTextIcon className="w-6 h-6" />}
          color="blue"
        />
        <StatCard
          label="Pendientes"
          value={estadisticasFiltradas.pendientes}
          icon={<ClockIcon className="w-6 h-6" />}
          color="yellow"
        />
        <StatCard
          label="Aprobadas"
          value={estadisticasFiltradas.aprobadas}
          icon={<CheckCircleIcon className="w-6 h-6" />}
          color="green"
        />
        <StatCard
          label="Rechazadas"
          value={estadisticasFiltradas.rechazadas}
          icon={<XCircleIcon className="w-6 h-6" />}
          color="red"
        />
      </div>
      

      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Usuario
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
                >
                  Empresa
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
                >
                  Razón Social / RUC
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
                >
                  Fecha Solicitud
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Estado
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
                >
                  Gestión / Detalles
                </th>
              </tr>

              
              <tr className="bg-gray-50 border-t border-gray-200">
                <th className="px-6 py-2">
                  <FilterInput
                    value={filtrosColumna.usuario}
                    onChange={(e) =>
                      handleFiltroColumna("usuario", e.target.value)
                    }
                    placeholder="Buscar usuario..."
                  />
                </th>
                <th className="px-6 py-2 hidden md:table-cell">
                  <FilterInput
                    value={filtrosColumna.empresa}
                    onChange={(e) =>
                      handleFiltroColumna("empresa", e.target.value)
                    }
                    placeholder="Buscar empresa..."
                  />
                </th>
                <th className="px-6 py-2 hidden md:table-cell">
                  <FilterInput
                    value={filtrosColumna.razonRuc}
                    onChange={(e) =>
                      handleFiltroColumna("razonRuc", e.target.value)
                    }
                    placeholder="Buscar Razón/RUC..."
                  />
                </th>

                
                <th className="px-6 py-2 hidden md:table-cell">
                  <DatePicker
                    selectsRange={true}
                    startDate={fechaInicio}
                    endDate={fechaFin}
                    onChange={handleRangoFechaChange}
                    dateFormat="dd/MM/yy"
                    placeholderText="Filtrar por fecha..."
                    customInput={<CustomDateInput onClear={limpiarFechas} />}
                    autoComplete="off"
                    
                  />
                </th>

                
                <th className="px-6 py-2 relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDropdownAbierto(!dropdownAbierto);
                    }}
                    className="inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-1.5 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {filtrosColumna.estado}
                    <ChevronDownIcon
                      className="-mr-1 ml-2 h-5 w-5"
                      aria-hidden="true"
                    />
                  </button>
                  {dropdownAbierto && (
                    <div className="origin-top-right absolute left-0 md:left-auto right-0 mt-2 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
                      <div className="py-1">
                        {opcionesEstado.map((opcion) => (
                          <button
                            key={opcion}
                            onClick={(e) => {
                              e.stopPropagation();
                              seleccionarEstadoDropdown(opcion);
                            }}
                            className={`${
                              filtrosColumna.estado === opcion
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-700"
                            } block w-full text-left px-4 py-2 text-sm hover:bg-gray-100`}
                            role="menuitem"
                          >
                            {opcion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </th>

                <th className="px-6 py-2 hidden md:table-cell">
                  
                </th>
              </tr>
            </thead>
            
            <tbody className="bg-white divide-y divide-gray-200">
              {solicitudesPaginadas.length > 0 ? (
                solicitudesPaginadas.map((solicitud) => (
                  <tr
                    key={solicitud.id}
                    onClick={() => handleVerDetalles(solicitud)}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {solicitud.nombre}
                      </div>
                      <div className="text-sm text-gray-500">
                        {solicitud.email}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <div className="text-sm text-gray-900">
                        {solicitud.empresa}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <div className="text-sm text-gray-900 font-medium">
                        {solicitud.razonSocial}
                      </div>
                      <div className="text-sm text-gray-500">
                        {solicitud.ruc}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <div className="text-sm text-gray-500">
                        {solicitud.fecha}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      {solicitud.estado === "Pendiente" && (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Pendiente
                        </span>
                      )}
                      {solicitud.estado === "Aprobado" && (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Aprobado
                        </span>
                      )}
                      {solicitud.estado === "Rechazado" && (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Rechazado
                        </span>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium hidden md:table-cell">
                      <div>
                        {solicitud.estado === "Pendiente" && (
                          <div className="space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRechazarClick(solicitud.id);
                              }}
                              className="p-2 rounded-full text-red-600 bg-red-100 hover:bg-red-200 transition-colors"
                              title="Rechazar"
                            >
                              <XMarkIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAprobar(solicitud.id);
                              }}
                              className="p-2 rounded-full text-green-600 bg-green-100 hover:bg-green-200 transition-colors"
                              title="Aprobar"
                            >
                              <CheckIcon className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                        {solicitud.estado === "Aprobado" && (
                          <div className="text-xs text-gray-500 text-right">
                            <p className="font-medium text-green-700">
                              Aprobado por:
                            </p>
                            <p>{solicitud.gestionadoPor}</p>
                            <p className="mt-1">{solicitud.fechaGestion}</p>
                          </div>
                        )}
                        {solicitud.estado === "Rechazado" && (
                          <div className="text-xs text-gray-500 text-right">
                            <p className="font-medium text-red-700">
                              Rechazado por:
                            </p>
                            <p>{solicitud.gestionadoPor}</p>
                            <p className="mt-1">{solicitud.fechaGestion}</p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleVerMotivo(solicitud.motivoRechazo);
                              }}
                              className="font-medium text-blue-600 hover:text-blue-800 mt-2 inline-flex items-center gap-1"
                            >
                              <ChatBubbleLeftEllipsisIcon className="w-4 h-4" />
                              Ver Motivo
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    {solicitudesFiltradas.length === 0
                      ? "No se encontraron solicitudes con los filtros aplicados."
                      : "No hay solicitudes para mostrar."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      

      
      {totalPaginas > 1 && (
        <div className="flex justify-center items-center gap-4 pt-6">
          <button
            onClick={() => cambiarPagina(paginaActual - 1)}
            disabled={paginaActual === 1}
            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeftIcon className="h-5 w-5" /> Anterior
          </button>

          <span className="text-sm text-gray-700">
            Página {paginaActual} de {totalPaginas}
          </span>

          <button
            onClick={() => cambiarPagina(paginaActual + 1)}
            disabled={paginaActual === totalPaginas}
            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      )}

      
      {modalRechazoVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md z-50">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Motivo del Rechazo
            </h3>
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">
                Por favor, escribe por qué se está rechazando esta solicitud de
                acceso.
              </p>
              <textarea
                rows="4"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={motivoRechazo}
                onChange={(e) => setMotivoRechazo(e.target.value)}
                placeholder="Ej: La empresa no cumple con los requisitos..."
              ></textarea>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCerrarModalRechazo}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmarRechazo}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Confirmar Rechazo
              </button>
            </div>
          </div>
        </div>
      )}
      {modalVistaVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md z-50">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Motivo del Rechazo
            </h3>
            <div className="mt-4">
              <div className="text-sm text-gray-700 bg-gray-100 p-3 rounded-md border border-gray-200 whitespace-pre-wrap">
                {motivoParaVer}
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleCerrarModalVista}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
      {modalDetallesVisible && solicitudParaDetalles && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md z-50 flex flex-col max-h-[90vh] relative">
            <button
              onClick={handleCerrarModalDetalles}
              className="absolute top-3 right-3 p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              title="Cerrar"
            >
              <CloseIcon className="w-6 h-6" />
            </button>

            <h3 className="text-xl font-semibold leading-6 text-gray-900 mb-4 flex-shrink-0 pr-10">
              Detalles de la Solicitud
            </h3>

            <div className="space-y-3 text-sm text-gray-700 mb-6 border-t border-b border-gray-200 py-4 overflow-y-auto flex-grow">
              <div className="flex justify-between">
                <strong className="text-gray-500 mr-2">Nombre:</strong>{" "}
                <span className="text-right">
                  {solicitudParaDetalles.nombre}
                </span>
              </div>
              <div className="flex justify-between">
                <strong className="text-gray-500 mr-2">Email:</strong>{" "}
                <span className="text-right break-all">
                  {solicitudParaDetalles.email}
                </span>
              </div>
              <div className="flex justify-between">
                <strong className="text-gray-500 mr-2">Empresa:</strong>{" "}
                <span className="text-right">
                  {solicitudParaDetalles.empresa}
                </span>
              </div>
              <div className="flex justify-between">
                <strong className="text-gray-500 mr-2">
                  Razón Social:
                </strong>{" "}
                <span className="text-right">
                  {solicitudParaDetalles.razonSocial}
                </span>{" "}
              </div>
              <div className="flex justify-between">
                <strong className="text-gray-500 mr-2">RUC:</strong>{" "}
                <span className="text-right">{solicitudParaDetalles.ruc}</span>{" "}
              </div>
              <div className="flex justify-between">
                <strong className="text-gray-500 mr-2">Fecha Solicitud:</strong>{" "}
                <span className="text-right">
                  {solicitudParaDetalles.fecha}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <strong className="text-gray-500 mr-2">Estado:</strong>
                <span>
                  {solicitudParaDetalles.estado === "Pendiente" && (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Pendiente
                    </span>
                  )}
                  {solicitudParaDetalles.estado === "Aprobado" && (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Aprobado
                    </span>
                  )}
                  {solicitudParaDetalles.estado === "Rechazado" && (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      Rechazado
                    </span>
                  )}
                </span>
              </div>
              {solicitudParaDetalles.gestionadoPor && (
                <div className="flex justify-between">
                  <strong className="text-gray-500 mr-2">
                    Gestionado por:
                  </strong>{" "}
                  <span className="text-right">
                    {solicitudParaDetalles.gestionadoPor}
                  </span>
                </div>
              )}
              {solicitudParaDetalles.fechaGestion && (
                <div className="flex justify-between">
                  <strong className="text-gray-500 mr-2">Fecha Gestión:</strong>{" "}
                  <span className="text-right">
                    {solicitudParaDetalles.fechaGestion}
                  </span>
                </div>
              )}
              {solicitudParaDetalles.motivoRechazo && (
                <div className="mt-3">
                  <strong className="text-gray-500 block mb-1">
                    Motivo Rechazo:
                  </strong>
                  <p className="text-gray-600 bg-gray-50 p-2 border rounded text-xs">
                    {solicitudParaDetalles.motivoRechazo}
                  </p>
                </div>
              )}
            </div>

            {solicitudParaDetalles.estado === "Pendiente" && (
              <div className="flex justify-between items-center mb-0 flex-shrink-0 gap-4 mt-auto">
                <button
                  type="button"
                  onClick={() =>
                    handleRechazarClick(solicitudParaDetalles.id)
                  }
                  className="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 flex items-center justify-center gap-1 text-sm font-medium"
                >
                  <XMarkIcon className="w-5 h-5" /> Rechazar
                </button>
                <button
                  type="button"
                  onClick={() => handleAprobar(solicitudParaDetalles.id)}
                  className="flex-1 px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 flex items-center justify-center gap-1 text-sm font-medium"
                >
                  <CheckIcon className="w-5 h-5" /> Aprobar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}