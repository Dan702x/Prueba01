import React from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

export default function InputFiltro({
  value,
  onChange,
  placeholder = "Filtrar...",
}) {
  const handleClick = (e) => {
    e.stopPropagation();
  };
  return (
    <div className="filtro-input-wrapper">
      <input
        type="text"
        className="filtro-input"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onClick={handleClick}
      />
      <MagnifyingGlassIcon className="filtro-input-icon" />
    </div>
  );
}
