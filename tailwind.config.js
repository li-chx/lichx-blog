// tailwind config file
import plugin from 'tailwindcss/plugin';
import tailwindScrollbar from 'tailwind-scrollbar';
import breakpoints from '~/configs/breakpoints';

export default {
  mode: 'jit',
  darkMode: 'class',
  theme: {
    extend: {
      colors: {},
      letterSpacing: {
        doublewidest: '.2em',
      },
    },
    screens: breakpoints,
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          /* IE and Edge */
          '-ms-overflow-style': 'none',

          /* Firefox */
          'scrollbar-width': 'none',

          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      });
    }),
    tailwindScrollbar,
  ],
  content: [
    './app.vue',
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
  ],
};
