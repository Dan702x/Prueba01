import React from 'react';
import { NavLink } from 'react-router-dom';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/solid'; // Importamos el ícono

export default function BarraLateral({ items = [] }) {
  return (
    <aside className="w-64 bg-[#202E5C] text-white p-4 min-h-screen flex flex-col shadow-lg">
      
      {/* --- Logo con Borde --- */}
      <div className="flex items-center justify-center h-16 mb-6">
        <div className="border-2 border-white rounded-lg px-6 py-2">
          <span className="text-3xl font-bold">CERTIFY</span>
        </div>
      </div>

      {/* MENÚ PRINCIPAL */}
      <nav className="flex-1">
        <p className="text-xs text-gray-400 uppercase mb-2 ml-3">MENÚ PRINCIPAL</p>
        <ul>
          {items.map((item, index) => (
            <li key={index} className="mb-2">
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg transition-colors duration-200 
                  ${isActive ? 'bg-[#3A476F] text-white shadow-md' : 'hover:bg-[#304070] text-gray-200'}`
                }
              >
                {/* Renderizamos el ícono */}
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Centro de ayuda */}
      <div className="mt-auto pt-4 border-t border-[#304070]">
        <NavLink
          to="/help"
          className={({ isActive }) =>
            `flex items-center p-3 rounded-lg transition-colors duration-200 
            ${isActive ? 'bg-[#3A476F] text-white shadow-md' : 'hover:bg-[#304070] text-gray-200'}`
          }
        >
          <QuestionMarkCircleIcon className="w-6 h-6" />
          <span className="ml-3">Centro de ayuda</span>
        </NavLink>
      </div>
    </aside>
  );
}