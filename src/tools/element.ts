import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type Element from 'miniprogram-automator/out/Element'
import type { ContextElement, CustomElement, InputElement, MovableViewElement, ScrollViewElement, SwiperElement } from 'miniprogram-automator/out/Element'
import automator from 'miniprogram-automator'
import z from 'zod'

export class ElementTool {
  constructor(private server: McpServer, private port: number) {}

  private async _getElement(selector: string): Promise<Element> {
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
        title: '获取子元素',
        description: '获取指定元素的第一个子元素。常用于查看容器元素的直接子节点结构。',
        inputSchema: {
          selector: z.string().describe('父元素选择器'),
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
        title: '获取元素尺寸',
        description: '获取指定元素的宽高尺寸（单位：px）。可用于验证 UI 布局、计算元素大小或进行视觉测试。',
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
        title: '获取元素位置',
        description: '获取指定元素相对于页面左上角的绝对位置坐标（单位：px）。可用于验证元素定位、计算布局或进行点击坐标测试。',
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
        title: '获取元素文本',
        description: '获取指定元素的文本内容，即元素innerText的值。可用于验证按钮文字、标签文本或提取展示内容。',
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
        title: '获取元素特性',
        description: '获取指定元素的 HTML 属性值（特性），如 id、class、src、disabled 等。可用于验证元素的属性配置或提取链接地址等。',
        inputSchema: {
          selector: z.string().describe('元素选择器'),
          name: z.string().describe('特性名称，如 id、class、src'),
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
        title: '获取元素属性',
        description: '获取指定元素的 JavaScript 属性值（Property），如 input 元素的 value、checkbox 的 checked 状态等。与 attribute 的区别是 property 是 DOM 对象上的实际值。',
        inputSchema: {
          selector: z.string().describe('元素选择器'),
          name: z.string().describe('属性名称，如 input 用 value，checkbox 用 checked'),
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
        title: '获取元素 WXML',
        description: '获取指定元素的 WXML 结构（不包含元素本身，仅包含子节点）。可用于查看小程序组件的模板结构或调试渲染问题。',
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
        title: '获取完整 WXML',
        description: '获取指定元素的完整 WXML 结构（包含元素本身及其所有子节点）。可用于查看组件完整结构或提取组件代码。',
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
        title: '获取元素值',
        description: '获取表单元素的值，如 input、textarea 的输入内容，或 switch、checkbox 的选中状态。用于验证用户输入或表单状态。',
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
        title: '获取元素样式',
        description: '获取指定元素的 CSS 样式值，如 color、font-size、display 等。可用于验证元素样式是否正确或调试样式问题。',
        inputSchema: {
          selector: z.string().describe('元素选择器'),
          name: z.string().describe('CSS 属性名，如 color、font-size、background'),
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
        title: '点击元素',
        description: '模拟用户点击指定元素。用于自动化测试中模拟用户交互，如点击按钮、链接或其他可点击元素。',
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
        title: '长按元素',
        description: '模拟用户长按指定元素（默认 500ms）。常用于触发上下文菜单、右键操作或长按反馈效果。',
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
        title: '触摸开始',
        description: '模拟手指开始触摸元素。用于模拟复杂触摸交互，如手势识别、拖拽操作等。需要配合 touchmoveElement 和 touchendElement 使用。',
        inputSchema: {
          selector: z.string().describe('元素选择器'),
          touches: z.array(z.object({
            identifier: z.number().describe('触摸点标识符，区分多指触摸'),
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
        title: '触摸移动',
        description: '模拟手指触摸元素后移动（拖拽）。用于模拟用户拖拽滑动、长按后拖动等场景。需要配合 touchstartElement 和 touchendElement 使用。',
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
        title: '触摸结束',
        description: '模拟手指结束触摸元素。用于完成触摸交互序列。需要配合 touchstartElement 和 touchmoveElement 使用。',
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
        title: '触发元素事件',
        description: '触发指定元素的指定事件（如 input、change、focus、blur 等）。无法触发 tap、longpress 等用户操作事件，这些需要用 tapElement 或 longpressElement。',
        inputSchema: {
          selector: z.string().describe('元素选择器'),
          type: z.string().describe('事件类型，如 input、change、focus、blur、tap'),
          detail: z.record(z.string(), z.any()).optional().describe('事件触发的 detail 数据'),
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
        title: '输入文本',
        description: '向 input 或 textarea 元素输入文本内容。用于模拟用户输入、填写表单或测试输入验证逻辑。',
        inputSchema: {
          selector: z.string().describe('输入框元素选择器'),
          value: z.string().describe('要输入的文本内容'),
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
        title: '调用组件方法',
        description: '调用自定义组件实例上定义的方法。仅适用于自定义组件（使用 Component 构造器创建），普通 view、text 等基础组件不支持。',
        inputSchema: {
          selector: z.string().describe('自定义组件元素选择器'),
          method: z.string().describe('要调用的方法名'),
          args: z.array(z.any()).optional().describe('方法参数，按顺序传入'),
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
        title: '获取组件数据',
        description: '获取自定义组件实例的 data 数据（渲染数据）。仅适用于自定义组件，可用于验证组件内部状态或读取组件数据。',
        inputSchema: {
          selector: z.string().describe('自定义组件元素选择器'),
          path: z.string().optional().describe('数据路径，支持点号访问嵌套属性'),
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
        title: '设置组件数据',
        description: '设置自定义组件实例的 data 数据，触发组件重新渲染。仅适用于自定义组件，可用于修改组件内部状态或模拟数据变化。',
        inputSchema: {
          selector: z.string().describe('自定义组件元素选择器'),
          data: z.record(z.string(), z.any()).describe('要设置的数据对象，键为 data 中的属性名'),
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
        title: '调用 Video 上下文方法',
        description: '调用 video 组件的 Context（上下文）对象方法，如 play、pause、seek 等。仅适用于 video 组件，可用于控制视频播放。',
        inputSchema: {
          selector: z.string().describe('video 元素选择器'),
          method: z.string().describe('要调用的方法名，如 play、pause、seek'),
          args: z.array(z.any()).optional().describe('方法参数，按顺序传入'),
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
        title: '获取滚动宽度',
        description: '获取 scroll-view 组件的滚动内容宽度（单位：px）。仅适用于 scroll-view 组件，用于获取可滚动区域的宽度。',
        inputSchema: {
          selector: z.string().describe('scroll-view 元素选择器'),
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
        title: '获取滚动高度',
        description: '获取 scroll-view 组件的滚动内容高度（单位：px）。仅适用于 scroll-view 组件，用于获取可滚动区域的高度。',
        inputSchema: {
          selector: z.string().describe('scroll-view 元素选择器'),
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
        title: '滚动到指定位置',
        description: '将 scroll-view 组件滚动到指定坐标位置。仅适用于 scroll-view 组件，可用于模拟用户滚动或测试滚动行为。',
        inputSchema: {
          selector: z.string().describe('scroll-view 元素选择器'),
          x: z.number().describe('横向滚动位置，单位 px'),
          y: z.number().describe('纵向滚动位置，单位 px'),
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
        title: '切换 Swiper 滑块',
        description: '将 swiper 组件滑动到指定轮播位置（切换轮播图）。仅适用于 swiper 组件，可用于自动切换轮播图或验证轮播功能。',
        inputSchema: {
          selector: z.string().describe('swiper 元素选择器'),
          index: z.number().describe('目标滑块的索引值，从 0 开始'),
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
        title: '移动可移动视图',
        description: '将 movable-view 组件移动到指定坐标位置。仅适用于 movable-view 组件，可用于模拟拖拽移动或测试可移动区域。',
        inputSchema: {
          selector: z.string().describe('movable-view 元素选择器'),
          x: z.number().describe('目标 X 坐标'),
          y: z.number().describe('目标 Y 坐标'),
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
