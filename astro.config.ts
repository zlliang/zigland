import { defineConfig } from "astro/config"
import vue from "@astrojs/vue"
import vercel from "@astrojs/vercel"
import tailwindcss from "@tailwindcss/vite"
import rehypeExternalLinks from "rehype-external-links"

export default defineConfig({
  site: "https://zigland.dev",
  integrations: [vue()],
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    shikiConfig: {
      themes: { light: "github-light-default", dark: "github-dark-default" },
    },
    rehypePlugins: [
      [rehypeExternalLinks, { target: "_blank", rel: ["noopener"] }],
    ],
  },
  devToolbar: {
    enabled: false,
  },
  experimental: {
    svgo: true,
  },
})
