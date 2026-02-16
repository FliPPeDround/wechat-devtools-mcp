import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type MiniProgram from 'miniprogram-automator/out/MiniProgram'
import { registerToolClasses } from '@/utils/registerTools.ts'
import { ElementTool } from './element'
import { MiniProgramTool } from './miniProgram'
import { PageTool } from './page'

export function registerTools(miniProgram: MiniProgram, server: McpServer) {
  registerToolClasses(
    [MiniProgramTool, PageTool, ElementTool],
    [miniProgram, server],
  )
}
