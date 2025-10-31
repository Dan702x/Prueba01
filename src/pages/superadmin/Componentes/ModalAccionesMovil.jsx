import React from 'react';
import {
  PencilIcon,
  XMarkIcon as CloseIcon,
  EnvelopeIcon,
  TrashIcon, 
} from "@heroicons/react/24/solid";

export default function ModalAccionesMovil({ usuario, onClose, onEdit, onDelete, onResetPass }) {
  return (
    <div 
      className="cu-modal-movil-backdrop"
      onClick={onClose} 
    >
      <div 
        className="cu-modal-movil-panel"
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="cu-modal-movil-header">
          <div className="cu-modal-movil-header-info">
            <h3 className="cu-modal-movil-header-titulo">{usuario.nombre}</h3>
            <p className="cu-modal-movil-header-subtitulo">{usuario.email}</p>
          </div>
          <button 
            onClick={onClose} 
            className="cu-modal-movil-close-btn"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>
        
        <div className="cu-modal-movil-body">
          <button onClick={onResetPass} className="cu-modal-movil-btn-reset">
            <EnvelopeIcon className="w-5 h-5" />
            Enviar Nueva Contraseña
          </button>
          
          <button onClick={onEdit} className="cu-modal-movil-btn-edit">
            <PencilIcon className="w-5 h-5" />
            Editar Usuario y Estado
          </button>
          
          <button onClick={onDelete} className="cu-modal-movil-btn-delete">
            <TrashIcon className="w-5 h-5" />
            Eliminar Usuario
          </button>
        </div>
      </div>
    </div>
  );
}