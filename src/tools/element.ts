import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type Element from 'miniprogram-automator/out/Element'
import type { ContextElement, CustomElement, InputElement, MovableViewElement, ScrollViewElement, SwiperElement } from 'miniprogram-automator/out/Element'
import type MiniProgram from 'miniprogram-automator/out/MiniProgram'
import z from 'zod'

export class ElementTool {
  constructor(private miniProgram: MiniProgram, private server: McpServer) {}

  private async _getElement(selector: string): Promise<Element> {
    const page = await this.miniProgram.currentPage()
    if (!page) {
      throw new Error('当前没有打开的页面')
    }

    const selectors = selector.trim().split(/\s+/)
    let current: any = page

    for (const sel of selectors) {
      current = await current.$(sel)
      if (!current) {
        throw new Error(`未找到元素: ${sel}`)
      }
    }

    return current
  }

  getElementChild() {
    this.server.registerTool(
      'getElementChild',
      {
        title: 'getElementChild',
        description: '获取指定元素的子元素',
        inputSchema: {
          selector: z.string().describe('元素选择器'),
        },
      },
      async ({ selector }) => {
        const element = await this._getElement(selector)
        return {
          content: [{
            type: 'text',
            text: `子元素标签名: ${element.tagName}`,
          }],
        }
      },
    )
  }

  getElementSize() {
    this.server.registerTool(
      'getElementSize',
      {
        title: 'getElementSize',
        description: '获取指定元素的大小',
        inputSchema: {
          selector: z.string().describe('元素选择器'),
        },
      },
      async ({ selector }) => {
        const element = await this._getElement(selector)
        const { width, height } = await element.size()
        return {
          content: [{
            type: 'text',
            text: `元素宽度: ${width}px, 元素高度: ${height}px`,
          }],
        }
      },
    )
  }

  getElementOffset() {
    this.server.registerTool(
      'getElementOffset',
      {
        title: 'getElementOffset',
        description: '获取元素绝对位置',
        inputSchema: {
          selector: z.string().describe('元素选择器'),
        },
      },
      async ({ selector }) => {
        const element = await this._getElement(selector)
        const { left, top } = await element.offset()
        return {
          content: [{
            type: 'text',
            text: `元素位置 - left: ${left}px, top: ${top}px`,
          }],
        }
      },
    )
  }

  getElementText() {
    this.server.registerTool(
      'getElementText',
      {
        title: 'getElementText',
        description: '获取元素文本',
        inputSchema: {
          selector: z.string().describe('元素选择器'),
        },
      },
      async ({ selector }) => {
        const element = await this._getElement(selector)
        const text = await element.text()
        return {
          content: [{
            type: 'text',
            text: `元素文本: ${text}`,
          }],
        }
      },
    )
  }

  getElementAttribute() {
    this.server.registerTool(
      'getElementAttribute',
      {
        title: 'getElementAttribute',
        description: '获取元素特性（标签上的值）',
        inputSchema: {
          selector: z.string().describe('元素选择器'),
          name: z.string().describe('特性名'),
        },
      },
      async ({ selector, name }) => {
        const element = await this._getElement(selector)
        const value = await element.attribute(name)
        return {
          content: [{
            type: 'text',
            text: `特性 ${name}: ${value}`,
          }],
        }
      },
    )
  }

  getElementProperty() {
    this.server.registerTool(
      'getElementProperty',
      {
        title: 'getElementProperty',
        description: '获取元素属性（如 input 的 value 值）',
        inputSchema: {
          selector: z.string().describe('元素选择器'),
          name: z.string().describe('属性名'),
        },
      },
      async ({ selector, name }) => {
        const element = await this._getElement(selector)
        const value = await element.property(name)
        return {
          content: [{
            type: 'text',
            text: `属性 ${name}: ${JSON.stringify(value)}`,
          }],
        }
      },
    )
  }

  getElementWxml() {
    this.server.registerTool(
      'getElementWxml',
      {
        title: 'getElementWxml',
        description: '获取元素 WXML（不含元素本身）',
        inputSchema: {
          selector: z.string().describe('元素选择器'),
        },
      },
      async ({ selector }) => {
        const element = await this._getElement(selector)
        const wxml = await element.wxml()
        return {
          content: [{
            type: 'text',
            text: `元素 WXML:\n${wxml}`,
          }],
        }
      },
    )
  }

  getElementOuterWxml() {
    this.server.registerTool(
      'getElementOuterWxml',
      {
        title: 'getElementOuterWxml',
        description: '获取元素 WXML（包含元素本身）',
        inputSchema: {
          selector: z.string().describe('元素选择器'),
        },
      },
      async ({ selector }) => {
        const element = await this._getElement(selector)
        const wxml = await element.outerWxml()
        return {
          content: [{
            type: 'text',
            text: `元素完整 WXML:\n${wxml}`,
          }],
        }
      },
    )
  }

