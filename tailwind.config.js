/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./extension/**/*.{html,ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#07080a',
          900: '#0a0c10',
          850: '#0d1015',
          800: '#11141c',
        },
        panel: {
          DEFAULT: '#10131b',
          card: '#141824',
          hover: '#191e2d',
          border: 'rgba(255, 255, 255, 0.08)',
          subtle: 'rgba(255, 255, 255, 0.04)',
        },
        ivory: {
          50: '#ffffff',
          100: '#fbf9f5',
          200: '#f4efe6',
          300: '#e7dfd0',
          DEFAULT: '#f4efe6',
          muted: '#a3a8b7',
        },
        gold: {
          light: '#f5edd8',
          DEFAULT: '#d4af37',
          dark: '#aa8823',
          glow: 'rgba(212, 175, 55, 0.25)',
        },
        emerald: {
          glow: 'rgba(16, 185, 129, 0.35)',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'panel': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
        'gold-glow': '0 0 20px rgba(235, 215, 175, 0.2)',
        'emerald-glow': '0 0 12px rgba(16, 185, 129, 0.4)',
        'card-glow': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
      },
      borderRadius: {
        '2xl': '18px',
        '3xl': '24px',
        '4xl': '32px',
      }
    },
  },
  plugins: [],
}
