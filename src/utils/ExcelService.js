import ExcelJS from "exceljs";

const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString("es-ES") : "N/A";

export const exportSolicitudesToExcel = async (
  solicitudesFiltradas,
  filtrosColumna,
  fechaInicio,
  fechaFin
) => {
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

    const filtersData = [
      ["Usuario:", filtrosColumna.usuario || "Todos"],
      ["Empresa (Nombre/Razón/RUC):", filtrosColumna.busquedaEmpresa || "Todos"],
      ["Estado:", filtrosColumna.estado || "Todos"],
      [
        "Rango de Fechas:",
        `${formatDate(fechaInicio)} - ${formatDate(fechaFin)}`,
      ],
    ];
    filtersData.forEach(([label, value]) => {
      const row = ws.addRow([label, value]);
      ws.getCell(`A${row.number}`).font = { bold: true };
    });
    ws.addRow([]);

    const headers = [
      "ID", "Nombre", "Email", "Empresa", "Razón Social", "RUC",
      "Fecha Solicitud", "Estado", "Gestionado Por", "Fecha Gestión", "Motivo Rechazo",
    ];
    const headerRow = ws.addRow(headers);
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern", pattern: "solid", fgColor: { argb: "FF4472C4" },
      };
      cell.font = { color: { argb: "FFFFFFFF" }, bold: true };
      cell.border = {
        top: { style: "thin" }, left: { style: "thin" },
        bottom: { style: "thin" }, right: { style: "thin" },
      };
    });

    const cellBorder = {
      top: { style: "thin" }, left: { style: "thin" },
      bottom: { style: "thin" }, right: { style: "thin" },
    };
    solicitudesFiltradas.forEach((s) => {
      const rowData = [
        s.id, s.nombre, s.email, s.empresa, s.razonSocial, s.ruc,
        s.fecha, s.estado, s.gestionadoPor || "-", s.fechaGestion || "-", s.motivoRechazo || "-",
      ];
      const dataRow = ws.addRow(rowData);
      const idCell = dataRow.getCell(1);
      idCell.fill = {
        type: "pattern", pattern: "solid", fgColor: { argb: "FFE9EFFF" },
      };
      idCell.font = { bold: true };
      dataRow.eachCell((cell) => { cell.border = cellBorder; });
      dataRow.getCell(11).alignment = { wrapText: true };
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
    a.download = "reporte_solicitudes_acceso.xlsx";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error al generar el archivo Excel:", error);
    alert(
      "Hubo un error al generar el reporte. Revisa la consola para más detalles."
    );
  }
};

export const exportEmpresasToExcel = async (
  empresasFiltradas,
  filtrosColumna,
  fechaInicio,
  fechaFin
) => {
  try {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Empresas");

    const titleRow = ws.addRow(["Reporte de Control de Empresas - CERTIFY"]);
    ws.mergeCells(`A${titleRow.number}:H${titleRow.number}`); // 8 columnas
    const titleCell = ws.getCell(`A${titleRow.number}`);
    titleCell.font = {
      name: "Arial Black", size: 16, bold: true, color: { argb: "FF2F5597" },
    };
    titleCell.alignment = { horizontal: "center" };
    ws.getRow(titleRow.number).height = 30;
    ws.addRow([]);

    const filtersTitleRow = ws.addRow(["Filtros Aplicados"]);
    ws.mergeCells(`A${filtersTitleRow.number}:H${filtersTitleRow.number}`);
    const filtersTitleCell = ws.getCell(`A${filtersTitleRow.number}`);
    filtersTitleCell.font = {
      name: "Arial", size: 12, bold: true, color: { argb: "FF4472C4" },
    };
    filtersTitleCell.fill = {
      type: "pattern", pattern: "solid", fgColor: { argb: "FFE9EFFF" },
    };

    const filtersData = [
      ["Contacto:", filtrosColumna.contacto || "Todos"],
      ["Empresa (Nombre/Razón/RUC):", filtrosColumna.busquedaEmpresa || "Todos"],
      ["Estado:", filtrosColumna.estadoEmpresa || "Todos"],
      [
        "Rango de Fechas:",
        `${formatDate(fechaInicio)} - ${formatDate(fechaFin)}`,
      ],
    ];
    filtersData.forEach(([label, value]) => {
      const row = ws.addRow([label, value]);
      ws.getCell(`A${row.number}`).font = { bold: true };
    });
    ws.addRow([]);

    const headers = [
      "ID", "Empresa", "Razón Social", "RUC",
      "Nombre Contacto", "Email Contacto", "Fecha Aprobación", "Estado",
    ];
    const headerRow = ws.addRow(headers);
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern", pattern: "solid", fgColor: { argb: "FF4472C4" },
      };
      cell.font = { color: { argb: "FFFFFFFF" }, bold: true };
      cell.border = {
        top: { style: "thin" }, left: { style: "thin" },
        bottom: { style: "thin" }, right: { style: "thin" },
      };
    });

    const cellBorder = {
      top: { style: "thin" }, left: { style: "thin" },
      bottom: { style: "thin" }, right: { style: "thin" },
    };
    empresasFiltradas.forEach((s) => {
      const rowData = [
        s.id,
        s.empresa,
        s.razonSocial,
        s.ruc,
        s.nombreContacto,
        s.emailContacto,
        s.fechaAprobacion,
        s.estadoEmpresa,
      ];
      const dataRow = ws.addRow(rowData);
      dataRow.eachCell((cell) => { cell.border = cellBorder; });
    });

    // --- Ancho de Columnas ---
    ws.getColumn(1).width = 5;
    ws.getColumn(2).width = 25;
    ws.getColumn(3).width = 30;
    ws.getColumn(4).width = 15;
    ws.getColumn(5).width = 30;
    ws.getColumn(6).width = 30;
    ws.getColumn(7).width = 18;
    ws.getColumn(8).width = 12;

    ws.autoFilter = `A${headerRow.number}:H${headerRow.number}`;

    const buffer = await wb.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "reporte_empresas.xlsx";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
    
  } catch (error) {
    console.error("Error al generar el archivo Excel:", error);
    alert("Hubo un error al generar el reporte. Revisa la consola para más detalles.");
  }
};