  getElementValue() {
    this.server.registerTool(
      'getElementValue',
      {
        title: 'getElementValue',
        description: '获取元素值',
        inputSchema: {
          selector: z.string().describe('元素选择器'),
        },
      },
      async ({ selector }) => {
        const element = await this._getElement(selector)
        const value = await element.value()
        return {
          content: [{
            type: 'text',
            text: `元素值: ${value}`,
          }],
        }
      },
    )
  }

  getElementStyle() {
    this.server.registerTool(
      'getElementStyle',
      {
        title: 'getElementStyle',
        description: '获取元素样式值',
        inputSchema: {
          selector: z.string().describe('元素选择器'),
          name: z.string().describe('样式名'),
        },
      },
      async ({ selector, name }) => {
        const element = await this._getElement(selector)
        const value = await element.style(name)
        return {
          content: [{
            type: 'text',
            text: `样式 ${name}: ${value}`,
          }],
        }
      },
    )
  }

  tapElement() {
    this.server.registerTool(
      'tapElement',
      {
        title: 'tapElement',
        description: '点击元素',
        inputSchema: {
          selector: z.string().describe('元素选择器'),
        },
      },
      async ({ selector }) => {
        const element = await this._getElement(selector)
        await element.tap()
        return {
          content: [{
            type: 'text',
            text: '点击元素成功',
          }],
        }
      },
    )
  }

  longpressElement() {
    this.server.registerTool(
      'longpressElement',
      {
        title: 'longpressElement',
        description: '长按元素',
        inputSchema: {
          selector: z.string().describe('元素选择器'),
        },
      },
      async ({ selector }) => {
        const element = await this._getElement(selector)
        await element.longpress()
        return {
          content: [{
            type: 'text',
            text: '长按元素成功',
          }],
        }
      },
    )
  }

  touchstartElement() {
    this.server.registerTool(
      'touchstartElement',
      {
        title: 'touchstartElement',
        description: '手指开始触摸元素',
        inputSchema: {
          selector: z.string().describe('元素选择器'),
          touches: z.array(z.object({
            identifier: z.number().describe('触摸点标识符'),
            pageX: z.number().describe('触摸点在页面中的 X 坐标'),
            pageY: z.number().describe('触摸点在页面中的 Y 坐标'),
            clientX: z.number().describe('触摸点在客户端中的 X 坐标'),
            clientY: z.number().describe('触摸点在客户端中的 Y 坐标'),
          })).describe('触摸点信息数组'),
          changeTouches: z.array(z.object({
            identifier: z.number().describe('变化的触摸点标识符'),
            pageX: z.number().describe('变化的触摸点在页面中的 X 坐标'),
            pageY: z.number().describe('变化的触摸点在页面中的 Y 坐标'),
            clientX: z.number().describe('变化的触摸点在客户端中的 X 坐标'),
            clientY: z.number().describe('变化的触摸点在客户端中的 Y 坐标'),
          })).describe('变化的触摸点信息数组'),
        },
      },
      async ({ selector, touches, changeTouches }) => {
        const element = await this._getElement(selector)
        await element.touchstart({ touches, changeTouches })
        return {
          content: [{
            type: 'text',
            text: 'touchstart 触发成功',
          }],
        }
      },
    )
  }

  touchmoveElement() {
    this.server.registerTool(
      'touchmoveElement',
      {
        title: 'touchmoveElement',
        description: '手指触摸元素后移动',
        inputSchema: {
          selector: z.string().describe('元素选择器'),
          touches: z.array(z.object({
            identifier: z.number(),
            pageX: z.number(),
            pageY: z.number(),
            clientX: z.number(),
            clientY: z.number(),
          })).describe('触摸点信息数组'),
          changeTouches: z.array(z.object({
            identifier: z.number(),
            pageX: z.number(),
            pageY: z.number(),
            clientX: z.number(),
            clientY: z.number(),
          })).describe('变化的触摸点信息数组'),
        },
      },
      async ({ selector, touches, changeTouches }) => {
        const element = await this._getElement(selector)
        await element.touchmove({ touches, changeTouches })
        return {
          content: [{
            type: 'text',
            text: 'touchmove 触发成功',
          }],
        }
      },
    )
  }

