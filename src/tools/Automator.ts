import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type MiniProgram from 'miniprogram-automator/out/MiniProgram'
import automator from 'miniprogram-automator'
import z from 'zod'

interface ConsoleLog {
  type: string
  args: unknown[]
  time: string
}

interface Exception {
  name: string
  stack: string
  time: string
}

export interface LaunchOptions {
  /** 小程序项目路径 */
  projectPath: string
  /** 连接超时时间（毫秒），默认 3000 */
  timeout?: number
  /** 微信开发者工具 CLI 路径，有默认值 */
  cliPath?: string
  /** 微信开发者工具端口 */
  port: number
  /** 账号 ID */
  account?: string
  /** 项目配置文件 */
  projectConfig?: Record<string, unknown>
  /** 项目 ticket */
  ticket?: string
}

export class Automator {
  private static readonly MAX_LOGS = 100
  public miniProgram: MiniProgram | null = null
  private consoleLogs: ConsoleLog[] = []
  private exceptionLogs: Exception[] = []
  private consoleListenerStarted = false
  private exceptionListenerStarted = false

  private getTimeString(): string {
    const now = new Date()
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')
    return `${hours}:${minutes}:${seconds}`
  }

  constructor(
    private options: LaunchOptions,
    private server: McpServer,
  ) {
    this.registerLaunch()
    this.registerLogs()
    this.registerExceptions()
  }

  async launch() {
    this.miniProgram = await automator.launch(this.options)
    console.error(this.miniProgram)
    this.startConsoleListener()
  }

  async connect() {
    this.miniProgram = await automator.connect({
      wsEndpoint: `ws://localhost:${this.options.port}`,
    })
    this.startConsoleListener()
  }

  startConsoleListener() {
    if (!this.miniProgram || this.consoleListenerStarted)
      return
    this.consoleListenerStarted = true
    this.consoleLogs = []
    this.miniProgram.on('console', (msg) => {
      this.consoleLogs.push({
        type: msg.type,
        args: msg.args,
        time: this.getTimeString(),
      })
      if (this.consoleLogs.length > Automator.MAX_LOGS) {
        this.consoleLogs.shift()
      }
    })
  }

  startExceptionListener() {
    if (!this.miniProgram || this.exceptionListenerStarted)
      return
    this.exceptionListenerStarted = true
    this.exceptionLogs = []
    this.miniProgram.on('exception', (msg) => {
      this.exceptionLogs.push({
        name: msg.name,
        stack: msg.stack,
        time: this.getTimeString(),
      })
      if (this.exceptionLogs.length > Automator.MAX_LOGS) {
        this.exceptionLogs.shift()
      }
    })
  }

  registerLaunch() {
    this.server.registerTool(
      'launch',
      {
        title: '启动小程序',
        description: '启动微信开发者工具并连接小程序自动化实例（其他工具的前置条件）。如端口被占用表示已启动，可继续其他操作。',
      },
      async () => {
        try {
          await this.launch()
          return {
            content: [{
              type: 'text',
              text: '小程序已启动并连接。',
            }],
          }
        }
        catch (error) {
          return {
            content: [{
              type: 'text',
              text: `启动小程序时出错: ${error}`,
            }],
          }
        }
      },
    )
  }

  registerLogs() {
    this.server.registerTool(
      'getlogs',
      {
        title: '获取日志',
        description: '获取小程序运行时的控制台日志，包括 console.log、console.info、console.warn、console.error 等。可用于调试小程序异常或查看业务流程日志。',
        inputSchema: {
          type: z.string().default('log').describe('日志类型，可选 log、info、warn、error、debug'),
          limit: z.number().max(Automator.MAX_LOGS).min(1).default(Automator.MAX_LOGS).describe('返回的日志数量限制'),
        },
      },
      ({ type = 'log', limit = Automator.MAX_LOGS }) => ({
        content: this.consoleLogs
          .filter(log => log.type === type)
          .slice(0, limit)
          .map(log => ({
            type: 'text',
            text: `${log.time} ${log.type}: ${log.args.map(arg => JSON.stringify(arg)).join(' ')}`,
          })),
      }),
    )
  }

  registerExceptions() {
    this.server.registerTool(
      'getexceptions',
      {
        title: '获取异常',
        description: '获取小程序运行时的异常信息，包括错误名称、堆栈跟踪和发生时间。可用于定位小程序崩溃原因或代码错误。',
        inputSchema: {
          limit: z.number().max(Automator.MAX_LOGS).min(1).default(Automator.MAX_LOGS).describe('返回的异常数量限制'),
        },
      },
      ({ limit = Automator.MAX_LOGS }) => ({
        content: this.exceptionLogs
          .slice(0, limit)
          .map(log => ({
            type: 'text',
            text: `${log.time} ${log.name}: ${log.stack}`,
          })),
      }),
    )
  }
}
