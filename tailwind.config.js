/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "-apple-system", "\"Segoe UI\"", "Roboto", "\"Helvetica Neue\"", "Arial"],
        inter: ["var(--font-inter)", "sans-serif"],
        raleway: ["var(--font-raleway)", "ui-sans-serif", "system-ui", "-apple-system", "\"Segoe UI\"", "Roboto", "\"Helvetica Neue\"", "Arial"],
        montserrat: ["var(--font-montserrat)", "ui-sans-serif", "system-ui", "-apple-system", "\"Segoe UI\"", "Roboto", "\"Helvetica Neue\"", "Arial"],
      },
    },
  },
  plugins: [],
};
