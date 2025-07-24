/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Ini memberitahu Tailwind untuk memindai semua file di folder src
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
