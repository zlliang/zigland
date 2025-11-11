import { defineConfig } from "astro/config"
import vercel from "@astrojs/vercel"
import tailwindcss from "@tailwindcss/vite"
import rehypeExternalLinks from "rehype-external-links"

export default defineConfig({
  site: "https://zigland.dev",
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    shikiConfig: {
      themes: { light: "github-light-default", dark: "github-dark-default" },
    },
    rehypePlugins: [
      [rehypeExternalLinks, { target: "_blank", rel: ["nofollow", "noopener", "noreferrer"] }],
    ],
  },
  devToolbar: {
    enabled: false,
  },
})
