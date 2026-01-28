export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./App.tsx",
    "./index.tsx",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Rajdhani', 'sans-serif'],
        display: ['Teko', 'sans-serif'],
      },
      colors: {
        codm: {
          yellow: '#fbbf24',
          yellow_hover: '#d97706',
          dark: '#0b0f15',
          panel: '#151b24',
          gray: '#94a3b8',
          accent: '#3b82f6'
        },
        rarity: {
          mythic: '#ef4444',
          legendary: '#f59e0b',
          epic: '#a855f7',
          rare: '#3b82f6'
        }
      },
      backgroundImage: {
        'hex-pattern': "url('https://grainy-gradients.vercel.app/noise.svg')",
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}

