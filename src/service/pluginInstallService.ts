import * as vscode from 'vscode';
import { AppConfig } from '../config/config';
import { CliRunner } from './cliRunner';
import { getProjectPathsFromIniAsync } from './projectService';

export class PluginInstallService {
	public static async install(pluginId: string, targetProject?: string, force = false): Promise<void> {
		const cliPath = AppConfig.getCliPath();
		if (!cliPath) {
			vscode.window.showErrorMessage('请先配置 HBuilderX CLI 路径');
			return;
		}

		let projectPath: string | undefined;

		// 1. 如果传入了目标工程名称或路径，先尝试从 ini 中获取绝对路径
		if (targetProject) {
			const pathMap = await getProjectPathsFromIniAsync();
			projectPath = pathMap.get(targetProject) || (targetProject.includes('/') || targetProject.includes('\\') ? targetProject : undefined);
		}

		// 2. 如果未获取到，尝试使用当前 VS Code 工作区路径
		if (!projectPath) {
			projectPath = CliRunner.getCurrentWorkspacePath();
		}

		// 3. 如果仍未获取到，让用户手动选择项目目录
		if (!projectPath) {
			const selected = await vscode.window.showOpenDialog({
				canSelectFiles: false,
				canSelectFolders: true,
				canSelectMany: false,
				openLabel: '选择项目目录'
			});
			if (selected && selected.length > 0) {
				projectPath = selected[0].fsPath;
			}
		}

		if (!projectPath) {
			vscode.window.showErrorMessage('请选择一个项目目录');
			return;
		}

		const pluginIdTrimmed = pluginId.trim();
		const forceArg = force ? ' --force' : '';
		CliRunner.runInTerminal(
			`uni_modules --download ${pluginIdTrimmed} --project "${projectPath}"${forceArg}`,
			undefined,
			`${force ? '强制' : ''}安装插件 ${pluginIdTrimmed}`
		);
	}
}
