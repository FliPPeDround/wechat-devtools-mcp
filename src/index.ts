#!/usr/bin/env node

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { parseArguments } from '@/utils/parseArguments'
import { Automator } from './automator'
import { createMcpServer } from './server'
import { registerTools } from './tools'

async function main() {
  const argv = parseArguments()
  const { cliPath, projectPath } = argv
  const automator = new Automator({ cliPath, projectPath })
  const miniProgram = await automator.launch()

  const server = await createMcpServer()
  registerTools(miniProgram, server)

  const transport = new StdioServerTransport()
  await server.connect(transport)
}

main().catch(console.error)
