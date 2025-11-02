import React, { useState } from 'react'; 
import { Outlet } from 'react-router-dom';
import BarraSuperiorAdmin from './BarraSuperiorAdmin'; 
import BarraLateralAdmin from './BarraLateralAdmin';   
import logoCertify from '../../assets/logo.png'; 
import {
  HomeIcon, UsersIcon, RectangleStackIcon, 
  ShieldCheckIcon, BuildingOfficeIcon, IdentificationIcon, 
  QuestionMarkCircleIcon, AcademicCapIcon, DocumentTextIcon, DocumentArrowUpIcon,
  UserCircleIcon,
  BriefcaseIcon
} from '@heroicons/react/24/solid';

const iconClass = "w-6 h-6";

export default function LayoutAdmin() { 
  
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const sidebarItems = [
    { label: 'Inicio / Reportes', to: '/admin/dashboard', icon: <HomeIcon className={iconClass} /> },
    { label: 'Ctrl. Usuarios', to: '/admin/usuarios', icon: <UsersIcon className={iconClass} /> },
    { label: 'Ctrl. Áreas/Proyectos', to: '/admin/areas', icon: <BriefcaseIcon className={iconClass} /> }, 
    { label: 'Ctrl. Supervisores', to: '/admin/supervisores', icon: <UserCircleIcon className={iconClass} /> },
    
    // --- CAMBIO AQUÍ ---
    { label: 'Ctrl. Participantes', to: '/admin/participantes', icon: <AcademicCapIcon className={iconClass} /> },

    { label: 'Ctrl. Certificados', to: '/admin/certificados', icon: <DocumentTextIcon className={iconClass} /> },
    { label: 'Ctrl. Plantillas', to: '/admin/plantillas', icon: <RectangleStackIcon className={iconClass} /> },
    { label: 'Emis. Certificados', to: '/admin/em-certificados', icon: <DocumentArrowUpIcon className={iconClass} /> },
    { label: 'Auditoría', to: '/admin/auditoria', icon: <ShieldCheckIcon className={iconClass} /> },
    { label: 'Ctrl. Eventos', to: '/admin/eventos', icon: <IdentificationIcon className={iconClass} /> },
  ];

  const helpItem = {
    label: 'Centro de ayuda',
    to: '/admin/ayuda',
    icon: <QuestionMarkCircleIcon className={iconClass} />
  };

  const userInfo = {
    nombre: 'Roy Silva', 
    rol: 'Admin Empresa'
  };

  return (
    <div className="flex h-screen bg-gray-100 relative"> 
      
      <BarraLateralAdmin 
        items={sidebarItems}
        helpItem={helpItem}
        logoSrc={logoCertify}
        isCollapsed={isSidebarCollapsed} 
        onToggleSidebar={toggleSidebar} 
      />

      {!isSidebarCollapsed && (
        <div 
          onClick={toggleSidebar} 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          aria-hidden="true"
        ></div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <BarraSuperiorAdmin 
          userDisplayName={`${userInfo.nombre} · ${userInfo.rol}`} 
          logoSrc={logoCertify} 
          onToggleSidebar={toggleSidebar}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}