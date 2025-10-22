import { Routes, Route, Navigate } from 'react-router-dom'
import PlantillaApp from '../components/layout/PlantillaApp'
import Login from '../pages/auth/Login'
import Forgot from '../pages/auth/Forgot.jsx'
import Reset from '../pages/auth/Reset.jsx'
import Inicio from '../pages/Inicio' 
import ListaPlantillas from '../pages/plantillas/ListaPlantillas'
import EditorPlantilla from '../pages/plantillas/EditorPlantilla.jsx'

// Este es tu nuevo componente que maneja TODAS las rutas
export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/Forgot" element={<Forgot />} />
      <Route path="/Reset" element={<Reset />} />

      {/* ---Roles--- */}
      <Route element={<PlantillaApp role="admin-empresa" />}>
        
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Inicio />} /> 
        
        {/* --- Rutas --- */}
        <Route path="/usuarios" element={<div>Página de Mnt. Usuarios</div>} />
        <Route path="/areas" element={<div>Página de Mnt. Áreas</div>} />
        <Route path="/supervisores" element={<div>Página de Mnt. Supervisores</div>} />
        <Route path="/practicantes" element={<div>Página de Mnt. Practicantes</div>} />
        <Route path="/certificados" element={<div>Página de Mnt. Certificados</div>} />
        
        {/* --- ¡RUTAS DE PLANTILLAS! --- */}
        <Route path="/plantillas" element={<ListaPlantillas />} />
        <Route path="/plantillas/crear" element={<EditorPlantilla />} />
        <Route path="/plantillas/editar/:id" element={<EditorPlantilla />} /> {/* Ruta para editar */}
        
        <Route path="/emitir" element={<div>Página de Emis. Certificados</div>} />
        <Route path="/auditoria" element={<div>Página de Auditoría</div>} />
        <Route path="/help" element={<div>Página de Ayuda</div>} />
      </Route>

      <Route path="*" element={<div><h1>404 - Página no encontrada</h1></div>} />
    </Routes>
  )
}