import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { registerToolClasses } from '@/utils/registerTools.ts'
import { ElementTool } from './Element'
import { MiniProgramTool } from './MiniProgram'
import { PageTool } from './Page'

export function registerTools(server: McpServer, port: number) {
  registerToolClasses(
    [MiniProgramTool, PageTool, ElementTool],
    [server, port],
  )
}
