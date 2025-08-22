/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        matrix: {
          green: '#00FF44',
          dark: '#001100',
        }
      },
      animation: {
        'matrix-rain': 'matrix-rain 20s linear infinite',
        'pulse-green': 'pulse-green 2s ease-in-out infinite alternate',
      },
      keyframes: {
        'matrix-rain': {
          '0%': { transform: 'translateY(-100vh)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'pulse-green': {
          '0%': { boxShadow: '0 0 5px #00FF44' },
          '100%': { boxShadow: '0 0 20px #00FF44, 0 0 30px #00FF44' },
        }
      }
    },
  },
  plugins: [],
}