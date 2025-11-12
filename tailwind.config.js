/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          night: '#0b1220',
          navy: '#0e1a2b',
          blue: '#3b82f6',
          teal: '#14b8a6',
          orange: '#ff7a00',
          orangelight: '#ffaa4d',
        },
      },
    },
  },
  plugins: [],
};
