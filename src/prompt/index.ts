import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'

export function registerSystemPrompt(server: McpServer) {
  server.registerPrompt(
    'guide',
    {
      title: '小程序自动化使用指南',
      description: '提供微信小程序自动化 MCP 工具的完整使用指南，包括功能介绍、工具依赖关系和典型使用场景',
    },
    () => ({
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `## 微信小程序自动化 MCP 工具使用指南

本工具基于微信官方小程序自动化 SDK 开发，提供了一套通过外部脚本操控小程序的能力。

### 一、功能概述

这个 MCP 工具可以：

1. **启动和控制小程序** - 启动微信开发者工具并连接到小程序自动化实例
2. **页面导航** - 跳转到指定页面、切换 TabBar、导航等
3. **元素操作** - 获取页面元素、点击元素、触发事件、输入文本等
4. **数据操作** - 获取/设置页面数据、调用页面方法
5. **调用微信 API** - 调用 wx.login、wx.request 等微信原生 API
6. **Mock 功能** - 模拟微信 API 返回值，用于测试场景
7. **执行自定义代码** - 往小程序注入并执行 JavaScript 代码
8. **日志和异常获取** - 获取小程序运行时的控制台日志和异常信息
9. **截图功能** - 对小程序当前页面进行截图
10. **测试账号管理** - 获取多账号调试中的测试用户列表

### 二、工具依赖关系

**重要：必须按顺序使用工具，遵循以下依赖链：**

启动阶段:
- launch (启动小程序) - 必须执行

核心功能阶段:
- 所有其他工具都需要先启动/连接小程序后才能使用
- 页面导航: navigateTo, reLaunch, switchTab, navigateBack
- 页面操作: getCurrentPage, getPages, setPageData
- 元素操作: getElement, tapElement, inputValue, longpress
- 微信 API: callWxMethod, mockWxMethod
- 代码执行: evaluate, exposeFunction
- 日志获取: getlogs, getexceptions
- 其他: screenshot, pageScrollTo, testAccounts, getTicket

**启动方式说明：**
- **launch**: 启动微信开发者工具并连接自动化实例（首次使用或需要全新启动时使用）

### 三、典型使用工作流

#### 工作流 1：完整测试流程
1. launch -> 启动小程序
2. navigateTo -> 跳转到测试页面
3. getElement -> 获取目标元素
4. tapElement -> 点击元素
5. getPageData -> 获取页面数据验证结果
6. getlogs -> 查看运行日志
7. (自动化脚本结束时会自动关闭连接)

#### 工作流 2：数据驱动测试
1. launch -> 启动小程序
2. navigateTo -> 跳转到目标页面
3. setPageData -> 设置测试数据
4. getElement -> 验证数据渲染结果
5. screenshot -> 截图保存测试结果

#### 工作流 3：Mock API 测试
1. launch -> 启动小程序
2. mockWxMethod -> Mock 接口返回（如模拟登录、请求等）
3. navigateTo -> 跳转到需要调用 API 的页面
4. callWxMethod -> 调用实际 API
5. getlogs -> 查看接口调用日志

### 四、常见使用场景示例

#### 示例 1：测试小程序首页
用户请求：测试小程序首页是否能正常显示
操作步骤：
1. 调用 launch 启动小程序
2. 调用 navigateTo 跳转到首页 /pages/index/index
3. 调用 getPageData 获取页面数据
4. 调用 screenshot 截图
5. 调用 getlogs 查看是否有异常

#### 示例 2：模拟用户登录流程
用户请求：测试登录功能
操作步骤：
1. 调用 launch 启动小程序
2. 调用 mockWxMethod 模拟 wx.login 返回成功
3. 调用 navigateTo 跳转到登录页面
4. 调用 callWxMethod 调用 wx.login
5. 调用 getlogs 查看登录日志
6. 调用 evaluate 获取 globalData 验证登录状态

#### 示例 3：测试页面交互
用户请求：测试列表项点击展开功能
操作步骤：
1. 调用 launch 启动小程序
2. 调用 navigateTo 跳转到列表页面
3. 调用 getElement 获取列表项元素
4. 调用 tapElement 点击列表项
5. 调用 getPageData 验证数据变化
6. 调用 screenshot 截图保存交互结果

### 五、注意事项

1. **必须先启动**：除 launch 外，所有工具都需要先成功启动小程序
2. **安全设置**：使用自动化功能前，需在微信开发者工具中开启"安全设置"的"CLI/HTTP 调用"选项
3. **系统组件**：用户授权框等系统组件无法通过自动化操作，需手动授权
4. **正确关闭**：测试完成后脚本会自动断开连接，无需手动关闭
5. **选择器使用**：元素操作使用 CSS 选择器，如 .class、#id、view 等

### 六、快速命令参考

- 启动小程序：使用 \`launch\` 工具
- 跳转到页面：使用 \`navigateTo\` 工具
- 点击元素：使用 \`tapElement\` 工具
- 获取页面数据：使用 \`getPageData\` 工具
- 设置页面数据：使用 \`setPageData\` 工具
- 调用微信 API：使用 \`callWxMethod\` 工具
- Mock API 返回：使用 \`mockWxMethod\` 工具
- 执行自定义代码：使用 \`evaluate\` 工具
- 获取日志：使用 \`getlogs\` 工具
- 获取异常：使用 \`getexceptions\` 工具
- 页面截图：使用 \`screenshot\` 工具`,
          },
        },
      ],
    }),
  )
}
