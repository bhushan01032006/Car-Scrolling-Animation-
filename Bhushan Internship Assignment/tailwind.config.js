/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--bg-dark)",
        solar: {
          DEFAULT: '#FF5500',
          glow: '#FF7A1A',
          amber: '#FFB800',
          soft: 'rgba(255, 85, 0, 0.12)',
        },
        azure: {
          DEFAULT: '#00E5FF',
          soft: 'rgba(0, 229, 255, 0.12)',
        },
        carbon: {
          950: '#07090E',
          900: '#0C0F17',
          850: '#111520',
          800: '#161C2B',
          700: '#222B40',
        },
      },
      fontFamily: {
        display: ['"Outfit"', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
};
