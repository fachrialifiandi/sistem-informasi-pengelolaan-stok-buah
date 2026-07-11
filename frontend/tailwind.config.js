module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#006B44', // Forest green based on image design
          dark: '#004F32',
          light: '#E5F4EE',
          gray: '#F0F3F1'
        },
        accent: {
          blue: '#006B7B'
        }
      }
    },
  },
  plugins: [],
}
