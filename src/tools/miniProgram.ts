import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import automator from 'miniprogram-automator'
import z from 'zod'

export class MiniProgramTool {
  constructor(private server: McpServer, private port: number) {}

  private async _getMiniProgram() {
    const miniProgram = await automator.connect({
      wsEndpoint: `ws://localhost:${this.port}`,
    })
    if (!miniProgram) {
      throw new Error('请先使用 launch 工具启动并连接开发者工具，才能进行后续操作')
    }
    return miniProgram
  }

  pageStack() {
    this.server.registerTool(
      'pageStack',
      {
        title: '获取页面栈',
        description: '获取小程序当前页面栈列表，包含所有已打开的页面路径和参数。可用于了解用户浏览历史或进行页面流程验证。',
      },
      async () => {
        const miniProgram = await this._getMiniProgram()
        const pageStack = await miniProgram.pageStack()
        return {
          content: pageStack.map(page => ({
            type: 'text',
            text: `页面路径: ${page.path}, 页面参数: ${JSON.stringify(page?.query)}`,
          })),
        }
      },
    )
  }

  navigateTo() {
    this.server.registerTool(
      'navigateTo',
      {
        title: '保留当前页面跳转',
        description: '保留当前页面，跳转到小程序内的非 tabBar 页面。用户可点击左上角返回按钮返回原页面。类似于微信小程序 wx.navigateTo API。',
        inputSchema: {
          url: z.string().describe('目标页面的路径，如 /pages/index/index'),
        },
      },
      async (message) => {
        const miniProgram = await this._getMiniProgram()
        const page = await miniProgram.navigateTo(message.url)
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
        title: '关闭当前页面跳转',
        description: '关闭当前页面，跳转到小程序内的非 tabBar 页面。与 navigateTo 的区别是不会保留当前页面，用户无法返回。类似于微信小程序 wx.redirectTo API。',
        inputSchema: {
          url: z.string().describe('目标页面的路径，如 /pages/detail/detail'),
        },
      },
      async (message) => {
        const miniProgram = await this._getMiniProgram()
        const page = await miniProgram.redirectTo(message.url)
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
        title: '返回上一页',
        description: '关闭当前页面，返回上一页面或多级页面。类似于微信小程序 wx.navigateBack API。常用于页面流转测试和业务流程验证。',
        inputSchema: {
          delta: z.number().optional().describe('返回的页面数，默认为 1。如果 delta 大于页面栈深度，则返回到首页'),
        },
      },
      async (_message) => {
        const miniProgram = await this._getMiniProgram()
        const page = await miniProgram.navigateBack()
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
        title: '重新加载页面',
        description: '关闭所有页面，重新打开小程序内的某个页面。常用于清理页面栈并跳转到指定页面的场景，如登录后跳转到首页。类似于微信小程序 wx.reLaunch API。',
        inputSchema: {
          url: z.string().describe('目标页面的路径，如 /pages/index/index'),
        },
      },
      async (message) => {
        const miniProgram = await this._getMiniProgram()
        const page = await miniProgram.reLaunch(message.url)
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
        title: '切换 TabBar 页面',
        description: '跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面。只能用于跳转到 tabBar 配置的页面。类似于微信小程序 wx.switchTab API。',
        inputSchema: {
          url: z.string().describe('目标 tabBar 页面的路径，如 /pages/index/index'),
        },
      },
      async (message) => {
        const miniProgram = await this._getMiniProgram()
        const page = await miniProgram.switchTab(message.url)
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
        title: '获取当前页面',
        description: '获取小程序当前显示的页面信息，包括页面路径和页面参数。可用于确认当前所在页面或验证页面跳转结果。',
      },
      async () => {
        const miniProgram = await this._getMiniProgram()
        const page = await miniProgram.currentPage()
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
        title: '获取系统信息',
        description: '获取小程序运行所在的系统信息，包括手机品牌、型号、屏幕尺寸、操作系统版本、微信版本等。可用于兼容性测试和设备适配验证。',
      },
      async () => {
        const miniProgram = await this._getMiniProgram()
        const systemInfo = await miniProgram.systemInfo()
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
        title: '调用微信 API',
        description: '调用微信小程序全局 wx 对象上的指定方法，如 wx.login、wx.getUserInfo、wx.request 等。用于模拟小程序调用微信原生 API 的场景。',
        inputSchema: {
          method: z.string().describe('要调用的 wx 方法名，如 login、getUserInfo'),
          args: z.array(z.any()).optional().describe('方法参数，按顺序传入'),
        },
      },
      async (message) => {
        const miniProgram = await this._getMiniProgram()
        const result = await miniProgram.callWxMethod(message.method, ...(message.args || []))
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
        title: 'Mock 微信 API',
        description: 'Mock（模拟）微信小程序 wx 对象上的指定方法的返回值。常用于测试场景，模拟接口返回或模拟用户登录状态等。',
        inputSchema: {
          method: z.string().describe('要 Mock 的 wx 方法名，如 login'),
          result: z.any().describe('Mock 的返回值，会被直接返回给调用方'),
        },
      },
      async (message) => {
        const miniProgram = await this._getMiniProgram()
        await miniProgram.mockWxMethod(message.method, message.result)
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
        title: '恢复微信 API',
        description: '恢复被 Mock 的微信小程序 wx 对象方法的原始实现，移除 mockWxMethod 设置的拦截。用于测试完成后还原小程序状态。',
        inputSchema: {
          method: z.string().describe('要恢复的 wx 方法名，如 login'),
        },
      },
      async (message) => {
        const miniProgram = await this._getMiniProgram()
        await miniProgram.restoreWxMethod(message.method)
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
        title: '执行自定义代码',
        description: '往小程序的 AppService（逻辑层）注入并执行自定义 JavaScript 代码，返回执行结果。可用于动态修改页面数据、调用页面方法或进行复杂业务逻辑验证。',
        inputSchema: {
          appFunction: z.string().describe('要执行的 JavaScript 代码，如 () => getApp().globalData'),
          args: z.array(z.any()).optional().describe('执行时传入的参数'),
        },
      },
      async (message) => {
        const miniProgram = await this._getMiniProgram()
        const result = await miniProgram.evaluate(message.appFunction, ...(message.args || []))
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
        title: '页面滚动到指定位置',
        description: '将页面滚动到指定位置。类似于微信小程序 wx.pageScrollTo API。常用于测试长页面滚动、懒加载等场景。',
        inputSchema: {
          scrollTop: z.number().describe('滚动到页面的目标位置，单位为 px'),
        },
      },
      async (message) => {
        const miniProgram = await this._getMiniProgram()
        await miniProgram.pageScrollTo(message.scrollTop)
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
        title: '页面截图',
        description: '对小程序当前页面进行截图。返回 Base64 编码的图片数据。仅在微信开发者工具模拟器中支持。用于生成测试报告或视觉验证。',
      },
      async () => {
        const miniProgram = await this._getMiniProgram()
        const result = await miniProgram.screenshot()
        return {
          content: [{
            type: 'image',
            data: result!,
            mimeType: 'image/png',
          }],
        }
      },
    )
  }

