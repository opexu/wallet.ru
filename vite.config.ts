import { fileURLToPath, URL } from 'node:url'
import path from 'path';

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ command, mode }) => ({
    plugins: [ vue(), ],
    root: path.resolve( __dirname, 'src' ),
    build: {
        outDir: 'dist',
    },
    base: ((process.env.GITHUB_REPOSITORY ?? "") + "/").match(/(\/.*)/)?.[1],
    server: {
        port: 3000,
        watch: {
            usePolling: true,
        }
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
} ));
