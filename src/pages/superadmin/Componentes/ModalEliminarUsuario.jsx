import React from "react";

export default function ModalEliminarUsuario({ usuario, onClose, onConfirm }) {
  return (
    <div className="modal-backdrop">
      <div className="modal-panel">
        <h3 className="modal-titulo">Confirmar Eliminación</h3>
        <div className="mt-4">
          <p className="modal-texto">
            ¿Estás seguro de que quieres{" "}
            <strong className="text-red-700">ELIMINAR PERMANENTEMENTE</strong>{" "}
            al usuario "{usuario.nombre}"?
          </p>
          <p className="text-xs text-red-600 mt-2 font-medium">
            ¡Esta acción no se puede deshacer!
          </p>
        </div>
        <div className="modal-botones-contenedor">
          <button type="button" onClick={onClose} className="btn-simple-gris">
            Cancelar
          </button>
          <button type="button" onClick={onConfirm} className="btn-simple-rojo">
            Sí, Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
