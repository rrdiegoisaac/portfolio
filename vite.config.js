import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // El proyecto vive en una carpeta de OneDrive, que convierte los archivos de
    // node_modules en "reparse points". Sin esta opción, Vite no logra resolver los
    // paquetes (ej. "failed to resolve import react") una vez que OneDrive los procesa.
    preserveSymlinks: true,
  },
})
