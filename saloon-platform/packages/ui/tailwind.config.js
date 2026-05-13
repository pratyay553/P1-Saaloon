/** @type {import('tailwindcss').Config} */
const sharedConfig = require('@saloon/config-tailwind');

module.exports = {
  presets: [sharedConfig],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
};
