import React from 'react';

export default function ModalResetPass({ usuario, onClose, onConfirm }) {
  return (
    <div className="modal-backdrop">
      <div className="modal-panel">
        <h3 className="modal-titulo">Confirmar Reseteo de Contraseña</h3>
        <div className="mt-4">
          <p className="modal-texto">
            ¿Estás seguro de que deseas asignarle una <strong className="text-blue-700">contraseña nueva</strong> a esta cuenta?:
            <br />
            <strong className="text-gray-900 font-medium">{usuario.email}</strong>?
          </p>
        </div>
        <div className="modal-botones-contenedor">
          <button type="button" onClick={onClose} className="btn-simple-gris">Cancelar</button>
          <button type="button" onClick={onConfirm} className="btn-primario">
            Sí, Enviar Email
          </button>
        </div>
      </div>
    </div>
  );
}