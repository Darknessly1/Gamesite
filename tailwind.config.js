import withMT from "@material-tailwind/html/utils/withMT";

export default withMT({
  content: [
    "./index.html", "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/tw-elements/js/**/*.js"
    
  ],
  theme: {
    extend: {
      colors: {
        'nt-header-bg': '#302113',
      },
      fontFamily: {
        mono: ['"Lucida Console"', '"Courier New"', 'monospace'], 
      },
      keyframes: {
        colorFade: {
          '0%': { backgroundPosition: '100% 0%' },
          '100%': { backgroundPosition: '100% 100%' },
        },
      },
      animation: {
        colorFade: 'colorFade 8s linear infinite',
      },
      backgroundSize: {
        'double': '100% 200%',
      },
    },
  },
  plugins: [require("tw-elements/plugin.cjs")],
});