import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type MiniProgram from 'miniprogram-automator/out/MiniProgram'
import z from 'zod'

export class MiniProgramTool {
  constructor(private miniProgram: MiniProgram, private server: McpServer) {}

  pageStack() {
    this.server.registerTool(
      'pageStack',
      {
        title: 'pageStack',
        description: '获取小程序页面堆',
      },
      async () => {
        const pageStack = await this.miniProgram.pageStack()
        return {
          content: pageStack.map(page => ({
            type: 'text',
            text: `页面路径: ${page.path}, 页面参数: ${JSON.stringify(page?.query)}`,
          })),
        }
      })
  }

  navigateTo() {
    this.server.registerTool(
      'navigateTo',
      {
        title: 'navigateTo',
        description: '保留当前页面，跳转到应用内的某个页面，同 wx.navigateTo',
        inputSchema: {
          url: z.string().describe('需要跳转的应用内非 tabBar 的页面的路径'),
        },
      },
      async (message) => {
        const page = await this.miniProgram.navigateTo(message.url)
        return {
          content: [{
            type: 'text',
            text: `导航成功，当前页面路径为 ${page?.path}, 页面参数为 ${JSON.stringify(page?.query)}`,
          }],
        }
      })
  }

  redirectTo() {
    this.server.registerTool(
      'redirectTo',
      {
        title: 'redirectTo',
        description: '关闭当前页面，跳转到应用内的某个页面，同 wx.redirectTo',
        inputSchema: {
          url: z.string().describe('需要跳转的应用内非 tabBar 的页面的路径'),
        },
      },
      async (message) => {
        const page = await this.miniProgram.redirectTo(message.url)
        return {
          content: [{
            type: 'text',
            text: `重定向成功，当前页面路径为 ${page?.path}, 页面参数为 ${JSON.stringify(page?.query)}`,
          }],
        }
      })
  }

  navigateBack() {
    this.server.registerTool(
      'navigateBack',
      {
        title: 'navigateBack',
        description: '关闭当前页面，返回上一页面或多级页面，同 wx.navigateBack',
        inputSchema: {
          delta: z.number().optional().describe('返回的页面数，如果 delta 大于现有页面数，则返回到首页'),
        },
      },
      async (_message) => {
        const page = await this.miniProgram.navigateBack()
        return {
          content: [{
            type: 'text',
            text: `返回成功，当前页面路径为 ${page?.path}, 页面参数为 ${JSON.stringify(page?.query)}`,
          }],
        }
      })
  }

  reLaunch() {
    this.server.registerTool(
      'reLaunch',
      {
        title: 'reLaunch',
        description: '关闭所有页面，打开到应用内的某个页面，同 wx.reLaunch',
        inputSchema: {
          url: z.string().describe('需要跳转的应用内页面的路径'),
        },
      },
      async (message) => {
        const page = await this.miniProgram.reLaunch(message.url)
        return {
          content: [{
            type: 'text',
            text: `重新启动成功，当前页面路径为 ${page?.path}, 页面参数为 ${JSON.stringify(page?.query)}`,
          }],
        }
      })
  }

  switchTab() {
    this.server.registerTool(
      'switchTab',
      {
        title: 'switchTab',
        description: '跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面，同 wx.switchTab',
        inputSchema: {
          url: z.string().describe('需要跳转的 tabBar 页面的路径'),
        },
      },
      async (message) => {
        const page = await this.miniProgram.switchTab(message.url)
        return {
          content: [{
            type: 'text',
            text: `切换 Tab 成功，当前页面路径为 ${page?.path}, 页面参数为 ${JSON.stringify(page?.query)}`,
          }],
        }
      })
  }

  currentPage() {
    this.server.registerTool(
      'currentPage',
      {
        title: 'currentPage',
        description: '获取当前页面',
      },
      async () => {
        const page = await this.miniProgram.currentPage()
        if (!page) {
          return {
            content: [{
              type: 'text',
              text: '当前没有页面',
            }],
          }
        }
        return {
          content: [{
            type: 'text',
            text: `当前页面路径: ${page.path}, 页面参数: ${JSON.stringify(page.query)}`,
          }],
        }
      })
  }

