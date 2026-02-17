<img src="logo.png" align="right" width="64" alt="logo"/>

# wechat-devtools-mcp

微信开发者工具自动化的 MCP（Model Context Protocol）服务。

## 功能特点

- 通过 MCP 协议与 AI 代理（如 Claude、Cursor）集成
- 支持启动微信开发者工具并连接小程序项目
- 提供页面导航、元素操作、获取页面信息等自动化能力
- 支持控制台日志和异常监听

## 安装

```json
{
  "mcpServers": {
    "wechat-devtools": {
      "command": "npx",
      "args": [
        "-y",
        "wechat-devtools-mcp",
        "--projectPath=/path/to/your/miniprogram"
      ]
    }
  }
}
```

### 命令行参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `--projectPath` | string | 小程序项目路径（必填） |
| `--cliPath` | string | 微信开发者工具 CLI 路径 |
| `--timeout` | number | 连接超时时间（毫秒），默认 30000 |
| `--port` | number | WebSocket 端口号，默认 9420 |
| `--account` | string | 用户 openid |
| `--ticket` | string | 开发者工具登录票据 |
| `--projectConfig` | string | 覆盖 project.config.json 中的配置 |
