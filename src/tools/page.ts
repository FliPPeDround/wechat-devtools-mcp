import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type Element from 'miniprogram-automator/out/Element'
import automator from 'miniprogram-automator'
import z from 'zod'

export class PageTool {
  constructor(private server: McpServer, private port: number) {}

  private async _getCurrentPage() {
    const miniProgram = await automator.connect({
      wsEndpoint: `ws://localhost:${this.port}`,
    })
    if (!miniProgram) {
      throw new Error('请先使用 launch 工具启动并连接开发者工具，才能进行后续操作')
    }
    const page = await miniProgram.currentPage()
    if (!page) {
      throw new Error('当前没有打开的页面')
    }
    return page
  }

  getElement() {
    this.server.registerTool(
      'getElement',
      {
        title: '获取页面元素',
        description: '获取小程序当前页面中匹配指定选择器的第一个元素。可用于获取元素信息、进行元素操作或验证页面渲染结果。',
        inputSchema: {
          selector: z.string().describe('元素选择器，支持 CSS 选择器语法，如 .classname、#id、view'),
        },
      },
      async ({ selector }) => {
        const page = await this._getCurrentPage()
        const element = await page.$(selector)
        return {
          content: [{
            type: 'text',
            text: `元素标签名: ${element?.tagName}`,
          }],
        }
      })
  }

  getElements() {
    this.server.registerTool(
      'getElements',
      {
        title: '获取页面元素列表',
        description: '获取小程序当前页面中匹配指定选择器的所有元素，返回元素数组。常用于获取列表项、批量操作元素或验证页面中同类元素的数量。',
        inputSchema: {
          selector: z.string().describe('元素选择器，支持 CSS 选择器语法，如 .list-item、view'),
        },
      },
      async ({ selector }) => {
        const page = await this._getCurrentPage()
        const elements: Element[] = await page.$$(selector)
        return {
          content: elements.map(element => ({
            type: 'text',
            text: `元素标签名: ${element?.tagName}`,
          })),
        }
      })
  }

  waitFor() {
    this.server.registerTool(
      'waitFor',
      {
        title: '等待条件满足',
        description: '等待页面中某个条件成立后再继续执行。条件可以是选择器（等待元素出现）、函数返回值或布尔值。常用于等待异步渲染、动画完成或数据加载。',
        inputSchema: {
          condition: z.any().describe('等待条件，支持选择器字符串或返回布尔值的函数'),
        },
      },
      async ({ condition }) => {
        const page = await this._getCurrentPage()
        await page.waitFor(condition)
        return {
          content: [{
            type: 'text',
            text: '条件已满足',
          }],
        }
      })
  }

  getPageData() {
    this.server.registerTool(
      'getPageData',
      {
        title: '获取页面数据',
        description: '获取当前页面实例的 data 数据，即页面渲染层（View）使用的数据。可用于验证页面状态、检查数据绑定或读取业务数据。',
        inputSchema: {
          path: z.string().optional().describe('数据路径，支持点号访问嵌套属性，如 user.info.name'),
        },
      },
      async ({ path }) => {
        const page = await this._getCurrentPage()
        const data = await page.data(path)
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(data, null, 2),
          }],
        }
      })
  }

  setPageData() {
    this.server.registerTool(
      'setPageData',
      {
        title: '设置页面数据',
        description: '设置当前页面实例的 data 数据，触发页面重新渲染。常用于模拟用户输入、修改页面状态或进行数据驱动测试。',
        inputSchema: {
          data: z.record(z.string(), z.any()).describe('要设置的数据对象，键为 data 中的属性名，值为新的数据'),
        },
      },
      async ({ data }) => {
        const page = await this._getCurrentPage()
        await page.setData(data)
        return {
          content: [{
            type: 'text',
            text: '数据设置成功',
          }],
        }
      })
  }

  getPageSize() {
    this.server.registerTool(
      'getPageSize',
      {
        title: '获取页面尺寸',
        description: '获取当前页面的尺寸信息，包括页面宽度和高度（单位：px）。可用于验证页面布局、计算滚动区域或进行响应式测试。',
        inputSchema: {},
      },
      async () => {
        const page = await this._getCurrentPage()
        const size = await page.size()
        return {
          content: [{
            type: 'text',
            text: `页面宽度: ${size.width}, 页面高度: ${size.height}`,
          }],
        }
      })
  }

  getScrollTop() {
    this.server.registerTool(
      'getScrollTop',
      {
        title: '获取页面滚动位置',
        description: '获取当前页面垂直滚动条的位置（单位：px）。可用于验证页面滚动状态或计算滚动距离。',
        inputSchema: {},
      },
      async () => {
        const page = await this._getCurrentPage()
        const scrollTop = await page.scrollTop()
        return {
          content: [{
            type: 'text',
            text: `滚动位置: ${scrollTop}`,
          }],
        }
      })
  }

  callPageMethod() {
    this.server.registerTool(
      'callPageMethod',
      {
        title: '调用页面方法',
        description: '调用当前页面实例上定义的页面方法（如 onLoad、onShow、自定义方法等）。可用于触发页面生命周期或执行页面业务逻辑。',
        inputSchema: {
          method: z.string().describe('要调用的页面方法名'),
          args: z.array(z.any()).optional().describe('方法参数，按顺序传入'),
        },
      },
      async ({ method, args = [] }) => {
        const page = await this._getCurrentPage()
        const result = await page.callMethod(method, ...args)
        return {
          content: [{
            type: 'text',
            text: `调用结果: ${JSON.stringify(result)}`,
          }],
        }
      })
  }
}
