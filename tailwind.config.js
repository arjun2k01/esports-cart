/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // BGMI-inspired gaming palette
        'gaming-gold': '#FFB800',
        'gaming-orange': '#FF6B35',
        'gaming-dark': '#0D0D0D',
        'gaming-darker': '#1A1A1A',
        'surface-dark': '#2A2A2A',
        'stock-green': '#00FF88',
        'out-red': '#FF4444',
      },
      fontFamily: {
        'display': ['Rajdhani', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #0D0D0D 0%, #2A2A2A 100%)',
        'card-gradient': 'linear-gradient(180deg, #2A2A2A 0%, #1A1A1A 100%)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
      },
    },
  },
  plugins: [],
}
