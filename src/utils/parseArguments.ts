import type { LaunchOptions } from '@/tools/Automator'
import process from 'node:process'
import { clearUndefined } from '@antfu/utils'
import minimist from 'minimist'

export function parseArguments(): LaunchOptions {
  const argv = minimist(process.argv.slice(2), {
    string: ['_', 'projectPath', 'cliPath', 'account', 'ticket'],
    default: {
      timeout: 30000,
    },
  })

  const options: LaunchOptions = {
    projectPath: argv.projectPath,
    cliPath: argv.cliPath,
    timeout: argv.timeout ? Number(argv.timeout) : 30000,
    port: argv.port ? Number(argv.port) : 9420,
    account: argv.account,
    ticket: argv.ticket,
  }

  if (argv.projectConfig) {
    try {
      options.projectConfig = JSON.parse(argv.projectConfig)
    }
    catch {
      throw new Error('Invalid JSON in projectConfig argument')
    }
  }

  return clearUndefined(options)
}
