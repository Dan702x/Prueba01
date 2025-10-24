import React, { useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Bars3Icon } from "@heroicons/react/24/solid";

export default function BarraLateralSuper({
  items = [],
  helpItem,
  logoSrc,
  isCollapsed,
  onToggleSidebar,
}) {
  const sidebarRef = useRef(null);

  const getLinkClasses = ({ isActive }) => {
    let base = "flex items-center py-3 transition-colors duration-200 w-full";

    if (isCollapsed) {
      base += " justify-center";
    } else {
      base += " px-4";
    }

    if (isActive) {
      return `${base} bg-[#F3F4F6] text-gray-900 border-l-[15px] border-[#1E3A8AE6] rounded-none`;
    } else {
      return `${base} text-gray-200 hover:bg-[#304070] border-l-[15px] border-transparent`;
    }
  };

  useEffect(() => {
    if (isCollapsed) {
      return;
    }
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onToggleSidebar();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCollapsed, onToggleSidebar]);

  return (
    <aside
      ref={sidebarRef}
      className={`
        flex flex-col min-h-screen bg-[#202E5C] text-white 
        transition-all duration-500 ease-in-out
        
        fixed inset-y-0 left-0 z-30 w-64 
        
        md:relative md:inset-y-auto md:left-auto md:z-auto 
        
        ${
          isCollapsed
            ? "-translate-x-full md:translate-x-0 md:w-24"
            : "translate-x-0 md:w-64"
        }
      `}
    >
      <div
        className={`flex items-center h-24 mb-6 pt-4 ${
          isCollapsed ? "justify-center" : "justify-start px-4"
        }`}
      >
        <div
          className={`
            bg-white rounded-lg flex justify-center
            transition-all duration-300 ease-in-out
            ${isCollapsed ? "opacity-0 w-0 h-0 p-0" : "opacity-100 w-full"}
          `}
        >
          <img src={logoSrc} alt="Logo Certify" className="w-auto h-14" />
        </div>

        <button
          onClick={onToggleSidebar}
          className={`
            text-gray-300 hover:text-white rounded-lg hover:bg-[#304070]
            ${isCollapsed ? "" : "hidden"}
            p-3
          `}
        >
          <Bars3Icon className="w-7 h-7" />
        </button>
      </div>

      <nav className="flex-1">
        <ul>
          {items.map((item, index) => (
            <li key={index} className="mb-2">
              <NavLink to={item.to} className={getLinkClasses}>
                {({ isActive }) => (
                  <>
                    <div className={`${isCollapsed ? "-ml-[15px]" : ""}`}>
                      {React.cloneElement(item.icon, {
                        className: `w-7 h-7 ${
                          isActive ? "text-gray-900" : "text-gray-200"
                        }`,
                      })}
                    </div>

                    <span
                      className={`ml-3 whitespace-nowrap ${
                        isCollapsed ? "hidden" : "block"
                      }`}
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

      {helpItem && (
        <div className="mt-auto pt-4 border-t border-[#304070] mb-3">
          <NavLink to={helpItem.to} className={getLinkClasses}>
            {({ isActive }) => (
              <>
                <div className={`${isCollapsed ? "-ml-[15px]" : ""}`}>
                  {React.cloneElement(helpItem.icon, {
                    className: `w-7 h-7 ${
                      isActive ? "text-gray-900" : "text-gray-200"
                    }`,
                  })}
                </div>
                <span
                  className={`ml-3 whitespace-nowrap ${
                    isCollapsed ? "hidden" : "block"
                  }`}
                >
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