export const exportUsuariosToExcel = async (
  usuariosFiltrados,
  filtrosColumna
) => {
  try {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Usuarios");

    const titleRow = ws.addRow(["Reporte de Control de Usuarios - CERTIFY"]);
    ws.mergeCells(`A${titleRow.number}:D${titleRow.number}`); // 4 columnas
    const titleCell = ws.getCell(`A${titleRow.number}`);
    titleCell.font = {
      name: "Arial Black", size: 16, bold: true, color: { argb: "FF2F5597" },
    };
    titleCell.alignment = { horizontal: "center" };
    ws.getRow(titleRow.number).height = 30;
    ws.addRow([]);

    const filtersTitleRow = ws.addRow(["Filtros Aplicados"]);
    ws.mergeCells(`A${filtersTitleRow.number}:D${filtersTitleRow.number}`);
    const filtersTitleCell = ws.getCell(`A${filtersTitleRow.number}`);
    filtersTitleCell.font = {
      name: "Arial", size: 12, bold: true, color: { argb: "FF4472C4" },
    };
    filtersTitleCell.fill = {
      type: "pattern", pattern: "solid", fgColor: { argb: "FFE9EFFF" },
    };

    const filtersData = [
      ["Nombre:", filtrosColumna.nombre || "Todos"],
      ["Email:", filtrosColumna.email || "Todos"],
      ["Estado:", filtrosColumna.estado || "Todos"],
    ];
    filtersData.forEach(([label, value]) => {
      const row = ws.addRow([label, value]);
      ws.getCell(`A${row.number}`).font = { bold: true };
    });
    ws.addRow([]);

    const headers = ["ID", "Nombre", "Email", "Estado"];
    const headerRow = ws.addRow(headers);
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern", pattern: "solid", fgColor: { argb: "FF4472C4" },
      };
      cell.font = { color: { argb: "FFFFFFFF" }, bold: true };
      cell.border = {
        top: { style: "thin" }, left: { style: "thin" },
        bottom: { style: "thin" }, right: { style: "thin" },
      };
    });

    const cellBorder = {
      top: { style: "thin" }, left: { style: "thin" },
      bottom: { style: "thin" }, right: { style: "thin" },
    };
    usuariosFiltrados.forEach((s) => {
      const rowData = [s.id, s.nombre, s.email, s.estado];
      const dataRow = ws.addRow(rowData);
      dataRow.eachCell((cell) => { cell.border = cellBorder; });
    });

    ws.getColumn(1).width = 5;
    ws.getColumn(2).width = 40;
    ws.getColumn(3).width = 40;
    ws.getColumn(4).width = 12;

    ws.autoFilter = `A${headerRow.number}:D${headerRow.number}`;

    const buffer = await wb.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "reporte_usuarios.xlsx";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
    
  } catch (error) {
    console.error("Error al generar el archivo Excel:", error);
    alert("Hubo un error al generar el reporte. Revisa la consola para más detalles.");
  }
};