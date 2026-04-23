/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4472C4',
        secondary: '#D9E1F2',
        error: '#FFC7CE',
        warning: '#FFEB9C',
      },
    },
  },
  plugins: [],
}
