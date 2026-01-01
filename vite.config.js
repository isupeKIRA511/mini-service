import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [react()],
  server: {

    allowedHosts: ['njckgvz2dxxm.share.zrok.io', 'wi1rc807p0kw.share.zrok.io', 'y4jd74wa4fwl.share.zrok.io']
  }
})