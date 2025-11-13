import { createTRPCClient, httpBatchStreamLink } from "@trpc/client"

import type { AppRouter } from "@/api"

const client = createTRPCClient<AppRouter>({
  links: [httpBatchStreamLink({ url: "/api" })],
})

export default client
