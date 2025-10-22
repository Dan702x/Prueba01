import React, { useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import BarraLateral from '../BarraLateral'; 
import BarraSuperior from '../BarraSuperior';

// --- IMPORTAMOS LOS ÍCONOS ---
import {
  HomeIcon,
  UsersIcon,
  RectangleStackIcon,
  UserCircleIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  DocumentArrowUpIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/solid';

const iconClass = "w-6 h-6"; // Clase común para los íconos

export default function PlantillaApp({ role = 'admin-empresa' }) { 
  
  const sidebarItems = useMemo(() => {
    
    // --- Roles Con LINKS ---
    if (role === 'admin-empresa') {
      return [
        { label: 'Inicio / Reportes', to: '/dashboard', icon: <HomeIcon className={iconClass} /> },
        { label: 'Crtl. Usuarios', to: '/usuarios', icon: <UsersIcon className={iconClass} /> },
        { label: 'Crtl. Áreas / Proyectos', to: '/areas', icon: <RectangleStackIcon className={iconClass} /> },
        { label: 'Crtl. Supervisores', to: '/supervisores', icon: <UserCircleIcon className={iconClass} /> },
        { label: 'Crtl. Practicantes', to: '/practicantes', icon: <AcademicCapIcon className={iconClass} /> },
        { label: 'Crtl. Certificados', to: '/certificados', icon: <DocumentTextIcon className={iconClass} /> },
        { label: 'Supervisión Plantillas', to: '/plantillas', icon: <ClipboardDocumentListIcon className={iconClass} /> },
        { label: 'Emis. Certificados', to: '/emitir', icon: <DocumentArrowUpIcon className={iconClass} /> },
        { label: 'Auditoría', to: '/auditoria', icon: <ShieldCheckIcon className={iconClass} /> },
      ];
    }

    if (role === 'superadmin') {
      //item de superadmin
      return [
        { label: 'Inicio / Reportes', to: '/dashboard', icon: <HomeIcon className={iconClass} /> },
        // ... (puedes añadir íconos a los demás aquí también)
      ];
    }
    
    return [];
  }, [role]);
  
  const userInfo = {
    'superadmin': { nombre: 'Roy Silva', rol: 'Super Admin' },
    'admin-empresa': { nombre: 'Roy Silva', rol: 'Admin Empresa' }, 
  };

  return (
    // --- Fondo ---
    <div className="flex h-screen bg-gray-100"> 
      
      <BarraLateral items={sidebarItems} />

      <div className="flex-1 flex flex-col overflow-hidden">
        
        <BarraSuperior 
          userDisplayName={`${userInfo[role]?.nombre || 'Usuario'} · ${userInfo[role]?.rol || 'Rol'}`} 
          companyName="Hackthonperu S.A.C" 
        />

        {/* Colores */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}