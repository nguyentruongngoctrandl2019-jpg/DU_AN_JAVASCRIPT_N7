import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          login: resolve(__dirname, 'login.html'),
          register: resolve(__dirname, 'register.html'),
          products: resolve(__dirname, 'products.html'),
          productDetail: resolve(__dirname, 'product-detail.html'),
          profile: resolve(__dirname, 'profile.html'),
          cart: resolve(__dirname, 'cart.html'),
          checkout: resolve(__dirname, 'checkout.html'),
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
