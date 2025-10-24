import React from 'react';
import { 
  FunnelIcon, 
  ArrowDownTrayIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/solid';

const ActionBadge = ({ action }) => {
  const baseClasses = "px-2.5 py-0.5 text-xs font-semibold rounded-full inline-block";
  const styles = {
    LOGIN: "bg-blue-100 text-blue-800",
    ANULACIÓN: "bg-orange-100 text-orange-800",
    CREACIÓN: "bg-green-100 text-green-800",
  };
  const actionStyle = styles[action.toUpperCase()] || "bg-gray-100 text-gray-800";
  return <span className={`${baseClasses} ${actionStyle}`}>{action}</span>;
};


export default function AuditoriaAdmin() {
  const auditLogs = [
    
  ];
  
  const hasData = true; 

  return (
    <div className="p-4 md:p-8">
      
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-800">
          Auditoría
        </h1>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Registro de Auditoría del Sistema</h2>
        
        <div className="flex flex-col md:flex-row md:items-end gap-4">
            
            <div className="w-full md:w-auto">
              <label htmlFor="fechaDesde" className="block text-sm font-medium text-gray-700 mb-1">Fecha desde:</label>
              <input 
                type="date" 
                id="fechaDesde"
                className="form-input block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div className="w-full md:w-auto">
              <label htmlFor="fechaHasta" className="block text-sm font-medium text-gray-700 mb-1">Fecha hasta:</label>
              <input 
                type="date" 
                id="fechaHasta"
                className="form-input block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* Usuario */}
            <div className="w-full md:w-1/4">
              <label htmlFor="search-user" className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
              <input 
                type="text" 
                id="search-user"
                placeholder="Buscar por correo..."
                className="form-input block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            {/* Módulos */}
            <div className="w-full md:w-auto">
              <label htmlFor="module-filter" className="block text-sm font-medium text-gray-700 mb-1">Módulos</label>
              <select id="module-filter" className="form-select block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <option>Todos</option>
                <option>Autenticación</option>
                <option>Certificados</option>
                <option>Practicantes</option>
              </select>
            </div>
            
            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto md:ml-auto">
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors">
                <FunnelIcon className="h-5 w-5" />
                Filtrar
              </button>
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 transition-colors">
                <ArrowDownTrayIcon className="h-5 w-5" />
                Exportar
                <ChevronDownIcon className="h-4 w-4" />
              </button>
            </div>
        </div>
      </div>

      {/* --- Tabla de Registros --- */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-4">Fecha y Hora</th>
              <th scope="col" className="px-6 py-4">Usuario</th>
              <th scope="col" className="px-6 py-4 text-center">Acción</th>
              <th scope="col" className="px-6 py-4">Módulo</th>
              <th scope="col" className="px-6 py-4">Detalle</th>
              <th scope="col" className="px-6 py-4">IP</th>
            </tr>
          </thead>
          <tbody>
            {hasData ? (
              auditLogs.map((log, index) => (
                <tr key={index} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{log.datetime}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{log.user}</td>
                  <td className="px-6 py-4 text-center">
                    <ActionBadge action={log.action} />
                  </td>
                  <td className="px-6 py-4">{log.module}</td>
                  <td className="px-6 py-4">{log.details}</td>
                  <td className="px-6 py-4">{log.ip}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-10 px-6 text-gray-500">
                  No hay registros para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
