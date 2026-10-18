import { defineConfig } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl';
import baseConfig from './vite.config.js';

export default defineConfig({
  ...baseConfig,
  plugins: [basicSsl()],
  server: {
    ...baseConfig.server,
    https: true,
  },
});
