import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';


export default defineConfig({
    plugins: [react()],
    base: '/final4/',
    server: {
        port: 5173,
        host: 'localhost',
        cors: true,

        proxy: {

            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                secure: false,

                rewrite: (path) => path.replace(/^\/api/, '/final4-1.0-SNAPSHOT/api'),





            }
        }
    },

    build: {
        sourcemap: true,
    }
});