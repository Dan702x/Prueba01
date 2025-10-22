import React, { useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import BarraLateral from '../BarraLateral'; 
import BarraSuperior from '../BarraSuperior';

export default function PlantillaApp({ role = 'superadmin' }) { // <-- Cambiado el rol
  
  const sidebarItems = useMemo(() => {
    
    // --- ¡NUEVOS ITEMS PARA SUPER ADMIN! ---
    if (role === 'superadmin') {
      return [
        { label: 'Inicio / Reportes', to: '/dashboard' },
        { label: 'Mnt. Usuarios', to: '/usuarios' },
        { label: 'Mnt. Plantillas', to: '/plantillas' },
        { label: 'Auditoría', to: '/auditoria' },
        { label: 'Mnt. Empresas', to: '/empresas' },
        { label: 'Sol. Accesos', to: '/solicitudes' },
      ];
    }
    
    if (role === 'admin') {
      // (Los items de admin que tenías antes)
      return [
        { label: 'Inicio / Reportes', to: '/dashboard' },
        { label: 'Mnt. Practicantes', to: '/practicantes' },
        { label: 'Mnt. Certificados', to: '/certificados' },
        { label: 'Mnt. Plantillas', to: '/plantillas' },
        { label: 'Emis. Certificados', to: '/emitir' },
      ];
    }
    
    return [];
  }, [role]);
  
  // --- PASAMOS EL NOMBRE Y ROL CORRECTOS A LA BARRA SUPERIOR ---
  const userInfo = {
    'superadmin': { nombre: 'Lowren Recro', rol: 'Super Admin' },
    'admin': { nombre: 'Lowren Recru', rol: 'Emisor' },
  };

  return (
    <div className="flex h-screen bg-gray-100">
      
      <BarraLateral items={sidebarItems} />

      <div className="flex-1 flex flex-col overflow-hidden">
        
        <BarraSuperior 
          // --- ¡CAMBIO AQUÍ! ---
          userDisplayName={`${userInfo[role]?.nombre || 'Usuario'} · ${userInfo[role]?.rol || 'Rol'}`} 
          companyName="Hackthonperu S.A.C" 
        />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}