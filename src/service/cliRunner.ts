import * as vscode from 'vscode';
import { exec } from 'child_process';
import { AppConfig } from '../config/config';

export class CliRunner {
	private static terminal?: vscode.Terminal;

	public static getCliCommand(args: string, projectPath?: string): { cmd: string; title: string } {
		const cliPath = AppConfig.getCliPath();
		let finalArgs = args;

		if (projectPath) {
			let linuxProjPath = projectPath;
			if (process.platform === 'win32') {
				linuxProjPath = projectPath.replace(/\\/g, '/');
				if (/^[A-Za-z]:/.test(linuxProjPath)) {
					const drive = linuxProjPath[0].toLowerCase();
					linuxProjPath = `/mnt/${drive}${linuxProjPath.slice(2)}`;
				} else if (linuxProjPath.includes('wsl.localhost/')) {
					const parts = linuxProjPath.split('wsl.localhost/');
					if (parts.length > 1) {
						linuxProjPath = parts[1].substring(parts[1].indexOf('/'));
					}
				}
			}
			finalArgs = finalArgs.replace('__PROJECT_PATH__', `"${linuxProjPath}"`);
		}

		// 如果是在 Windows 宿主环境下测试，自动前置 wsl 桥接命令
		if (process.platform === 'win32') {
			return {
				cmd: `wsl "${cliPath.trim()}" ${finalArgs}`,
				title: `[WSL Linux CLI] ${finalArgs}`
			};
		} else {
			return {
				cmd: `"${cliPath.trim()}" ${finalArgs}`,
				title: `[Linux CLI] ${finalArgs}`
			};
		}
	}

	public static execAsync(args: string, projectPath?: string): Promise<string> {
		const { cmd } = this.getCliCommand(args, projectPath);
		return new Promise((resolve, reject) => {
			exec(cmd, { encoding: 'utf8' }, (error, stdout, stderr) => {
				const output = (stdout || '') + (stderr || '');
				if (error && !output.trim()) {
					reject(error);
				} else {
					resolve(output.trim());
				}
			});
		});
	}

	public static execRawAsync(cmd: string): Promise<string> {
		const finalCmd = process.platform === 'win32' ? `wsl ${cmd}` : cmd;
		return new Promise((resolve, reject) => {
			exec(finalCmd, { encoding: 'utf8' }, (error, stdout, stderr) => {
				const output = (stdout || '') + (stderr || '');
				if (error && !output.trim()) {
					reject(error);
				} else {
					resolve(output.trim());
				}
			});
		});
	}

	public static runInTerminal(args: string, projectPath?: string, title?: string): void {
		if (!this.terminal || this.terminal.exitStatus !== undefined) {
			this.terminal = vscode.window.createTerminal({
				name: 'HBuilderX CLI',
				iconPath: new vscode.ThemeIcon('terminal')
			});
		}
		this.terminal.show();

		const { cmd, title: execTitle } = this.getCliCommand(args, projectPath);
		vscode.window.showInformationMessage(`[HBuilderX] 正在执行: ${title || execTitle}`);
		this.terminal.sendText(cmd);
	}

	public static getCurrentWorkspacePath(folderUri?: vscode.Uri): string | undefined {
		if (folderUri && folderUri.fsPath) {
			return folderUri.fsPath;
		}
		const workspaceFolders = vscode.workspace.workspaceFolders;
		if (workspaceFolders && workspaceFolders.length > 0) {
			return workspaceFolders[0].uri.fsPath;
		}
		return undefined;
	}

	public static dispose(): void {
		if (this.terminal) {
			this.terminal.dispose();
			this.terminal = undefined;
		}
	}
}
