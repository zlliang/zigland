import { Sandbox as VercelSandbox } from "@vercel/sandbox"

export class Sandbox {
  private sandbox: VercelSandbox

  constructor(sandbox: VercelSandbox) {
    this.sandbox = sandbox
  }

  static async create() {
    const sandbox = await VercelSandbox.create({
      teamId: import.meta.env.VERCEL_TEAM_ID,
      projectId: import.meta.env.VERCEL_PROJECT_ID,
      token: import.meta.env.VERCEL_TOKEN,
    })

    return new Sandbox(sandbox)
  }
}
