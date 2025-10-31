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
    <div className="relative my-1">
      <input
        type="text"
        className="w-full pl-8 pr-2 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onClick={handleClick}
      />
      <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
    </div>
  );
}