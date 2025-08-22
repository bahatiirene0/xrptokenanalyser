/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        futuristic: ['"Orbitron"', 'system-ui', 'sans-serif'],
        grotesk: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
      },
      colors: {
        matrix: {
          green: '#00FF44',
          dark: '#001100',
        }
      },
      animation: {
        'matrix-rain': 'matrix-rain 20s linear infinite',
        'pulse-green': 'pulse-green 2s ease-in-out infinite alternate',
        'fade-in-up': 'fade-in-up 700ms ease-out both',
      },
      keyframes: {
        'matrix-rain': {
          '0%': { transform: 'translateY(-100vh)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'pulse-green': {
          '0%': { boxShadow: '0 0 5px #00FF44' },
          '100%': { boxShadow: '0 0 20px #00FF44, 0 0 30px #00FF44' },
        },
        'fade-in-up': {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}