  systemInfo() {
    this.server.registerTool(
      'systemInfo',
      {
        title: 'systemInfo',
        description: '获取系统信息，同 wx.getSystemInfo',
      },
      async () => {
        const systemInfo = await this.miniProgram.systemInfo()
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(systemInfo, null, 2),
          }],
        }
      })
  }

  callWxMethod() {
    this.server.registerTool(
      'callWxMethod',
      {
        title: 'callWxMethod',
        description: '调用 wx 对象上的指定方法',
        inputSchema: {
          method: z.string().describe('需要调用的方法名'),
          args: z.array(z.any()).optional().describe('方法参数'),
        },
      },
      async (message) => {
        const result = await this.miniProgram.callWxMethod(message.method, ...(message.args || []))
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(result, null, 2),
          }],
        }
      })
  }

  mockWxMethod() {
    this.server.registerTool(
      'mockWxMethod',
      {
        title: 'mockWxMethod',
        description: '覆盖 wx 对象上指定方法的调用结果',
        inputSchema: {
          method: z.string().describe('需要覆盖的方法名'),
          result: z.any().describe('指定调用结果'),
        },
      },
      async (message) => {
        await this.miniProgram.mockWxMethod(message.method, message.result)
        return {
          content: [{
            type: 'text',
            text: `方法 ${message.method} 的调用结果已被覆盖`,
          }],
        }
      })
  }

  restoreWxMethod() {
    this.server.registerTool(
      'restoreWxMethod',
      {
        title: 'restoreWxMethod',
        description: '重置 wx 指定方法，消除 mockWxMethod 调用的影响',
        inputSchema: {
          method: z.string().describe('需要覆盖的方法名'),
        },
      },
      async (message) => {
        await this.miniProgram.restoreWxMethod(message.method)
        return {
          content: [{
            type: 'text',
            text: `方法 ${message.method} 已重置`,
          }],
        }
      })
  }

  evaluate() {
    this.server.registerTool(
      'evaluate',
      {
        title: 'evaluate',
        description: '往 AppService 注入代码片段并返回执行结果',
        inputSchema: {
          appFunction: z.string().describe('代码片段'),
          args: z.array(z.any()).optional().describe('执行时传入参数'),
        },
      },
      async (message) => {
        const result = await this.miniProgram.evaluate(message.appFunction, ...(message.args || []))
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(result, null, 2),
          }],
        }
      })
  }

  pageScrollTo() {
    this.server.registerTool(
      'pageScrollTo',
      {
        title: 'pageScrollTo',
        description: '将页面滚动到目标位置，同 wx.pageScrollTo',
        inputSchema: {
          scrollTop: z.number().describe('滚动到页面的目标位置，单位 px'),
        },
      },
      async (message) => {
        await this.miniProgram.pageScrollTo(message.scrollTop)
        return {
          content: [{
            type: 'text',
            text: `页面已滚动到 ${message.scrollTop}px`,
          }],
        }
      })
  }

  screenshot() {
    this.server.registerTool(
      'screenshot',
      {
        title: 'screenshot',
        description: '对当前页面截图，目前只有开发者工具模拟器支持',
        inputSchema: {
          path: z.string().optional().describe('图片保存路径'),
        },
      },
      async (message) => {
        if (message?.path) {
          await this.miniProgram.screenshot({ path: message.path })
          return {
            content: [{
              type: 'text',
              text: `截图已保存到 ${message.path}`,
            }],
          }
        }
        else {
          const result = await this.miniProgram.screenshot()
          return {
            content: [{
              type: 'text',
              text: `截图 Base64 数据: ${result}`,
            }],
          }
        }
      })
  }

  exposeFunction() {
    this.server.registerTool(
      'exposeFunction',
      {
        title: 'exposeFunction',
        description: '在 AppService 全局暴露方法，供小程序侧调用测试脚本中的方法',
        inputSchema: {
          name: z.string().describe('全局方法名'),
          bindingFunction: z.any().describe('脚本方法'),
        },
      },
      async (message) => {
        await this.miniProgram.exposeFunction(message.name, message.bindingFunction)
        return {
          content: [{
            type: 'text',
            text: `全局方法 ${message.name} 已暴露`,
          }],
        }
      })
  }

  testAccounts() {
    this.server.registerTool(
      'testAccounts',
      {
        title: 'testAccounts',
        description: '获取多账号调试中已添加的用户列表',
      },
      async () => {
        const accounts = await this.miniProgram.testAccounts() as Array<{ nickName: string, openid: string }>
        return {
          content: accounts.map(account => ({
            type: 'text',
            text: `用户昵称: ${account.nickName}, OpenID: ${account.openid}`,
          })),
        }
      })
  }

  stopAudits() {
    this.server.registerTool(
      'stopAudits',
      {
        title: 'stopAudits',
        description: '停止体验评分并获取报告',
        inputSchema: {
          path: z.string().optional().describe('报告保存路径'),
        },
      },
      async (message) => {
        const result = await this.miniProgram.stopAudits(message?.path ? { path: message.path } : undefined)
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(result, null, 2),
          }],
        }
      })
  }

  getTicket() {
    this.server.registerTool(
      'getTicket',
      {
        title: 'getTicket',
        description: '获取开发者工具当前的登录凭证',
      },
      async () => {
        const ticket = await this.miniProgram.getTicket()
        return {
          content: [{
            type: 'text',
            text: `登录凭证: ${ticket}`,
          }],
        }
      })
  }
}
