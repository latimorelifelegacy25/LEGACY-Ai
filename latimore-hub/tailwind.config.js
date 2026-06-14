/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#243b53',
          900: '#2c3e50', // Primary brand color
        },
        accent: {
          50: '#fdf8f3',
          100: '#f9ede0',
          200: '#f2d7b8',
          300: '#ebc190',
          400: '#e4ab68',
          500: '#c49a6c', // Accent brand color
          600: '#b8885a',
          700: '#9a7148',
          800: '#7c5a36',
          900: '#5e4324',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}