  exposeFunction() {
    this.server.registerTool(
      'exposeFunction',
      {
        title: '暴露全局方法到小程序',
        description: '在小程序 AppService 全局作用域暴露一个方法，供小程序页面通过 wx.cloud 或其他方式调用。常用于实现自动化脚本与小程序的双向通信。',
        inputSchema: {
          name: z.string().describe('暴露的方法名'),
          bindingFunction: z.any().describe('要暴露的方法实现'),
        },
      },
      async (message) => {
        const miniProgram = await this._getMiniProgram()
        await miniProgram.exposeFunction(message.name, message.bindingFunction)
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
        title: '获取测试账号列表',
        description: '获取微信开发者工具多账号调试中添加的测试用户列表。可用于模拟不同用户登录场景的测试。',
      },
      async () => {
        const miniProgram = await this._getMiniProgram()
        const accounts = await miniProgram.testAccounts() as Array<{ nickName: string, openid: string }>
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
        title: '停止体验评分',
        description: '停止正在运行的微信小程序体验评分（Audits）并获取评估报告。报告包含性能最佳实践、Accessibility 可访问性等方面的评分和建议。',
        inputSchema: {
          path: z.string().optional().describe('评估报告保存路径，如 ./audits.json'),
        },
      },
      async (message) => {
        const miniProgram = await this._getMiniProgram()
        const result = await miniProgram.stopAudits(message?.path ? { path: message.path } : undefined)
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
        title: '获取登录凭证',
        description: '获取微信开发者工具当前的登录凭证（ticket）。该凭证可用于调用微信开放能力 API，如云开发、登录等接口的身份验证。',
      },
      async () => {
        const miniProgram = await this._getMiniProgram()
        const ticket = await miniProgram.getTicket()
        return {
          content: [{
            type: 'text',
            text: `登录凭证: ${ticket}`,
          }],
        }
      })
  }
}
