import React, { useState, useRef, useEffect } from "react";
// 1. IMPORTAMOS useNavigate para la redirección
import { Link, useNavigate } from "react-router-dom"; 
import {
  ChevronDownIcon,
  BellIcon,
  Bars3Icon,
  ChevronRightIcon // Para indicar el submenú
} from "@heroicons/react/24/solid";
import {
  Cog6ToothIcon,
  ArrowPathIcon, // Lo mantenemos por si lo necesitas
  ArrowLeftOnRectangleIcon,
  UserCircleIcon, // Para el submenú
  BuildingOfficeIcon, // Para el submenú
  PaperAirplaneIcon // Para el submenú (manteniendo el ícono de Emisor)
} from "@heroicons/react/24/outline";

export default function BarraSuperiorEmisor({
  userDisplayName,
  logoSrc,
  onToggleSidebar, 
}) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  // 2. NUEVO ESTADO para controlar el submenú de roles
  const [submenuAbierto, setSubmenuAbierto] = useState(false); 
  const menuRef = useRef(null);
  const botonPerfilRef = useRef(null);
  // 3. Hook useNavigate para redirigir
  const navigate = useNavigate(); 

  const inicial = userDisplayName
    ? userDisplayName.charAt(0).toUpperCase()
    : "?";

  // Efecto para cerrar el menú si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        botonPerfilRef.current &&
        !botonPerfilRef.current.contains(event.target)
      ) {
        setMenuAbierto(false);
        setSubmenuAbierto(false); // 4. Cerramos también el submenú
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 5. FUNCIÓN PARA NAVEGAR A UN DASHBOARD Y CERRAR MENÚS
  const handleNavigate = (path) => {
    navigate(path);
    setSubmenuAbierto(false);
    setMenuAbierto(false);
  };

  return (
    <header className="h-16 bg-white text-gray-700 flex items-center justify-between z-10 relative shadow-md">
      {/* --- Parte Izquierda (Logo y Hamburguesa) --- */}
      <div className="flex items-center h-full">
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

      {/* --- Parte Derecha (Iconos y Perfil) --- */}
      <div className="flex items-center space-x-2 sm:space-x-4 pr-4 sm:pr-6">
        <button className="text-gray-500 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100">
          <BellIcon className="w-6 h-6" />
        </button>
        <span className="text-gray-700 mr-1 hidden sm:block">
          {userDisplayName}
        </span>
        
        {/* --- Botón de Perfil --- */}
        <div className="relative"> {/* Contenedor relativo para el menú */}
          <button
            ref={botonPerfilRef}
            // Al hacer clic, abre/cierra el menú principal y SIEMPRE cierra el submenú
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

          {/* --- Menú Desplegable Principal --- */}
          {menuAbierto && (
            <div
              ref={menuRef}
              className="absolute top-full right-0 mt-2 w-64 bg-white rounded-md shadow-lg overflow-hidden z-20 text-gray-800"
            >
              <ul>
                {/* Opción: Configurar Cuenta */}
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
                
                {/* 6. OPCIÓN "CAMBIAR ROL" (AHORA ES UN BOTÓN) */}
                <li className="relative"> {/* Contenedor relativo para el submenú */}
                  <button
                    onClick={() => setSubmenuAbierto(!submenuAbierto)} // Abre/cierra el submenú
                    className="flex items-center justify-between w-full p-3 text-sm hover:bg-gray-100 transition-colors"
                  >
                    <span className="flex items-center">
                      <ArrowPathIcon className="w-5 h-5 mr-3 text-gray-500" />
                      Cambiar Rol
                    </span>
                    <ChevronRightIcon className={`w-4 h-4 text-gray-400 transition-transform ${submenuAbierto ? 'rotate-90' : ''}`} />
                  </button>

                  {/* 7. SUBMENÚ DE ROLES (RENDERIZADO CONDICIONAL) */}
                  {submenuAbierto && (
                    <ul className="pl-6 bg-gray-50"> {/* Fondo ligeramente diferente */}
                      <li>
                        <button 
                          onClick={() => handleNavigate('/super/dashboard')}
                          className="flex items-center w-full p-3 text-sm text-gray-700 hover:bg-gray-200 transition-colors"
                        >
                           <UserCircleIcon className="w-5 h-5 mr-3 text-gray-500" />
                          Superadmin
                        </button>
                      </li>
                       <li>
                        <button 
                          onClick={() => handleNavigate('/admin/dashboard')}
                          className="flex items-center w-full p-3 text-sm text-gray-700 hover:bg-gray-200 transition-colors"
                        >
                           <BuildingOfficeIcon className="w-5 h-5 mr-3 text-gray-500" />
                          Admin Empresa
                        </button>
                      </li>
                       <li>
                        <button 
                          onClick={() => handleNavigate('/emisor/dashboard')}
                          className="flex items-center w-full p-3 text-sm text-gray-700 hover:bg-gray-200 transition-colors"
                        >
                           <PaperAirplaneIcon className="w-5 h-5 mr-3 text-gray-500" />
                          Emisor
                        </button>
                      </li>
                    </ul>
                  )}
                </li>

                {/* Opción: Cerrar Sesión */}
                <li>
                  <button
                    onClick={() => {
                        console.log("Cerrando sesión...");
                        setMenuAbierto(false);
                        // Aquí iría la lógica real de logout, probablemente usando useNavigate a /login
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
        </div> {/* Fin del contenedor relativo del menú */}
      </div>
    </header>
  );
}