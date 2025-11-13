import { initTRPC } from "@trpc/server"

import * as routes from "@/api/routes"

const t = initTRPC.create()
const router = t.router
const procedure = t.procedure

export const appRouter = router({
  run: procedure.input(routes.run.schema).mutation(routes.run.handler),
})

export type AppRouter = typeof appRouter
