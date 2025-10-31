import React, { useState } from "react";

const estadoInicialForm = {
  nombre: "",
  email: "",
};

export default function ModalCrearUsuario({ onClose, onSubmit }) {
  const [nuevoUsuario, setNuevoUsuario] = useState(estadoInicialForm);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoUsuario((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(nuevoUsuario); // Envía los datos al padre
    setNuevoUsuario(estadoInicialForm); // Resetea el form
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-panel">
        <form onSubmit={handleSubmit}>
          <h3 className="modal-titulo">Crear Nuevo Super Admin</h3>
          <div className="mt-4 grid grid-cols-1 gap-4">
            <div>
              <label className="cu-form-label">Nombre Completo</label>
              <input
                type="text"
                name="nombre"
                value={nuevoUsuario.nombre}
                onChange={handleChange}
                className="cu-form-input"
                required
              />
            </div>
            <div>
              <label className="cu-form-label">Email</label>
              <input
                type="email"
                name="email"
                value={nuevoUsuario.email}
                onChange={handleChange}
                className="cu-form-input"
                required
              />
            </div>
            <p className="cu-form-nota">
              Se enviará un correo al email registrado para que pueda visualizar{" "}
              <strong>su contraseña asignada.</strong>.
            </p>
          </div>
          <div className="modal-botones-contenedor">
            <button type="button" onClick={onClose} className="btn-simple-gris">
              Cancelar
            </button>
            <button type="submit" className="btn-primario">
              Crear y Enviar Email
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