  touchendElement() {
    this.server.registerTool(
      'touchendElement',
      {
        title: 'touchendElement',
        description: '手指结束触摸元素',
        inputSchema: {
          selector: z.string().describe('元素选择器'),
          touches: z.array(z.object({
            identifier: z.number(),
            pageX: z.number(),
            pageY: z.number(),
            clientX: z.number(),
            clientY: z.number(),
          })).describe('触摸点信息数组'),
          changeTouches: z.array(z.object({
            identifier: z.number(),
            pageX: z.number(),
            pageY: z.number(),
            clientX: z.number(),
            clientY: z.number(),
          })).describe('变化的触摸点信息数组'),
        },
      },
      async ({ selector, touches, changeTouches }) => {
        const element = await this._getElement(selector)
        await element.touchend({ touches, changeTouches })
        return {
          content: [{
            type: 'text',
            text: 'touchend 触发成功',
          }],
        }
      },
    )
  }

  triggerElement() {
    this.server.registerTool(
      'triggerElement',
      {
        title: 'triggerElement',
        description: '触发元素事件（无法触发 tap、longpress 等用户操作事件）',
        inputSchema: {
          selector: z.string().describe('元素选择器'),
          type: z.string().describe('触发事件类型'),
          detail: z.record(z.string(), z.any()).optional().describe('触发事件时传递的 detail 值'),
        },
      },
      async ({ selector, type, detail }) => {
        const element = await this._getElement(selector)
        await element.trigger(type, detail)
        return {
          content: [{
            type: 'text',
            text: `事件 ${type} 触发成功`,
          }],
        }
      },
    )
  }

  inputElement() {
    this.server.registerTool(
      'inputElement',
      {
        title: 'inputElement',
        description: '输入文本（仅 input、textarea 组件可用）',
        inputSchema: {
          selector: z.string().describe('元素选择器'),
          value: z.string().describe('需要输入的文本'),
        },
      },
      async ({ selector, value }) => {
        const element = (await this._getElement(selector)) as InputElement
        if (element.tagName !== 'input' && element.tagName !== 'textarea') {
          return {
            content: [{
              type: 'text',
              text: `${element.tagName} 不是输入元素(input、textarea), 无法输入文本`,
            }],
          }
        }
        await element.input(value)
        return {
          content: [{
            type: 'text',
            text: `输入成功: ${value}`,
          }],
        }
      },
    )
  }

  callElementMethod() {
    this.server.registerTool(
      'callElementMethod',
      {
        title: 'callElementMethod',
        description: '调用组件实例指定方法（仅自定义组件可用）',
        inputSchema: {
          selector: z.string().describe('元素选择器'),
          method: z.string().describe('需要调用的方法名'),
          args: z.array(z.any()).optional().describe('方法参数'),
        },
      },
      async ({ selector, method, args }) => {
        const element = (await this._getElement(selector)) as CustomElement
        if (element.callMethod === undefined) {
          return {
            content: [{
              type: 'text',
              text: `${element.tagName} 不是自定义组件, 无法调用方法`,
            }],
          }
        }
        const result = await element.callMethod(method, ...(args || []))
        return {
          content: [{
            type: 'text',
            text: `方法 ${method} 调用结果: ${JSON.stringify(result)}`,
          }],
        }
      },
    )
  }

  getElementData() {
    this.server.registerTool(
      'getElementData',
      {
        title: 'getElementData',
        description: '获取组件实例渲染数据（仅自定义组件可用）',
        inputSchema: {
          selector: z.string().describe('元素选择器'),
          path: z.string().optional().describe('数据路径'),
        },
      },
      async ({ selector, path }) => {
        const element = (await this._getElement(selector)) as CustomElement
        if (element.data === undefined) {
          return {
            content: [{
              type: 'text',
              text: `${element.tagName} 不是自定义组件, 无法获取数据`,
            }],
          }
        }
        const data = await element.data(path)
        return {
          content: [{
            type: 'text',
            text: `组件数据: ${JSON.stringify(data, null, 2)}`,
          }],
        }
      },
    )
  }

  setElementData() {
    this.server.registerTool(
      'setElementData',
      {
        title: 'setElementData',
        description: '设置组件实例渲染数据（仅自定义组件可用）',
        inputSchema: {
          selector: z.string().describe('元素选择器'),
          data: z.record(z.string(), z.any()).describe('要改变的数据'),
        },
      },
      async ({ selector, data }) => {
        const element = (await this._getElement(selector)) as CustomElement
        if (element.setData === undefined) {
          return {
            content: [{
              type: 'text',
              text: `${element.tagName} 不是自定义组件, 无法设置数据`,
            }],
          }
        }
        await element.setData(data)
        return {
          content: [{
            type: 'text',
            text: '设置组件数据成功',
          }],
        }
      },
    )
  }

