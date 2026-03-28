import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { vitePrerenderPlugin } from 'vite-prerender-plugin'

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    ...vitePrerenderPlugin({
      renderTarget: '#root',
    }),
  ],
})
