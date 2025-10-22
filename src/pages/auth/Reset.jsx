import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import sideImage from "../../assets/imgLogin2.png";
import companyLogo from "../../assets/logo.png";

const IconCheckCircle = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-16 h-16 text-green-500 mx-auto"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 sm:p-8 shadow-2xl text-center transform transition-all">
        <div>
          <IconCheckCircle />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mt-4">{title}</h3>
        <div className="mt-2">
          <p className="text-base text-gray-600">{children}</p>
        </div>
        <div className="mt-6 sm:mt-8">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-lg bg-[#243c7a] px-4 py-3 font-semibold text-white shadow-sm transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#243c7a] focus:ring-offset-2"
          >
            Ir a Iniciar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Reset() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    console.log("Nueva contraseña establecida:", password);
    setShowModal(true);
  };

  const handleCloseModalAndRedirect = () => {
    setShowModal(false);
    navigate("/login");
  };

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      <Modal
        isOpen={showModal}
        onClose={handleCloseModalAndRedirect}
        title="¡Contraseña Restablecida!"
      >
        Tu contraseña ha sido cambiada exitosamente.
      </Modal>

      <div
        className="hidden bg-cover bg-center md:block"
        style={{ backgroundImage: `url(${sideImage})` }}
      />

      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6 sm:p-12">
        
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white px-8 py-6 sm:px-10 sm:py-8 shadow-xl">
          
          <div className="mb-8 text-center">
            <img
              src={companyLogo}
              alt="Logo de la Empresa"
              className="mx-auto h-auto w-48 sm:w-64"
            />
            <h1 className="-mt-4 text-2xl font-bold text-gray-800">
              Restablecer Contraseña
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Tu nueva contraseña debe ser diferente a las utilizadas
              anteriormente.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700"
              >
                Contraseña
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 placeholder-gray-400 shadow-sm transition-colors focus:border-[#243c7a] focus:outline-none focus:ring-1 focus:ring-[#243c7a]"
              />
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-semibold text-gray-700"
              >
                Confirmar Contraseña
              </label>
              <input
                id="confirm-password"
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 placeholder-gray-400 shadow-sm transition-colors focus:border-[#243c7a] focus:outline-none focus:ring-1 focus:ring-[#243c7a]"
              />
            </div>

            <div className="flex items-center">
              <input
                id="show-password-check"
                name="show-password-check"
                type="checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-[#243c7a] focus:ring-[#243c7a]"
              />
              <label
                htmlFor="show-password-check"
                className="ml-2 block text-sm text-gray-900"
              >
                Visualizar contraseñas
              </label>
            </div>

            {error && (
              <p className="text-center text-sm font-medium text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-lg bg-[#243c7a] px-4 py-3 font-semibold text-white shadow-sm transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#243c7a] focus:ring-offset-2"
            >
              Restablecer Contraseña
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              <Link
                to="/login"
                className="font-medium text-[#243c7a] hover:opacity-80"
              >
                Volver a Iniciar Sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}