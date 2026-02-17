#!/usr/bin/env node

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { parseArguments } from '@/utils/parseArguments'
import { registerSystemPrompt } from './prompt'
import { createMcpServer } from './server'
import { registerTools } from './tools'
import { Automator } from './tools/Automator'

async function main() {
  const options = parseArguments()
  const server = await createMcpServer()
  registerSystemPrompt(server)

  new Automator(options, server)

  registerTools(server, options.port)

  const transport = new StdioServerTransport()
  await server.connect(transport)
}

main().catch(console.error)
