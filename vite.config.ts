import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve('.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve('index.html'),
          thankYou: path.resolve('thank-you.html'),
          checkout: path.resolve('checkout.html'),
          cart: path.resolve('cart.html'),
          products: path.resolve('products.html'),
          productDetail: path.resolve('product-detail.html'),
          profile: path.resolve('profile.html'),
          login: path.resolve('login.html'),
          register: path.resolve('register.html'),
          admin: path.resolve('admin.html'),
        },
      },
    },
  };
});
