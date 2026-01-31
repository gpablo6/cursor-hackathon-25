/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'],
        'dm-sans': ['DM Sans', 'sans-serif'],
      },
      colors: {
        // Brand palette
        app: '#FBF7F2',
        surface: '#FFFFFF',
        primary: '#2E1E14',
        secondary: '#7B6A5C',
        placeholder: '#A89C90',
        brand: {
          orange: '#F07A2A',
          'orange-hover': '#D9641F',
          'focus-ring': '#FAD1B5',
        },
        action: {
          green: '#3FA166',
          'green-hover': '#368B58',
        },
        neutral: {
          border: '#E6DED6',
          'disabled-bg': '#EAE3DC',
          'disabled-text': '#BEB3A8',
        },
        // Pupuseria color tokens
        pupuseria: {
          maiz: '#F4C430',
          crema: '#FFF8EE',
          chicharron: '#7A4A2E',
          curtido: '#4CAF50',
          salsa: '#E53935',
        },
      },
    },
  },
  plugins: [],
};
