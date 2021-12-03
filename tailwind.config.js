module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      minHeight: {
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%',
        14: '3.5rem',
      },
    },
  },
  variants: {
    extend: {
      width: ['focus'],
      boxShadow: ['active'],
    },
  },
  plugins: [],
};