  callContextMethod() {
    this.server.registerTool(
      'callContextMethod',
      {
        title: 'callContextMethod',
        description: '调用上下文 Context 对象方法（仅 video 组件可用）',
        inputSchema: {
          selector: z.string().describe('元素选择器'),
          method: z.string().describe('需要调用的方法名'),
          args: z.array(z.any()).optional().describe('方法参数'),
        },
      },
      async ({ selector, method, args }) => {
        const element = (await this._getElement(selector)) as ContextElement
        if (element.tagName !== 'video') {
          return {
            content: [{
              type: 'text',
              text: `${element.tagName} 不是 video 组件, 无法调用 Context 方法`,
            }],
          }
        }
        const result = await element.callContextMethod(method, ...(args || []))
        return {
          content: [{
            type: 'text',
            text: `Context 方法 ${method} 调用结果: ${JSON.stringify(result)}`,
          }],
        }
      },
    )
  }

  getScrollWidth() {
    this.server.registerTool(
      'getScrollWidth',
      {
        title: 'getScrollWidth',
        description: '获取滚动宽度（仅 scroll-view 组件可用）',
        inputSchema: {
          selector: z.string().describe('元素选择器'),
        },
      },
      async ({ selector }) => {
        const element = (await this._getElement(selector)) as ScrollViewElement
        if (element.tagName !== 'scroll-view') {
          return {
            content: [{
              type: 'text',
              text: `${element.tagName} 不是 scroll-view 组件, 无法获取滚动宽度`,
            }],
          }
        }
        const width = await element.scrollWidth()
        return {
          content: [{
            type: 'text',
            text: `滚动宽度: ${width}px`,
          }],
        }
      },
    )
  }

  getScrollHeight() {
    this.server.registerTool(
      'getScrollHeight',
      {
        title: 'getScrollHeight',
        description: '获取滚动高度（仅 scroll-view 组件可用）',
        inputSchema: {
          selector: z.string().describe('元素选择器'),
        },
      },
      async ({ selector }) => {
        const element = (await this._getElement(selector)) as ScrollViewElement
        if (element.tagName !== 'scroll-view') {
          return {
            content: [{
              type: 'text',
              text: `${element.tagName} 不是 scroll-view 组件, 无法获取滚动高度`,
            }],
          }
        }
        const height = await element.scrollHeight()
        return {
          content: [{
            type: 'text',
            text: `滚动高度: ${height}px`,
          }],
        }
      },
    )
  }

  scrollTo() {
    this.server.registerTool(
      'scrollTo',
      {
        title: 'scrollTo',
        description: '滚动到指定位置（仅 scroll-view 组件可用）',
        inputSchema: {
          selector: z.string().describe('元素选择器'),
          x: z.number().describe('横向滚动位置'),
          y: z.number().describe('纵向滚动位置'),
        },
      },
      async ({ selector, x, y }) => {
        const element = (await this._getElement(selector)) as ScrollViewElement
        if (element.tagName !== 'scroll-view') {
          return {
            content: [{
              type: 'text',
              text: `${element.tagName} 不是 scroll-view 组件, 无法滚动`,
            }],
          }
        }
        await element.scrollTo(x, y)
        return {
          content: [{
            type: 'text',
            text: `滚动到位置 (${x}, ${y}) 成功`,
          }],
        }
      },
    )
  }

  swipeTo() {
    this.server.registerTool(
      'swipeTo',
      {
        title: 'swipeTo',
        description: '滑动到指定滑块（仅 swiper 组件可用）',
        inputSchema: {
          selector: z.string().describe('元素选择器'),
          index: z.number().describe('目标滑块的 index'),
        },
      },
      async ({ selector, index }) => {
        const element = (await this._getElement(selector)) as SwiperElement
        if (element.tagName !== 'swiper') {
          return {
            content: [{
              type: 'text',
              text: `${element.tagName} 不是 swiper 组件, 无法滑动`,
            }],
          }
        }
        await element.swipeTo(index)
        return {
          content: [{
            type: 'text',
            text: `滑动到第 ${index} 个滑块成功`,
          }],
        }
      },
    )
  }

  moveTo() {
    this.server.registerTool(
      'moveTo',
      {
        title: 'moveTo',
        description: '移动视图容器（仅 movable-view 组件可用）',
        inputSchema: {
          selector: z.string().describe('元素选择器'),
          x: z.number().describe('x 坐标'),
          y: z.number().describe('y 坐标'),
        },
      },
      async ({ selector, x, y }) => {
        const element = (await this._getElement(selector)) as MovableViewElement
        if (element.tagName !== 'movable-view') {
          return {
            content: [{
              type: 'text',
              text: `${element.tagName} 不是 movable-view 组件, 无法移动`,
            }],
          }
        }
        await element.moveTo(x, y)
        return {
          content: [{
            type: 'text',
            text: `移动到位置 (${x}, ${y}) 成功`,
          }],
        }
      },
    )
  }
}
