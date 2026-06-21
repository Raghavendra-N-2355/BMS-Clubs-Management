import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/BMS-Clubs-Management/'   // 👈 important for GitHub Pages
})
