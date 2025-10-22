/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // <-- ¡Esta es la línea que faltaba!
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}