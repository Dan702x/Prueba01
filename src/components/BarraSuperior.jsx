import React from 'react';

export default function BarraSuperior({ userDisplayName = 'Usuario', companyName = 'Hackthonperu S.A.C' }) {
  return (
    <header className="bg-white text-gray-800 p-4 flex justify-between items-center shadow-md z-10">
      {/* Nombre de la Compañía */}
      <div className="text-xl font-semibold">
        {companyName}
      </div>

      {/* Info de Usuario */}
      <div className="flex items-center">
        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
        <span className="text-lg font-medium">{userDisplayName}</span>
      </div>
    </header>
  );
}