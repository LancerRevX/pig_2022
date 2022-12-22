import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ssr from 'vite-plugin-ssr/plugin'
import {VitePWA} from 'vite-plugin-pwa'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      }
      // base: '/'
    })
  ],
  // base: '/static/',
  // build: {
  //   manifest: true
  // },
  // experimental: {
  //   renderBuiltUrl(filename, {type, hostType, hostId}) {
  //     if (type === 'public') {
  //       return 'https://www.domain.com/' + filename
  //     }
  //     else if (path.extname(hostId) === '.js') {
  //       return { runtime: `window.__assetsPath(${JSON.stringify(filename)})` }
  //     }
  //     else {
  //       return '/static/' + filename
  //     }
  //   }
  // },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
