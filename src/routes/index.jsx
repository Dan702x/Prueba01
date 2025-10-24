import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import LayoutSuperAdmin from "../components/layoutSuperAdmin/LayoutSuperAdmin"; // Layout para Super Admin

// Páginas Auth
import Login from "../pages/auth/Login";
import Forgot from "../pages/auth/Forgot.jsx";
import Reset from "../pages/auth/Reset.jsx";

// Páginas Super Admin
import DashboardSuper from "../pages/superadmin/DashboardSuper";
import ListaPlantillasSuperAdmin from "../pages/superadmin/ListaPlantillasSuperAdmin";
import EditorPlantillaSuperAdmin from "../pages/superadmin/EditorPlantillaSuperAdmin";

// Este es tu nuevo componente que maneja TODAS las rutas
export default function AppRouter() {
  // --- Simulación de Rol ---
  // Cambia esto a 'superadmin' o null para probar
  const userRole = 'superadmin';

  return (
    <Routes>
      {/* --- Rutas Públicas / Autenticación --- */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot" element={<Forgot />} />
      <Route path="/reset" element={<Reset />} />

      {/* --- Rutas Protegidas --- */}

      {/* --- (Aquí irían las rutas de Admin Empresa si tuvieras ese rol activo) --- */}
      {/* {userRole === 'admin-empresa' && (
        <Route element={<PlantillaApp role="admin-empresa" />}>
          // ... rutas de admin empresa ...
        </Route>
      )} 
      */}

      {/* --- Rutas para Super Administrador --- */}
      {userRole === 'superadmin' && (
        <Route element={<LayoutSuperAdmin />}>

          {/* Redirección por defecto para Super Admin */}
          <Route path="/" element={<Navigate to="/superadmin/dashboard" replace />} />
          <Route path="/superadmin" element={<Navigate to="/superadmin/dashboard" replace />} />

          {/* Rutas Principales */}
          <Route path="/superadmin/dashboard" element={<DashboardSuper />} />
          <Route path="/superadmin/usuarios" element={<div>Página de Mnt. Usuarios (Super)</div>} />
          <Route path="/superadmin/empresas" element={<div>Página de Mnt. Empresas</div>} />

          {/* Rutas de Plantillas */}
          <Route path="/superadmin/plantillas" element={<ListaPlantillasSuperAdmin />} />
          <Route path="/superadmin/plantillas/crear" element={<EditorPlantillaSuperAdmin />} />
          <Route path="/superadmin/plantillas/editar/:id" element={<EditorPlantillaSuperAdmin />} />

          {/* Otras Rutas */}
          <Route path="/superadmin/auditoria" element={<div>Página de Auditoría (Super)</div>} />
          <Route path="/superadmin/accesos" element={<div>Página de Solicitudes de Acceso</div>} />
          <Route path="/superadmin/ayuda" element={<div>Página de Centro de Ayuda</div>} />

        </Route>
      )}

      {/* --- Manejo de Rutas No Encontradas o Sin Acceso --- */}
      
      {/* Si no hay rol (no logueado), redirige a login */}
      {!userRole && <Route path="*" element={<Navigate to="/login" replace />} />}

      {/* Si hay rol pero la ruta no coincide, muestra 404 */}
      {userRole && (
        <Route path="*" element={ <div><h1>404 - Página no encontrada</h1></div> } />
      )}

    </Routes>
  );
}