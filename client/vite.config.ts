import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // 👈 이 부분을 추가/수정하세요
    proxy: {
      // '/api'로 시작하는 모든 요청을 8080 포트로 전달합니다.
      '/api': {
        target: 'http://localhost:8080', 
        changeOrigin: true, // 호스트 헤더를 백엔드로 변경
        secure: false, 
      },
    },
  }
})
