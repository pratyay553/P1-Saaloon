const config = {
  content: [
    "../../apps/*/src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../apps/*/app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../apps/*/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "../../apps/*/components/**/*.{js,ts,jsx,tsx,mdx}",
    "../../apps/*/features/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0070f3",
          hover: "#005bb5",
        }
      }
    },
  },
  plugins: [],
};

module.exports = config;
