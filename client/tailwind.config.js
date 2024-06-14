// tailwind.config.js
import { tailwindConfig } from '@storefront-ui/vue/tailwind-config';

/** @type {import('tailwindcss').Config} */
export default {
  presets: [tailwindConfig],
  content: [
      './index.html',
    './**/*.vue',
    './node_modules/@storefront-ui/vue/**/*.{js,mjs}',
    './pages/**/*.{ts,tsx,vue}',
    './components/**/*.{ts,tsx,vue}',
    './app/**/*.{ts,tsx,vue}',
    './src/**/*.{ts,tsx,vue}'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
