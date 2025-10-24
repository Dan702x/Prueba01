import { Routes, Route, Navigate } from "react-router-dom";

// Layouts (Mantenemos todos los layouts)
import LayoutSuperAdmin from "../components/layoutSuperAdmin/LayoutSuperAdmin";
import LayoutAdmin from "../components/layoutAdmin/LayoutAdmin";
import LayoutEmisor from "../components/layoutEmisor/LayoutEmisor";

// Páginas Auth
import Login from "../pages/auth/Login";
import Forgot from "../pages/auth/Forgot.jsx";
import Reset from "../pages/auth/Reset.jsx";

// Páginas Super Admin (Añadimos las de Roy)
import DashboardSuper from "../pages/superadmin/DashboardSuper";
import ListaPlantillasSuperAdmin from "../pages/superadmin/ListaPlantillasSuperAdmin";
import EditorPlantillaSuperAdmin from "../pages/superadmin/EditorPlantillaSuperAdmin";
import SolicitudesAcceso from "../pages/superadmin/SolicitudesAcceso";

// Páginas Admin Empresa
import DashboardAdmin from "../pages/admin/DashboardAdmin";
import AuditoriaAdmin from "../pages/admin/AuditoriaAdmin";
import GestionEventos from "../pages/admin/GestionEventos"; 

// Páginas Emisor
import DashboardEmisor from "../pages/emisor/DashboardEmisor";
import GestionEventosEmisor from "../pages/emisor/GestionEventosEmisor";

export default function AppRouter() {
  
  return (
    <Routes>
      {/* --- RUTAS DE AUTENTICACIÓN --- */}
      <Route path="/login" element={<Login />} />
      <Route path="/Forgot" element={<Forgot />} />
      <Route path="/Reset" element={<Reset />} />

      {/* --- RUTA DE BIENVENIDA --- */}
      <Route path="/" element={<Navigate to="/login" replace />} />


      {/* --- RUTAS DE SUPERADMIN --- */}
      <Route element={<LayoutSuperAdmin />}>
        <Route 
          path="/super" 
          element={<Navigate to="/super/dashboard" replace />} 
        />
        <Route 
          path="/super/dashboard" 
          element={<DashboardSuper />} 
        />
        <Route
          path="/super/usuarios"
          element={<div>Página de Mnt. Usuarios (Super)</div>}
        />
        <Route 
          path="/super/plantillas" 
          element={<ListaPlantillasSuperAdmin />} 
        />
        <Route 
          path="/super/plantillas/crear" 
          element={<EditorPlantillaSuperAdmin />} 
        />
        <Route 
          path="/super/plantillas/editar/:id" 
          element={<EditorPlantillaSuperAdmin />} 
        />
        {/* --- Fin Integración --- */}
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
          element={<SolicitudesAcceso />}
        />
        <Route
          path="/super/ayuda"
          element={<div>Página de Centro de Ayuda</div>}
        />
      </Route>

      {/* --- RUTAS DE ADMIN EMPRESA --- */}
      <Route element={<LayoutAdmin />}>
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<DashboardAdmin />} />
        <Route path="/admin/usuarios" element={<div>Página de Mnt. Usuarios (Admin)</div>} />
        <Route path="/admin/areas" element={<div>Página de Mnt. Áreas (Admin)</div>} />
        <Route path="/admin/supervisores" element={<div>Página de Mnt. Supervisores (Admin)</div>} />
        <Route path="/admin/practicantes" element={<div>Página de Mnt. Practicantes (Admin)</div>} />
        <Route path="/admin/certificados" element={<div>Página de Mnt. Certificados (Admin)</div>} />
        <Route path="/admin/plantillas" element={<div>Página de Mtr. Plantillas (Admin)</div>} />
        <Route path="/admin/em-certificados" element={<div>Página de Emis. Certificados (Admin)</div>} />
        <Route path="/admin/auditoria" element={<AuditoriaAdmin />} />
        <Route path="/admin/eventos" element={<GestionEventos />} />
        <Route path="/admin/ayuda" element={<div>Página de Centro de Ayuda (Admin)</div>} />
      </Route>

      {/* --- RUTAS PARA EMISOR --- */}
      <Route element={<LayoutEmisor />}>
        <Route path="/emisor" element={<Navigate to="/emisor/dashboard" replace />} />
        <Route path="/emisor/dashboard" element={<DashboardEmisor />} /> 
        <Route path="/emisor/practicantes" element={<div>Página de Mnt. Practicantes (Emisor)</div>} />
        <Route path="/emisor/plantillas" element={<div>Página de Mnt. Plantillas (Emisor)</div>} />
        <Route path="/emisor/em-certificados" element={<div>Página de Emisión de Certificados (Emisor)</div>} />
        <Route path="/emisor/eventos" element={<GestionEventosEmisor />} />
        <Route path="/emisor/ayuda" element={<div>Página de Centro de Ayuda (Emisor)</div>} />
      </Route>


      {/* --- RUTA 404 --- */}
      <Route 
        path="*" 
        element={ <div><h1>404 - Página no encontrada</h1></div> } 
      />
    </Routes>
  );
}