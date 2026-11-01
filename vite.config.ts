import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  server: { port: 5174, strictPort: true, host: 'localhost' },
  plugins: [
    react(),
    tailwindcss(),
  ],
})
