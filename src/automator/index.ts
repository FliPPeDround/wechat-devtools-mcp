import type MiniProgram from 'miniprogram-automator/out/MiniProgram'
import automator from 'miniprogram-automator'

export class Automator {
  miniProgram: MiniProgram | null = null
  private cliPath: string | undefined
  private projectPath: string

  constructor(options: { cliPath?: string, projectPath: string }) {
    this.cliPath = options.cliPath
    this.projectPath = options.projectPath
  }

  /**
   * 启动小程序
   */
  async launch() {
    // 当 cliPath 存在时，使用 cliPath 启动小程序
    // 否则，仅使用 projectPath 启动小程序
    const launchOptions = {
      projectPath: this.projectPath,
      ...(this.cliPath && { cliPath: this.cliPath }),
    }
    this.miniProgram = await automator.launch(launchOptions)
    return this.miniProgram
  }
}
