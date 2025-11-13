import { z } from "zod"
import { Sandbox } from "@vercel/sandbox"

export const schema = z.object({
  code: z.string().min(1, "Code is required"),
})

export async function* handler({ input }: { input: z.infer<typeof schema> }) {
  // Initialize sandbox

  yield "==> Initializing running sandbox...\n"

  const sandbox = await Sandbox.create({
    teamId: import.meta.env.VERCEL_TEAM_ID,
    projectId: import.meta.env.VERCEL_PROJECT_ID,
    token: import.meta.env.VERCEL_TOKEN,
  })

  // Write files

  await sandbox.writeFiles([
    { path: "./source/main.zig", content: Buffer.from(input.code) },
  ])

  // Install system dependencies

  yield "==> Installing system dependencies...\n"

  let systemPrepareCmd = await sandbox.runCommand({
    cmd: "dnf",
    args: ["-q", "install", "-y", "xz", "wget"],
    sudo: true,
    detached: true,
  })

  for await (const log of systemPrepareCmd.logs()) {
    yield log.data
  }

  const systemPrepareResult = await systemPrepareCmd.wait()
  if (systemPrepareResult.exitCode !== 0) {
    return
  }

  // Get Zig tarball URL

  yield "==> Downloading Zig compiler...\n"

  const zigManifest = await fetch("https://ziglang.org/download/index.json").then(res => res.json())
  const zigTarballLink = zigManifest["master"]["x86_64-linux"]["tarball"]
  const zigTarballName = zigTarballLink.split("/").pop()
  const zigDir = zigTarballName.split(".tar.xz")[0]

  // Download the tarball

  const downloadCmd = await sandbox.runCommand({
    cmd: "wget",
    args: ["--no-verbose", zigTarballLink],
    detached: true,
  })

  for await (const log of downloadCmd.logs()) {
    yield log.data
  }

  const downloadResult = await downloadCmd.wait()
  if (downloadResult.exitCode !== 0) {
    return
  }

  // Extract the executable to ./compiler

  yield "==> Extracting Zig compiler...\n"

  const extractCmd = await sandbox.runCommand({
    cmd: "tar",
    args: ["-xf", zigTarballName],
    detached: true,
  })

  for await (const log of extractCmd.logs()) {
    yield log.data
  }

  const extractResult = await extractCmd.wait()
  if (extractResult.exitCode !== 0) {
    return
  }

  // Output the Zig version

  yield "==> Using Zig version:\n"

  const zigVersionCmd = await sandbox.runCommand({
    cmd: `./${zigDir}/zig`,
    args: ["version"],
    detached: true,
  })

  for await (const log of zigVersionCmd.logs()) {
    yield log.data
  }

  const zigVersionResult = await zigVersionCmd.wait()
  if (zigVersionResult.exitCode !== 0) {
    return
  }

  // Run the code

  yield "==> Running the code, result:\n\n"

  const runCmd = await sandbox.runCommand({
    cmd: `./${zigDir}/zig`,
    args: ["run", "./source/main.zig"],
    detached: true,
  })

  for await (const log of runCmd.logs()) {
    yield log.data
  }

  const runResult = await runCmd.wait()
  if (runResult.exitCode !== 0) {
    return
  }

  yield "\n"
}
