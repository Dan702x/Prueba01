import { useState, useMemo, useRef, useEffect } from "react";

const ELEMENTOS_POR_PAGINA = 3;

export const useSolicitudesAcceso = ({
  solicitudes,
  setSolicitudes,
  adminActual,
}) => {
  const [filtrosColumna, setFiltrosColumna] = useState({
    usuario: "",
    busquedaEmpresa: "",
    estado: "Todos",
  });
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);
  const [dropdownAbierto, setDropdownAbierto] = useState(false);
  const dropdownRef = useRef(null);
  const opcionesEstado = ["Todos", "Pendiente", "Aprobado", "Rechazado"];

  const [modalRechazoVisible, setModalRechazoVisible] = useState(false);
  const [solicitudARechazar, setSolicitudARechazar] = useState(null);
  const [modalVistaVisible, setModalVistaVisible] = useState(false);
  const [motivoParaVer, setMotivoParaVer] = useState("");
  const [modalDetallesVisible, setModalDetallesVisible] = useState(false);
  const [solicitudParaDetalles, setSolicitudParaDetalles] = useState(null);

  const [paginaActual, setPaginaActual] = useState(1);

  const solicitudesFiltradas = useMemo(() => {
    return solicitudes.filter((s) => {
      const filtroUsuarioLower = filtrosColumna.usuario.toLowerCase();
      if (
        filtrosColumna.usuario &&
        !s.nombre.toLowerCase().includes(filtroUsuarioLower) &&
        !s.email.toLowerCase().includes(filtroUsuarioLower)
      )
        return false;

      const filtroEmpresaLower = filtrosColumna.busquedaEmpresa.toLowerCase();
      if (
        filtrosColumna.busquedaEmpresa &&
        !s.empresa.toLowerCase().includes(filtroEmpresaLower) &&
        !s.razonSocial.toLowerCase().includes(filtroEmpresaLower) &&
        !s.ruc.toLowerCase().includes(filtroEmpresaLower)
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

  // --- Lógica de Paginación ---
  const totalPaginas = Math.ceil(
    solicitudesFiltradas.length / ELEMENTOS_POR_PAGINA
  );
  const solicitudesPaginadas = solicitudesFiltradas.slice(
    (paginaActual - 1) * ELEMENTOS_POR_PAGINA,
    paginaActual * ELEMENTOS_POR_PAGINA
  );

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownAbierto(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFiltroColumna = (columna, valor) => {
    setFiltrosColumna((prev) => ({
      ...prev,
      [columna]: valor,
    }));
    setPaginaActual(1);
  };

  const seleccionarEstadoDropdown = (estado) => {
    handleFiltroColumna("estado", estado);
    setDropdownAbierto(false);
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

  const limpiarTodosLosFiltros = () => {
    setFiltrosColumna({
      usuario: "",
      busquedaEmpresa: "",
      estado: "Todos",
    });
    setFechaInicio(null);
    setFechaFin(null);
    setPaginaActual(1);
  };

  const handleAprobar = (id) => {
    const fechaDeHoy = new Date().toLocaleDateString("es-ES");
    alert(`Usuario ${id} aprobado por ${adminActual}`);
    setSolicitudes((prevSolicitudes) =>
      prevSolicitudes.map((s) =>
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
    handleCerrarModalDetalles();
  };

  const handleRechazarClick = (id) => {
    setSolicitudARechazar(id);
    setModalRechazoVisible(true);
    handleCerrarModalDetalles();
  };

  const handleConfirmarRechazo = (motivoRechazo) => {
    if (!motivoRechazo) {
      alert("Por favor, escribe un motivo para el rechazo.");
      return;
    }
    const fechaDeHoy = new Date().toLocaleDateString("es-ES");
    setSolicitudes((prevSolicitudes) =>
      prevSolicitudes.map((s) =>
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

  return {
    solicitudesPaginadas,
    estadisticasFiltradas,

    filtrosProps: {
      filtrosColumna,
      fechaInicio,
      fechaFin,
      dropdownAbierto,
      dropdownRef,
      opcionesEstado,
      handleFiltroColumna,
      handleRangoFechaChange,
      limpiarFechas,
      setDropdownAbierto,
      seleccionarEstadoDropdown,
      limpiarTodosLosFiltros,
    },

    paginacionProps: {
      paginaActual,
      totalPaginas,
      cambiarPagina,
    },
    modalRechazoProps: {
      isOpen: modalRechazoVisible,
      onClose: handleCerrarModalRechazo,
      onSubmit: handleConfirmarRechazo,
    },
    modalVistaProps: {
      isOpen: modalVistaVisible,
      onClose: handleCerrarModalVista,
      motivo: motivoParaVer,
    },
    modalDetallesProps: {
      isOpen: modalDetallesVisible,
      onClose: handleCerrarModalDetalles,
      solicitud: solicitudParaDetalles,
      onAprobar: handleAprobar,
      onRechazar: handleRechazarClick,
    },
    tableActions: {
      handleVerDetalles,
      handleAprobar,
      handleRechazarClick,
      handleVerMotivo,
    },
    exportData: {
      solicitudesFiltradas,
      filtrosColumna,
      fechaInicio,
      fechaFin,
    },
  };
};