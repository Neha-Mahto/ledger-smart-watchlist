/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ledger: {
          blue: '#2962FF',
          'blue-hover': '#1E53E5',
          'blue-light': '#EFF6FF',
          green: '#10B981',
          'green-hover': '#059669',
          'green-light': '#ECFDF5',
          bg: '#F8FAFC',
          surface: '#FFFFFF',
          card: '#FFFFFF',
          border: '#E2E8F0',
          'border-hover': '#CBD5E1',
          ink: '#0F172A',
          muted: '#64748B',
          amber: '#D97706',
          'amber-light': '#FEF3C7',
          red: '#EF4444',
          'red-light': '#FEE2E2',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Lora', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      }
    },
  },
  plugins: [],
}
