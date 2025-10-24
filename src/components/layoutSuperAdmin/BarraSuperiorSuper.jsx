import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDownIcon,
  BellIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";
import {
  Cog6ToothIcon,
  ArrowPathIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";

export default function BarraSuperiorSuper({
  userDisplayName,
  logoSrc,
  onToggleSidebar,
}) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const menuRef = useRef(null);
  const botonPerfilRef = useRef(null);

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
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="h-16 bg-white text-gray-700 flex items-center justify-between z-10 relative shadow-md">
      <div className="flex items-center h-full">
        {/* --- ¡AQUÍ ESTÁ EL CAMBIO! --- */}
        {/* Este botón solo se muestra en móvil. En desktop ('md:') se oculta. */}
        <button
          onClick={onToggleSidebar}
          className="text-gray-500 hover:text-gray-800 h-full px-4 md:hidden"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>

        <div className="pl-4">
          {logoSrc ? (
            <img src={logoSrc} alt="Logo" className="h-10 w-auto" />
          ) : (
            <h2 className="text-lg font-semibold">CERTIFY</h2>
          )}
        </div>
      </div>

      {/* Iconos y perfil del lado derecho (esto está bien) */}
      <div className="flex items-center space-x-2 sm:space-x-4 pr-4 sm:pr-6">
        <button className="text-gray-500 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100">
          <BellIcon className="w-6 h-6" />
        </button>
        <span className="text-gray-700 mr-1 hidden sm:block">
          {userDisplayName}
        </span>
        <button
          ref={botonPerfilRef}
          onClick={() => setMenuAbierto(!menuAbierto)}
          className="flex items-center text-gray-700 hover:text-gray-900"
        >
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center font-bold text-gray-600">
            {inicial}
          </div>
          <ChevronDownIcon className="w-5 h-5 ml-1 hidden sm:block" />
        </button>

        {/* Menú desplegable (esto está bien) */}
        {menuAbierto && (
          <div
            ref={menuRef}
            className="absolute top-full right-4 mt-2 w-64 bg-white rounded-md shadow-lg overflow-hidden z-20 text-gray-800"
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
              <li>
                <Link
                  to="/cambiar-vista"
                  className="flex items-center p-3 text-sm hover:bg-gray-100 transition-colors"
                  onClick={() => setMenuAbierto(false)}
                >
                  <ArrowPathIcon className="w-5 h-5 mr-3 text-gray-500" />
                  Cambiar a vista de empresa
                </Link>
              </li>
              <li>
                <button
                  onClick={() => setMenuAbierto(false)}
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
    </header>
  );
}
