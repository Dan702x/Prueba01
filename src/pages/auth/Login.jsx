import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import sideImage from '../../assets/imgLogin2.png';
import companyLogo from '../../assets/logo.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Iniciando sesión con:', { email, password });
    navigate('/super/dashboard');
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
            <p className="-mt-4 text-base font-medium text-gray-600">
              Inicia sesión para continuar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                Correo Electrónico
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="empresa@correo.com"
                className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 placeholder-gray-400 shadow-sm transition-colors focus:border-[#243c7a] focus:outline-none focus:ring-1 focus:ring-[#243c7a]"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                Contraseña
              </label>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="•••••••••"
                className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 placeholder-gray-400 shadow-sm transition-colors focus:border-[#243c7a] focus:outline-none focus:ring-1 focus:ring-[#243c7a]"
              />
            </div>

            <div className="flex items-center justify-between">
              
              <div className="flex items-center">
                <input
                  id="show-password-check"
                  name="show-password-check"
                  type="checkbox"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-[#243c7a] focus:ring-[#243c7a]"
                />
                <label htmlFor="show-password-check" className="ml-2 block text-sm text-gray-900">
                  Visualizar contraseña
                </label>
              </div>
              
              <div className="text-sm">
                <Link to="/forgot" className="font-medium text-[#243c7a] hover:opacity-80">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-[#243c7a] px-4 py-3 font-semibold text-white shadow-sm transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#243c7a] focus:ring-offset-2"
            >
              Iniciar Sesión
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              ¿Eres una empresa?{' '}
              <Link to="/contact" className="font-medium text-[#243c7a] hover:opacity-80">
                Solicita tu acceso aquí
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}