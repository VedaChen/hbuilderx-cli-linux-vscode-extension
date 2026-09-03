const { execSync, spawn } = require('child_process');
const fs = require('fs');

const winMirrorPath = '/mnt/c/Users/momo/Desktop/github/hbuilderx-cli-gui';

function getDevPath() {
    try {
        if (fs.existsSync(winMirrorPath)) {
            // 自动将最新构建与图片资源同步至 Windows 本地磁盘路径，规避 WSL UNC 网络路径的 Chromium 图片安全策略拦截
            execSync(`mkdir -p ${winMirrorPath}/resources ${winMirrorPath}/media ${winMirrorPath}/dist`);
            execSync(`cp -r ${process.cwd()}/dist/* ${winMirrorPath}/dist/`);
            execSync(`cp -r ${process.cwd()}/resources/* ${winMirrorPath}/resources/`);
            execSync(`cp -r ${process.cwd()}/media/* ${winMirrorPath}/media/`);
            execSync(`cp ${process.cwd()}/package.json ${winMirrorPath}/package.json`);
            return execSync('wslpath -w ' + winMirrorPath, { encoding: 'utf8' }).trim();
        }
        return execSync('wslpath -w ' + process.cwd(), { encoding: 'utf8' }).trim();
    } catch {
        return process.cwd();
    }
}

const devPath = getDevPath();
console.log(`[Launch] 正在唤起 VS Code 扩展测试窗口 (Windows 本地磁盘路径): ${devPath}`);

const proc = spawn('code', [`--extensionDevelopmentPath=${devPath}`, '--new-window'], {
    stdio: 'inherit'
});

proc.on('close', (code) => {
    process.exit(code || 0);
});
