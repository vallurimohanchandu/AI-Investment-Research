/**
 * PostCSS configuration for Tailwind CSS.
 *
 * Next.js runs PostCSS automatically on imported CSS files (e.g. app/globals.css).
 * This file wires Tailwind and Autoprefixer into that pipeline.
 */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
