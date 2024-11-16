import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'point-dark': '#654321',
        'point-light': '#DEB887',
        'wood-dark': '#5C4033',
      },
      zIndex: {
        '100': '100',
      }
    },
  },
  plugins: [],
}

export default config;
