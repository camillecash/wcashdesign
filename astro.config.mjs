import {defineConfig} from 'astro/config'
import sitemap from '@astrojs/sitemap'
import cloudflare from '@astrojs/cloudflare'
import react from '@astrojs/react'

export default defineConfig({
  site: 'https://wcashdesign.com',
  adapter: cloudflare(),
  integrations: [react(), sitemap()],
})
