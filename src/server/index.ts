import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { version } from '../../package.json'

export async function createMcpServer() {
  const server = new McpServer({
    name: 'wechat-devtools',
    version,
  })

  return server
}
