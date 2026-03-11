const config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {
      colors: {
        rose: { 500: '#f43f5e' },
        yellow: { 500: '#eab308' },
        blue: { 500: '#3b82f6' },
        slate: { 500: '#64748b' },
        emerald: { 500: '#10b981' },
      }
    },
  },
  plugins: [],
};
export default config;