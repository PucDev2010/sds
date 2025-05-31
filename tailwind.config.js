/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/*/.{ts,tsx}', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'logo-color': '#ea2b7b'
      }
    },
    screens: {
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
      '2xl': '1600px'
    }
  },
  plugins: [],
  corePlugins: {
    preflight: true
  }
};
