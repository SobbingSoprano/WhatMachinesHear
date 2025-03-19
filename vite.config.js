import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// https://vitejs.dev/config/
export default {
    server: {
        https: {
            key: fs.readFileSync(path.resolve(__dirname, './localhost-key.pem')),
            cert: fs.readFileSync(path.resolve(__dirname, './localhost.pem'))
        },
        host: '0.0.0.0',
    },
};