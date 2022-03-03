module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    maxWidth: {
      '1/4': '25%',
      '2/5': '40%',
      '1/2': '50%',
      '3/4': '75%',
      '4/5': '80%',
      '7/8': '87%',
      '7/12': '58.333333%',
      '11/12': '91.6%',
    },
    extend: {
      height: {
        18: '4.3rem',
      },
      minHeight: {
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%',
        14: '3.5rem',
      },
      colors: {
        darkest: '#151515',
      },
    },
  },
  plugins: [],
};
