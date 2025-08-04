/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Cyberpunk Dark Theme
        cyber: {
          bg: '#0D0D0D',
          surface: '#1A1A1A',
          card: '#252525',
          border: '#333333',
        },
        // Electric Blue
        primary: {
          50: '#E6F7FF',
          100: '#BAE7FF',
          200: '#7DD3FC',
          300: '#38BDF8',
          400: '#0EA5E9',
          500: '#0284C7', // Main electric blue
          600: '#0369A1',
          700: '#075985',
          800: '#0C4A6E',
          900: '#082F49',
          glow: '#00D9FF', // Bright glow
        },
        // Electric Purple/Magenta
        secondary: {
          50: '#FDF4FF',
          100: '#FAE8FF',
          200: '#F5D0FE',
          300: '#F0ABFC',
          400: '#E879F9',
          500: '#D946EF', // Main purple
          600: '#C026D3',
          700: '#A21CAF',
          800: '#86198F',
          900: '#701A75',
          glow: '#FF00FF', // Bright magenta glow
        },
        // Electric Green
        accent: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981', // Main green
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
          glow: '#00FF88', // Bright green glow
        },
        // Additional Neon Colors
        neon: {
          pink: '#FF0080',
          cyan: '#00FFFF',
          yellow: '#FFFF00',
          orange: '#FF8000',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Orbitron', 'monospace'],
        futuristic: ['Orbitron', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        card: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'glow-sm': '0 0 10px rgba(0, 217, 255, 0.3)',
        'glow-md': '0 0 20px rgba(0, 217, 255, 0.4)',
        'glow-lg': '0 0 30px rgba(0, 217, 255, 0.5)',
        'glow-xl': '0 0 40px rgba(0, 217, 255, 0.6)',
        'glow-purple': '0 0 20px rgba(255, 0, 255, 0.4)',
        'glow-green': '0 0 20px rgba(0, 255, 136, 0.4)',
        'inner-glow': 'inset 0 0 20px rgba(0, 217, 255, 0.1)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'tilt': 'tilt 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.6s ease-out',
        'fade-in': 'fade-in 0.8s ease-out',
        'glow-pulse': 'glow-pulse 1.5s ease-in-out infinite alternate',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(0, 217, 255, 0.4)',
            transform: 'scale(1)' 
          },
          '50%': { 
            boxShadow: '0 0 30px rgba(0, 217, 255, 0.8)',
            transform: 'scale(1.02)' 
          },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'tilt': {
          '0%, 100%': { transform: 'rotateY(0deg) rotateX(0deg)' },
          '50%': { transform: 'rotateY(2deg) rotateX(1deg)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(50px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'glow-pulse': {
          '0%': { textShadow: '0 0 10px rgba(0, 217, 255, 0.8)' },
          '100%': { textShadow: '0 0 20px rgba(0, 217, 255, 1), 0 0 30px rgba(0, 217, 255, 0.8)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'cyber-grid': "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23333333' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
      },
    },
  },
  plugins: [],
};
