import React from "react";

export default function BarraSuperior({
  userDisplayName = "Usuario",
  companyName = "Hackthonperu S.A.C",
}) {
  return (
    <header className="bg-[#202E5C] text-white p-4 flex justify-between items-center shadow-md z-10">
      {/* Nombre de la Compañía (con el ícono del menú) */}
      <div className="flex items-center gap-4">
        <button className="text-white hover:bg-white/10 p-1 rounded-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
        <div className="text-xl font-semibold">{companyName}</div>
      </div>

      {/* Info de Usuario */}
      <div className="flex items-center gap-3">
        {/* Ícono de usuario */}
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
          </svg>
        </div>
        <span className="text-lg font-medium">{userDisplayName}</span>
      </div>
    </header>
  );
}
