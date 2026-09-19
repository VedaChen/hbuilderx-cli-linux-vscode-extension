const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const isWin = process.platform === 'win32';
const winMirrorPath = '/mnt/c/Users/momo/Desktop/github/hbuilderx-cli-gui';

function getDevPath() {
    // 仅在 Linux (如 WSL) 环境下尝试执行 wslpath 与本地镜像同步
    if (!isWin) {
        try {
            if (fs.existsSync(winMirrorPath)) {
                execSync(`mkdir -p ${winMirrorPath}/resources ${winMirrorPath}/media ${winMirrorPath}/dist`);
                execSync(`cp -r ${process.cwd()}/dist/* ${winMirrorPath}/dist/`);
                execSync(`cp -r ${process.cwd()}/resources/* ${winMirrorPath}/resources/`);
                execSync(`cp -r ${process.cwd()}/media/* ${winMirrorPath}/media/`);
                execSync(`cp ${process.cwd()}/package.json ${winMirrorPath}/package.json`);
                return execSync('wslpath -w ' + winMirrorPath, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
            }
            return execSync('wslpath -w ' + process.cwd(), { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
        } catch {
            return process.cwd();
        }
    }
    return process.cwd();
}

const devPath = getDevPath();
console.log(`[Launch] 正在唤起 VS Code 扩展测试窗口: ${devPath}`);

// Windows 下 VS Code CLI 通常为 code.cmd，且 spawn 需要开启 shell: true 才能正确解析 .cmd 脚本
const codeCmd = isWin ? 'code.cmd' : 'code';

const proc = spawn(codeCmd, [`--extensionDevelopmentPath=${devPath}`, '--new-window'], {
    stdio: 'inherit',
    shell: isWin
});

proc.on('error', (err) => {
    console.error(`[Launch Error] 唤起 VS Code 失败: ${err.message}`);
    console.error('请确认 VS Code 的 bin 目录已加入系统环境变量 PATH 中。');
});

proc.on('close', (code) => {
    process.exit(code || 0);
});
