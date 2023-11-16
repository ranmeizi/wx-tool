var inquirer = require('inquirer');
var getQuestions = require('./questions.js')
const child_process = require("child_process");
const path = require('path');

async function ask(ctx) {
    const questions = await getQuestions()
    const { network_env } = await inquirer.prompt([
        questions.network_env_list,
    ])
    ctx.network_env = network_env
}

async function main() {
    const ctx = {}
    // 问问题
    await ask(ctx)

    // 执行命令行
    const proc = child_process.spawn(`yarn dev:weapp`, [], {
        cwd: path.resolve(__dirname, '../../'),
        shell: true,
        stdio: 'inherit',
        env: {
            ...process.env,
            NETWORK_ENV: ctx.network_env,
        }
    })

    process.on('SIGTERM', () => proc.kill('SIGTERM'))
    process.on('SIGINT', () => proc.kill('SIGINT'))
    process.on('SIGBREAK', () => proc.kill('SIGBREAK'))
    process.on('SIGHUP', () => proc.kill('SIGHUP'))
    proc.on('exit', (code, signal) => {
      process.exit(0) //eslint-disable-line no-process-exit
    })
}

main()