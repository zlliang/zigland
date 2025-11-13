import { fetchRequestHandler } from "@trpc/server/adapters/fetch"

import { appRouter } from "@/api"

import type { APIRoute } from "astro"

export const prerender = false

export const ALL: APIRoute = (context) => {
  return fetchRequestHandler({
    endpoint: "/api",
    req: context.request,
    router: appRouter,
  })
}
