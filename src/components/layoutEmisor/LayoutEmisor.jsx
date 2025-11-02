import React, { useState } from 'react'; 
import { Outlet } from 'react-router-dom';
import BarraSuperiorEmisor from './BarraSuperiorEmisor'; 
import BarraLateralEmisor from './BarraLateralEmisor';   
import logoCertify from '../../assets/logo.png'; 
import {
  HomeIcon, 
  AcademicCapIcon, 
  DocumentTextIcon, 
  CalendarDaysIcon,
  QuestionMarkCircleIcon,
  DocumentArrowUpIcon,
  IdentificationIcon
} from '@heroicons/react/24/solid';

const iconClass = "w-6 h-6";

export default function LayoutEmisor() { 
  
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const sidebarItems = [
    { label: 'Inicio', to: '/emisor/dashboard', icon: <HomeIcon className={iconClass} /> },
    
    // --- CAMBIO AQUÍ ---
    { label: 'Ctrl. Participantes', to: '/emisor/participantes', icon: <AcademicCapIcon className={iconClass} /> },
    
    { label: 'Ctrl. Plantillas', to: '/emisor/plantillas', icon: <DocumentTextIcon className={iconClass} /> },
    { label: 'Emis. Certificados', to: '/emisor/em-certificados', icon: <DocumentArrowUpIcon className={iconClass} /> }, 
    { label: 'Ctrl. Eventos', to: '/emisor/eventos', icon: <IdentificationIcon className={iconClass} /> }, 
  ];

  const helpItem = {
    label: 'Centro de ayuda',
    to: '/emisor/ayuda',
    icon: <QuestionMarkCircleIcon className={iconClass} />
  };

  const userInfo = {
    nombre: 'Roy Silva', 
    rol: 'Emisor'
  };

  return (
    <div className="flex h-screen bg-gray-100 relative"> 
      
      <BarraLateralEmisor 
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
        <BarraSuperiorEmisor 
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