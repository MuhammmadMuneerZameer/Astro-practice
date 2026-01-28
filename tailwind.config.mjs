export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0f172a',
          light: '#ffffff',
          accent: '#00f19f',
          'accent-hover': '#04b477',
          neutral: {
            900: '#18181b',
            800: '#27272a',
            700: '#3f3f46',
            700: '#3f3f46',
            400: '#a1a1aa',
          },
          'text-soft': '#cee1da',
        }
      },
      fontFamily: {
        heading: ['Amurg', 'sans-serif'],
        sub: ['Amurg', 'sans-serif'], // User requested Amurg everywhere, replacing Coolvetica
        body: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      }
    },
  },
  plugins: [],
};