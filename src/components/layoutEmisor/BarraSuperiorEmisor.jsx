import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronDownIcon,
  BellIcon,
  Bars3Icon,
  ChevronRightIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/solid";
import {
  Cog6ToothIcon,
  ArrowPathIcon,
  ArrowLeftOnRectangleIcon,
  UserCircleIcon,
  BuildingOfficeIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";

import menuIcon from "../../assets/logoShield1.png";

export default function BarraSuperiorSuper({
  userDisplayName,
  logoSrc,
  onToggleSidebar,
  isSidebarCollapsed,
}) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [submenuAbierto, setSubmenuAbierto] = useState(false);
  const menuRef = useRef(null);
  const botonPerfilRef = useRef(null);
  const navigate = useNavigate();

  const inicial = userDisplayName
    ? userDisplayName.charAt(0).toUpperCase()
    : "?";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        botonPerfilRef.current &&
        !botonPerfilRef.current.contains(event.target)
      ) {
        setMenuAbierto(false);
        setSubmenuAbierto(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
    setSubmenuAbierto(false);
    setMenuAbierto(false);
  };

  return (
    <header className="h-16 bg-white text-gray-700 flex items-center justify-between z-10 relative shadow-md">
      <div className="flex items-center h-full">
        <button
          onClick={onToggleSidebar}
          className="flex items-center justify-center h-full w-16
                        bg-[#F3F4F6] 
                        border-r border-gray-200
                        text-gray-700 hover:text-gray-900 transition-colors"
        >
          {isSidebarCollapsed ? (
            <Bars3Icon alt="Abrir menú" className="w-8 h-8 hidden md:block" />
          ) : (
            <ChevronLeftIcon
              alt="Cerrar menú"
              className="w-8 h-8 hidden md:block"
            />
          )}

          <img
            src={menuIcon}
            alt="Abrir menú"
            className="w-12 h-12 md:hidden"
          />
        </button>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4 pr-4 sm:pr-6">
        <div className="pl-4 md:pl-0">
          {logoSrc ? (
            <img src={logoSrc} alt="Logo" className="h-10 w-auto" />
          ) : (
            <h2 className="text-lg font-semibold">CERTIFY</h2>
          )}
        </div>

        <button className="text-gray-500 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100">
          <BellIcon className="w-6 h-6" />
        </button>

        <span className="text-gray-700 mr-1 hidden sm:block">
          {userDisplayName}
        </span>

        <div className="relative">
          <button
            ref={botonPerfilRef}
            onClick={() => {
              setMenuAbierto(!menuAbierto);
              setSubmenuAbierto(false);
            }}
            className="flex items-center text-gray-700 hover:text-gray-900"
          >
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center font-bold text-gray-600">
              {inicial}
            </div>
            <ChevronDownIcon className="w-5 h-5 ml-1 hidden sm:block" />
          </button>

          {menuAbierto && (
            <div
              ref={menuRef}
              className="absolute top-full right-0 mt-2 w-64 bg-white rounded-md shadow-lg overflow-hidden z-20 text-gray-800"
            >
              <ul>
                <li>
                  <Link
                    to="/configuracion-cuenta"
                    className="flex items-center p-3 text-sm hover:bg-gray-100 transition-colors"
                    onClick={() => setMenuAbierto(false)}
                  >
                    <Cog6ToothIcon className="w-5 h-5 mr-3 text-gray-500" />
                    Configurar cuenta
                  </Link>
                </li>

                <li className="relative">
                  <button
                    onClick={() => setSubmenuAbierto(!submenuAbierto)}
                    className="flex items-center justify-between w-full p-3 text-sm hover:bg-gray-100 transition-colors"
                  >
                    <span className="flex items-center">
                      <ArrowPathIcon className="w-5 h-5 mr-3 text-gray-500" />
                      Cambiar Rol
                    </span>
                    <ChevronRightIcon
                      className={`w-4 h-4 text-gray-400 transition-transform ${
                        submenuAbierto ? "rotate-90" : ""
                      }`}
                    />
                  </button>

                  {submenuAbierto && (
                    <ul className="pl-6 bg-gray-50">
                      <li>
                        <button
                          onClick={() => handleNavigate("/super/dashboard")}
                          className="flex items-center w-full p-3 text-sm text-gray-700 hover:bg-gray-200 transition-colors"
                        >
                          <UserCircleIcon className="w-5 h-5 mr-3 text-gray-500" />
                          Superadmin
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleNavigate("/admin/dashboard")}
                          className="flex items-center w-full p-3 text-sm text-gray-700 hover:bg-gray-200 transition-colors"
                        >
                          <BuildingOfficeIcon className="w-5 h-5 mr-3 text-gray-500" />
                          Admin Empresa
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleNavigate("/emisor/dashboard")}
                          className="flex items-center w-full p-3 text-sm text-gray-700 hover:bg-gray-200 transition-colors"
                        >
                          <PaperAirplaneIcon className="w-5 h-5 mr-3 text-gray-500" />
                          Emisor
                        </button>
                      </li>
                    </ul>
                  )}
                </li>

                <li>
                  <button
                    onClick={() => {
                      console.log("Cerrando sesión...");
                      setMenuAbierto(false);
                      // navigate('/login');
                    }}
                    className="flex items-center p-3 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100 w-full text-left"
                  >
                    <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3" />
                    Cerrar sesión
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
