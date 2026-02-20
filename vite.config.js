import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    root: '.',
    base: '/TU_TP1/',
    define: {
        'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'https://jsonplaceholder.typicode.com')
    }
});
