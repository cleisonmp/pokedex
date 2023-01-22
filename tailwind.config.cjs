/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        outline: '0 0 0 1px',
      },
      brightness: {
        25: '.25',
        85: '.85',
      },
      colors: {
        app: {
          //primary: '#E3350D',
          primary: '#CC0000',
          secondary: '#1847D7',
          tertiary: '#E6BC2F',

          background: '#F5F5F5',
          backgroundDark: '#919191',
          text: '#393939',
          label: '#919191',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          '"Noto Sans"',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
        mono: [
          'Roboto Mono',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          '"Liberation Mono"',
          '"Courier New"',
          'monospace',
        ],
        start: ['"Press Start 2P"', 'cursive'],
      },
      gridTemplateColumns: {
        // 56px grid columns
        fit56: 'repeat(auto-fit, minmax(3.5rem, 1fr))',
      },
      opacity: {
        85: '.85',
      },
      screens: {
        xxs: '320px',
        xs: '480px',
      },
      zIndex: {
        9999: '9999',
      },
    },
  },
  plugins: [],
}
