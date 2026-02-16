import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type Element from 'miniprogram-automator/out/Element'
import type MiniProgram from 'miniprogram-automator/out/MiniProgram'
import z from 'zod'

export class PageTool {
  constructor(private miniProgram: MiniProgram, private server: McpServer) {}

  private async _getCurrentPage() {
    const page = await this.miniProgram.currentPage()
    if (!page) {
      throw new Error('当前没有打开的页面')
    }
    return page
  }

  getElement() {
    this.server.registerTool(
      'getElement',
      {
        title: 'getElement',
        description: '获取小程序页面元素',
        inputSchema: {
          selector: z.string().describe('元素选择器'),
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
        title: 'getElements',
        description: '获取小程序页面元素数组',
        inputSchema: {
          selector: z.string().describe('元素选择器'),
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
        title: 'waitFor',
        description: '等待直到指定条件成立',
        inputSchema: {
          condition: z.any().describe('等待条件'),
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
        title: 'getPageData',
        description: '获取页面渲染数据',
        inputSchema: {
          path: z.string().optional().describe('数据路径'),
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
        title: 'setPageData',
        description: '设置页面渲染数据',
        inputSchema: {
          data: z.record(z.string(), z.any()).describe('要改变的数据对象'),
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
        title: 'getPageSize',
        description: '获取页面大小',
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
        title: 'getScrollTop',
        description: '获取页面滚动位置',
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
        title: 'callPageMethod',
        description: '调用页面指定方法',
        inputSchema: {
          method: z.string().describe('需要调用的方法名'),
          args: z.array(z.any()).optional().describe('方法参数'),
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
