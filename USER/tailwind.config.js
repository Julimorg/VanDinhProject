/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        loginbg: '#145235',
        navbarbg: '#22c55e',
      }
    },
  },
  plugins: [],
}

