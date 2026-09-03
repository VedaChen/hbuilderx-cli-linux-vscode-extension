const { execSync, spawn } = require('child_process');

function getDevPath() {
    try {
        return execSync('wslpath -w ' + process.cwd(), { encoding: 'utf8' }).trim();
    } catch {
        return process.cwd();
    }
}

const devPath = getDevPath();
console.log(`[Launch] 正在唤起 VS Code 扩展测试窗口: ${devPath}`);

const proc = spawn('code', [`--extensionDevelopmentPath=${devPath}`, '--new-window'], {
    stdio: 'inherit'
});

proc.on('close', (code) => {
    process.exit(code || 0);
});
