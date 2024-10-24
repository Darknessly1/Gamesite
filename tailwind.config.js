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
    },
  },
  plugins: [require("tw-elements/plugin.cjs")],
});