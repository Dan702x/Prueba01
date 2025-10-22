// ¡ESTAS LÍNEAS FALTABAN!
import { Routes, Route, Navigate } from 'react-router-dom'

// --- Tus imports (estos estaban bien) ---
import PlantillaApp from './components/layout/PlantillaApp'
import Login from './pages/auth/Login'
import Inicio from './pages/Inicio' 

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* ¡ASEGÚRATE DE PASAR EL ROL CORRECTO AQUÍ! */}
      <Route element={<PlantillaApp role="superadmin" />}>
        
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Inicio />} /> 
        
        {/* Tus nuevas rutas de Super Admin */}
        <Route path="/usuarios" element={<div>Página de Usuarios</div>} />
        <Route path="/plantillas" element={<div>Página de Plantillas</div>} />
        <Route path="/auditoria" element={<div>Página de Auditoría</div>} />
        <Route path="/empresas" element={<div>Página de Empresas</div>} />
        <Route path="/solicitudes" element={<div>Página de Solicitudes</div>} />
        <Route path="/help" element={<div>Página de Ayuda</div>} />
      </Route>

      <Route path="*" element={<div><h1>404 - Página no encontrada</h1></div>} />
    </Routes>
  )
}