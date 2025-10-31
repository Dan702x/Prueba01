import React from 'react';

export default function TarjetaEstadistica({ label, value, icon, color = "blue" }) {
  const colorClasses = {
    blue: { bg: "bg-blue-100", text: "text-blue-600" },
    green: { bg: "bg-green-100", text: "text-green-600" },
    red: { bg: "bg-red-100", text: "text-red-600" },
    gray: { bg: "bg-gray-100", text: "text-gray-600" },
  };
  const selectedColor = colorClasses[color] || colorClasses.blue;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 flex items-center">
      <div
        className={`mr-4 flex-shrink-0 p-3 ${selectedColor.bg} ${selectedColor.text} rounded-full`}
      >
        {icon}
      </div>
      <div>
        <div className="text-3xl font-bold text-gray-800">{value}</div>
        <div className="text-sm font-medium text-gray-500">{label}</div>
      </div>
    </div>
  );
}