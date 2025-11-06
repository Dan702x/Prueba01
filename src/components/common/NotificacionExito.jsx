import React from "react";
import { CheckCircleIcon, XMarkIcon as CloseIcon } from "@heroicons/react/24/solid";

export default function NotificacionExito({ message, show, onClose }) {
  if (!show) return null;

  return (
    <div className="fixed top-5 right-5 z-50 animate-slide-in-right">
      <div className="max-w-sm w-full bg-green-500 text-white rounded-md shadow-lg flex items-center p-4">
        <CheckCircleIcon className="w-6 h-6 mr-3" />
        <p className="flex-1 text-sm font-medium">{message}</p>
        <button
          onClick={onClose}
          className="ml-3 p-1 rounded-md hover:bg-green-600 focus:outline-none"
        >
          <CloseIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}