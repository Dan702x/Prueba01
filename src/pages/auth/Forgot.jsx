import { useState } from "react";
import { Link } from "react-router-dom";

import sideImage from "../../assets/imgLogin2.png";
import companyLogo from "../../assets/logo.png";

export default function Forgot() {
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Enviando enlace de recuperación a:", email);
    setIsSent(true);
  };

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      <div
        className="hidden bg-cover bg-center md:block"
        style={{ backgroundImage: `url(${sideImage})` }}
      />

      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6 sm:p-12">
        
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 sm:p-10 shadow-xl">
          
          <div className="mb-8 text-center">
            <img
              src={companyLogo}
              alt="Logo de la Empresa"
              className="mx-auto h-auto w-48 sm:w-64"
            />
            <h1 className="-mt-2 text-2xl font-bold text-gray-800">
              ¿Olvidaste tu contraseña?
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              No te preocupes. Ingresa tu correo y te enviaremos un enlace.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700"
              >
                Correo Electrónico
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                disabled={isSent}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="empresa@correo.com"
                className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 placeholder-gray-400 shadow-sm transition-colors focus:border-[#243c7a] focus:outline-none focus:ring-1 focus:ring-[#243c7a] disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={isSent}
              className="w-full rounded-lg bg-[#243c7a] px-4 py-3 font-semibold text-white shadow-sm transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#243c7a] focus:ring-offset-2 disabled:opacity-50"
            >
              {isSent ? "Enlace Enviado" : "Enviar enlace"}
            </button>

            {isSent && (
              <div className="rounded-md bg-green-50 p-4">
                <p className="text-center text-sm font-medium text-green-800">
                  ¡Listo! Si el correo <strong>{email}</strong> está registrado,
                  recibirás un enlace en breve.
                </p>
              </div>
            )}
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