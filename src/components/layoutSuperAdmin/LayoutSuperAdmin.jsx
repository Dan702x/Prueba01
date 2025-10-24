import React, { useState } from 'react'; 
import { Outlet } from 'react-router-dom';
import BarraSuperiorSuper from './BarraSuperiorSuper'; 
import BarraLateralSuper from './BarraLateralSuper';   
import logoCertify from '../../assets/logo.png'; 
import {
  HomeIcon, UsersIcon, RectangleStackIcon, 
  ShieldCheckIcon, BuildingOfficeIcon, IdentificationIcon, 
  QuestionMarkCircleIcon 
} from '@heroicons/react/24/solid';

const iconClass = "w-6 h-6";

export default function LayoutSuperAdmin() { 
  
  // ¡CAMBIO! Este estado ahora controla AMBOS (colapso de desktop y menú móvil)
  // isCollapsed = true  -> Colapsado (desktop) / Menú CERRADO (móvil)
  // isCollapsed = false -> Expandido (desktop) / Menú ABIERTO (móvil)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const sidebarItems = [
    { label: 'Inicio / Reportes', to: '/super/dashboard', icon: <HomeIcon className={iconClass} /> },
    { label: 'Ctrl. Usuarios', to: '/super/usuarios', icon: <UsersIcon className={iconClass} /> },
    { label: 'Ctrl. Plantillas', to: '/super/plantillas', icon: <RectangleStackIcon className={iconClass} /> },
    { label: 'Auditoría', to: '/super/auditoria', icon: <ShieldCheckIcon className={iconClass} /> },
    { label: 'Ctrl. Empresas', to: '/super/empresas', icon: <BuildingOfficeIcon className={iconClass} /> },
    { label: 'Sol. Accesos', to: '/super/accesos', icon: <IdentificationIcon className={iconClass} /> },
  ];

  const helpItem = {
    label: 'Centro de ayuda',
    to: '/super/ayuda',
    icon: <QuestionMarkCircleIcon className={iconClass} />
  };

  const userInfo = {
    nombre: 'Roy Silva', 
    rol: 'Super Admin'
  };

  return (
    // ¡CAMBIO! Añadido 'relative' para el z-index del overlay
    <div className="flex h-screen bg-gray-100 relative"> 
      
      <BarraLateralSuper 
        items={sidebarItems}
        helpItem={helpItem}
        logoSrc={logoCertify}
        isCollapsed={isSidebarCollapsed} 
        onToggleSidebar={toggleSidebar} 
      />

      {/* --- ¡NUEVO! Overlay para móvil --- */}
      {/* Aparece cuando el sidebar está abierto (!isCollapsed) y solo en pantallas 'md' o más pequeñas */}
      {!isSidebarCollapsed && (
        <div 
          onClick={toggleSidebar} 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          aria-hidden="true"
        ></div>
      )}
      {/* --- Fin del Overlay --- */}

      <div className="flex-1 flex flex-col overflow-hidden">
        <BarraSuperiorSuper 
          userDisplayName={`${userInfo.nombre} · ${userInfo.rol}`} 
          logoSrc={logoCertify} 
          onToggleSidebar={toggleSidebar} // <-- ¡NUEVO! Le pasamos la función
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
