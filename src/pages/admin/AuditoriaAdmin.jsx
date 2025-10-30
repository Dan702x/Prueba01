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

    </div>
    </div>
  );
  }

