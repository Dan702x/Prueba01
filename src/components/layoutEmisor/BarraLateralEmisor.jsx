import React, { useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Bars3Icon } from '@heroicons/react/24/solid';

// Nombre del componente cambiado a BarraLateralEmisor
export default function BarraLateralEmisor({ items = [], helpItem, logoSrc, isCollapsed, onToggleSidebar }) {
  
  const sidebarRef = useRef(null);

  // Función para determinar las clases CSS de los links (activo/inactivo)
  const getLinkClasses = ({ isActive }) => {
    let base = "flex items-center py-3 transition-colors duration-200 w-full";
    
    if (isCollapsed) {
      base += " justify-center"; // Centrado si está colapsado
    } else {
      base += " px-4"; // Padding si está expandido
    }

    if (isActive) {
      // Estilo activo (fondo gris claro, texto oscuro, borde izquierdo azul)
      return `${base} bg-[#F3F4F6] text-gray-900 border-l-[15px] border-[#1E3A8AE6] rounded-none`;
    } else {
      // Estilo inactivo (texto gris claro, borde transparente, hover azul oscuro)
      return `${base} text-gray-200 hover:bg-[#304070] border-l-[15px] border-transparent`;
    }
  };

  // Efecto para cerrar el menú en móvil si se hace clic fuera
  useEffect(() => {
    // Si está colapsado (en desktop) o si no hay función para alternar, no hacemos nada
    if (isCollapsed || !onToggleSidebar) {
      return;
    }
    const handleClickOutside = (event) => {
      // Si el clic fue fuera del sidebar, llama a la función para cerrarlo
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onToggleSidebar(); 
      }
    };
    // Añadir listener
    document.addEventListener('mousedown', handleClickOutside);
    // Limpiar listener al desmontar
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCollapsed, onToggleSidebar]); 


  return (
    <aside 
      ref={sidebarRef} 
      className={`
        flex flex-col min-h-screen bg-[#202E5C] text-white 
        transition-all duration-500 ease-in-out
        
        /* --- Estilos Móvil (por defecto): Fijo y fuera de pantalla --- */
        fixed inset-y-0 left-0 z-30 w-64 
        
        /* --- Estilos Desktop (md:): Relativo y en su sitio --- */
        md:relative md:inset-y-auto md:left-auto md:z-auto 
        
        /* --- Lógica de Colapso (isCollapsed) --- */
        ${isCollapsed ? 
          // Móvil: Se esconde a la izquierda | Desktop: Se encoge
          '-translate-x-full md:translate-x-0 md:w-24' 
          : 
          // Móvil: Aparece desde la izquierda | Desktop: Ancho completo
          'translate-x-0 md:w-64'
        }
      `}
    >
      
      {/* --- Contenedor del Logo y Botón Hamburguesa (para Desktop) --- */}
      <div className={`flex items-center h-24 mb-6 pt-4 ${isCollapsed ? 'justify-center' : 'justify-start px-4'}`}>
        
        {/* Logo (solo visible si está expandido) */}
        <div 
          className={`
            bg-white rounded-lg flex justify-center
            transition-all duration-300 ease-in-out overflow-hidden
            ${isCollapsed ? 'opacity-0 w-0 h-0 p-0' : 'opacity-100 w-full'}
          `}
        >
          <img 
            src={logoSrc} 
            alt="Logo Certify" 
            className="w-auto h-14" // Tamaño del logo
          />
        </div>

        {/* Botón Hamburguesa (solo visible si está colapsado en Desktop) */}
        {/* Nota: Este botón podría no ser necesario si el botón está en BarraSuperior */}
        <button 
          onClick={onToggleSidebar}
          className={`
            text-gray-300 hover:text-white rounded-lg hover:bg-[#304070]
            ${isCollapsed ? 'md:block hidden' : 'hidden'} // Visible solo colapsado y en desktop
            p-3
          `}
        >
          <Bars3Icon className="w-7 h-7" /> 
        </button>
      </div>

      
      {/* --- Navegación Principal --- */}
      <nav className="flex-1">
        <ul>
          {items.map((item, index) => (
            <li key={index} className="mb-2">
              <NavLink to={item.to} className={getLinkClasses}>
                {({ isActive }) => (
                  <>
                    {/* Contenedor del ícono (ajusta margen si está colapsado) */}
                    <div className={`${isCollapsed ? '-ml-[15px]' : ''}`}>
                      {/* Clonamos el ícono para poder añadirle clases dinámicas */}
                      {React.cloneElement(item.icon, { 
                        className: `w-7 h-7 ${isActive ? 'text-gray-900' : 'text-gray-200'}` 
                      })}
                    </div>
                    
                    {/* Texto del link (solo visible si está expandido) */}
                    <span 
                      className={`ml-3 whitespace-nowrap transition-opacity duration-300 ${isCollapsed ? 'opacity-0 hidden' : 'opacity-100 block'}`}
                    >
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* --- Link de Ayuda (al final) --- */}
      {helpItem && (
        <div className="mt-auto pt-4 border-t border-[#304070] mb-3">
          <NavLink to={helpItem.to} className={getLinkClasses}>
            {({ isActive }) => (
              <>
                <div className={`${isCollapsed ? '-ml-[15px]' : ''}`}>
                  {React.cloneElement(helpItem.icon, { 
                    className: `w-7 h-7 ${isActive ? 'text-gray-900' : 'text-gray-200'}` 
                  })}
                </div>
                <span className={`ml-3 whitespace-nowrap transition-opacity duration-300 ${isCollapsed ? 'opacity-0 hidden' : 'opacity-100 block'}`}>
                  {helpItem.label} 
                </span>
              </>
            )}
          </NavLink>
        </div>
      )}
    </aside>
  );
}