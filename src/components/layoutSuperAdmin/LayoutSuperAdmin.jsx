import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import BarraSuperiorSuper from "./BarraSuperiorSuper";
import BarraLateralSuper from "./BarraLateralSuper";
import logoCertify from "../../assets/logo.png";
import {
  HomeIcon,
  UsersIcon,
  RectangleStackIcon,
  ShieldCheckIcon,
  BuildingOfficeIcon,
  IdentificationIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/solid";

const iconClass = "w-6 h-6";

export default function LayoutSuperAdmin() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const sidebarItems = [
    {
      label: "Inicio / Reportes",
      to: "/super/dashboard",
      icon: <HomeIcon className={iconClass} />,
    },
    {
      label: "Ctrl. Usuarios",
      to: "/super/usuarios",
      icon: <UsersIcon className={iconClass} />,
    },
    {
      label: "Ctrl. Plantillas",
      to: "/super/plantillas",
      icon: <RectangleStackIcon className={iconClass} />,
    },
    {
      label: "Auditoría",
      to: "/super/auditoria",
      icon: <ShieldCheckIcon className={iconClass} />,
    },
    {
      label: "Ctrl. Empresas",
      to: "/super/empresas",
      icon: <BuildingOfficeIcon className={iconClass} />,
    },
    {
      label: "Sol. Accesos",
      to: "/super/accesos",
      icon: <IdentificationIcon className={iconClass} />,
    },
  ];

  const helpItem = {
    label: "Centro de ayuda",
    to: "/super/ayuda",
    icon: <QuestionMarkCircleIcon className={iconClass} />,
  };

  const userInfo = {
    nombre: "Roy Silva",
    rol: "Super Admin",
  };

  return (
    <div className="flex h-screen bg-gray-100 relative">
      <BarraLateralSuper
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
        <BarraSuperiorSuper
          userDisplayName={`${userInfo.nombre} · ${userInfo.rol}`}
          logoSrc={logoCertify}
          onToggleSidebar={toggleSidebar}
          isSidebarCollapsed={isSidebarCollapsed}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
