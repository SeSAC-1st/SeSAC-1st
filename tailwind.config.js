module.exports = {
  content: ['./node_modules/flowbite/**/*.js', './views/**/*.{html,js,ejs}'],
  theme: {
    extend: {
      colors: { maincolor: '#006eff' },
    },
  },
  plugins: [require('flowbite/plugin')],
};
