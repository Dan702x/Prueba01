import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import Forgot from "../pages/auth/Forgot.jsx";
import Reset from "../pages/auth/Reset.jsx";
import Inicio from "../pages/Inicio";
import LayoutSuperAdmin from "../components/layoutSuperAdmin/LayoutSuperAdmin";
import DashboardSuper from "../pages/superadmin/DashboardSuper";

// Este es tu nuevo componente que maneja TODAS las rutas
export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/Forgot" element={<Forgot />} />
      <Route path="/Reset" element={<Reset />} />

      {/* ---Roles--- */}
      <Route element={<LayoutSuperAdmin role="admin-empresa" />}>
        <Route path="/" element={<Navigate to="/super/dashboard" replace />} />
        <Route path="/super/dashboard" element={<Inicio />} />
        {/* --- Rutas --- */}
        <Route path="/usuarios" element={<div>Página de Mnt. Usuarios</div>} />
        <Route path="/areas" element={<div>Página de Mnt. Áreas</div>} />
        <Route
          path="/supervisores"
          element={<div>Página de Mnt. Supervisores</div>}
        />
        <Route
          path="/practicantes"
          element={<div>Página de Mnt. Practicantes</div>}
        />
        <Route
          path="/certificados"
          element={<div>Página de Mnt. Certificados</div>}
        />
      
      
      </Route>
      {/* Ruta para SuperAdministrador */}
      <Route element={<LayoutSuperAdmin />}>
        <Route
          path="/super"
          element={<Navigate to="/super/dashboard" replace />}
        />
        <Route path="/super/dashboard" element={<DashboardSuper />} />
        <Route
          path="/super/usuarios"
          element={<div>Página de Mnt. Usuarios (Super)</div>}
        />
        <Route
          path="/super/plantillas"
          element={<div>Página de Mnt. Plantillas (Super)</div>}
        />
        <Route
          path="/super/auditoria"
          element={<div>Página de Auditoría (Super)</div>}
        />
        <Route
          path="/super/empresas"
          element={<div>Página de Mnt. Empresas</div>}
        />
        <Route
          path="/super/accesos"
          element={<div>Página de Solicitudes de Acceso</div>}
        />
        <Route
          path="/super/ayuda"
          element={<div>Página de Centro de Ayuda</div>}
        />
      </Route>

      <Route
        path="*"
        element={
          <div>
            <h1>404 - Página no encontrada</h1>
          </div>
        }
      />
    </Routes>
  );
}
