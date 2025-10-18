import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        peach: {
          50: '#fef7f0',
          100: '#fdeee0',
          200: '#fbd9c1',
          300: '#f8c4a2',
          400: '#f5af83',
          500: '#f29a64',
          600: '#d8854a',
          700: '#be7030',
          800: '#a45b16',
          900: '#8a4600',
        },
      },
    },
  },
  plugins: [],
};
export default config;
