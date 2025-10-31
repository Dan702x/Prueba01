import React from "react";
import { CalendarIcon, XMarkIcon as CloseIcon } from "@heroicons/react/24/solid";

const CustomDateInput = React.forwardRef(
  ({ value, onClick, onChange, placeholder, onClear }, ref) => (
    <div className="relative my-1">
      <input
        type="text"
        className="w-full pl-8 pr-10 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
        value={value}
        placeholder={placeholder}
        onClick={onClick}
        onChange={onChange}
        ref={ref}
        autoComplete="off"
      />
      <CalendarIcon className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      {value && (
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none"
          onClick={(e) => {
            e.stopPropagation();
            onClear();
          }}
        >
          <CloseIcon className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
);

export default CustomDateInput;