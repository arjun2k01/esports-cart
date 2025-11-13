// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        // Primary palette from BGMI
        'gaming-gold': '#FFB800',
        'gaming-orange': '#FF6B35',
        'gaming-dark': '#0D0D0D',
        'gaming-darker': '#1A1A1A',
        'surface-dark': '#2A2A2A',
        
        // Status colors
        'stock-green': '#00FF88',
        'out-red': '#FF4444',
      },
      fontFamily: {
        'display': ['Rajdhani', 'sans-serif'], // Bold gaming font
        'body': ['Inter', 'system-ui'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #0D0D0D 0%, #2A2A2A 100%)',
        'card-gradient': 'linear-gradient(180deg, #2A2A2A 0%, #1A1A1A 100%)',
      },
    },
  },
}
