import React, { useState, useEffect } from "react";

export default function ModalEditarUsuario({ usuario, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    estado: "Activo",
  });

  useEffect(() => {
    if (usuario) {
      setFormData({
        nombre: usuario.nombre || "",
        email: usuario.email || "",
        estado: usuario.estado || "Activo",
      });
    }
  }, [usuario]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-panel">
        <form onSubmit={handleSubmit}>
          <h3 className="modal-titulo">Editar Super Admin</h3>
          <div className="mt-4 grid grid-cols-1 gap-4">
            <div>
              <label className="cu-form-label">Nombre del Usuario</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="cu-form-input"
                required
              />
            </div>
            <div>
              <label className="cu-form-label">Email del Usuario</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="cu-form-input"
                required
              />
            </div>
            <div>
              <label className="cu-form-label">Estado</label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="cu-form-select-padding"
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
          </div>
          <div className="modal-botones-contenedor">
            <button type="button" onClick={onClose} className="btn-simple-gris">
              Cancelar
            </button>
            <button type="submit" className="btn-primario">
              Actualizar Usuario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
