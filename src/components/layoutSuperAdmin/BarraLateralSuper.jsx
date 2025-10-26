import React, { useRef } from "react";
import { NavLink } from "react-router-dom";
import MiLogo from "../../assets/logoTxt.png";
import MiLogoColapsado from "../../assets/logoTxt.png";

export default function BarraLateralSuper({
  items = [],
  helpItem,
  isCollapsed,
}) {
  const sidebarRef = useRef(null);

  const getLinkClasses = ({ isActive }) => {
    let base = "flex w-full transition-colors duration-200";
    let border = "border-l-[15px]";

    if (isCollapsed) {
      base += " justify-center py-4";
    } else {
      base += " items-center py-4 px-4";
    }

    if (isActive) {
      return `${base} ${border} bg-[#F3F4F6] text-gray-900 border-[#1E3A8AE6] rounded-none`;
    } else {
      return `${base} ${border} text-gray-200 hover:bg-[#304070] border-transparent`;
    }
  };

  const renderNavItem = ({ icon, label, isActive }) => (
    <>
      {React.cloneElement(icon, {
        className: `w-7 h-7 ${isCollapsed ? "-ml-[15px]" : ""} ${
          isActive ? "text-gray-900" : "text-gray-200"
        }`,
      })}
      <span
        className={`whitespace-nowrap ${"text-sm"} ${
          isActive ? "text-gray-900" : "text-gray-200"
        } ${isCollapsed ? "hidden" : "block ml-3"}`}
      >
        {label}
      </span>
    </>
  );

  return (
    <aside
      ref={sidebarRef}
      className={`
        flex flex-col min-h-screen 
        bg-[#202E5C] text-white
        transition-all duration-500 ease-in-out
        
        fixed inset-y-0 left-0 z-30 w-64 
        md:relative md:inset-y-auto md:left-auto md:z-auto 
        
        ${
          isCollapsed
            ? "-translate-x-full md:translate-x-0 md:w-24"
            : "translate-x-0 md:w-64"
        }

        pt-2
      `}
    >
      {isCollapsed && (
        <div
          className={`
            px-3 transition-opacity duration-300 ease-in-out 
            ${isCollapsed ? "opacity-100 w-full" : "invisible"}
          `}
        >
          <div className="bg-white rounded-lg flex justify-center items-center h-12">
            <img
              src={MiLogoColapsado}
              alt="Logo Colapsado"
              className="w-full h-8 object-contain"
            />
          </div>
        </div>
      )}

      <div
        className={`
          px-4
          transition-all duration-300 ease-in-out
          
          ${isCollapsed ? "invisible absolute" : "opacity-100 w-full"}
        `}
      >
        <div className="bg-white rounded-lg flex justify-center items-center h-12">
          <img
            src={MiLogo}
            alt="Mi Nuevo Logo"
            className="w-auto h-16 object-contain"
          />
        </div>
      </div>

      <nav className="flex-1 mt-5">
        <ul>
          {items.map((item, index) => (
            <li key={index} className="mb-2">
              <NavLink to={item.to} className={getLinkClasses}>
                {({ isActive }) =>
                  renderNavItem({
                    icon: item.icon,
                    label: item.label,
                    isActive,
                  })
                }
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto mb-3">
        {helpItem && (
          <div className="pt-4 border-t border-[#304070]">
            <NavLink to={helpItem.to} className={getLinkClasses}>
              {({ isActive }) =>
                renderNavItem({
                  icon: helpItem.icon,
                  label: helpItem.label,
                  isActive,
                })
              }
            </NavLink>
          </div>
        )}
      </div>
    </aside>
  );
}
