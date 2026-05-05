import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // ⚠ cambia esto por el nombre exacto de tu repo en GitHub
  base: '/HIPATIA-SORJUANA/',
})
