import { defineConfig } from "astro/config"
import vercel from "@astrojs/vercel"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  site: "https://zigland.dev",
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()],
  },
  devToolbar: {
    enabled: false,
  },
})
