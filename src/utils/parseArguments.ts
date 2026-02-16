import process from 'node:process'
import minimist from 'minimist'

export function parseArguments() {
  const argv = minimist(process.argv.slice(2), {
    alias: {
      cliPath: 'c',
      projectPath: 'p',
      timeout: 't',
      port: 'P',
      account: 'a',
      projectConfig: 'C',
      ticket: 'T',
    },
    string: ['_'],
  })

  return argv
}
