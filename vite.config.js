import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  content: [
    './index.html',
    './src/**/*.{js,jsx}', 
  ],
  plugins: [
    tailwindcss(),
  ],
})