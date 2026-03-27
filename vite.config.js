import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync } from 'fs'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-onnx-model',
      closeBundle() {
        try {
          copyFileSync('public/asthma_model.onnx', 'dist/asthma_model.onnx')
          console.log('✅ asthma_model.onnx dist klasörüne kopyalandı')
        } catch (e) {
          console.warn('⚠️ Model kopyalanamadı:', e.message)
        }
      }
    }
  ],
})