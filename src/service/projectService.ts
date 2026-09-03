import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import * as vscode from 'vscode';
import { CliRunner } from './cliRunner';

export interface HBuilderProject {
	id: string;
	name: string;
	type?: string;
	path?: string;
}

function parseIniContent(content: string, map: Map<string, string>): void {
	const lines = content.split(/\r?\n/);
	for (const line of lines) {
		const match = line.match(/^projects\\\d+\\path=(.+)$/);
		if (match) {
			const fullPath = match[1].trim();
			const base = path.basename(fullPath);
			map.set(base, fullPath);
			map.set(fullPath, fullPath);
		}
	}
}

export async function getProjectPathsFromIniAsync(): Promise<Map<string, string>> {
	const map = new Map<string, string>();

	// 1. 本地文件路径尝试（Linux 路径与 Windows WSL UNC 共享路径）
	const localIniPaths = [
		path.join(os.homedir(), '.local/share/HBuilder X/HBuilder X.ini'),
		path.join(os.homedir(), '.config/HBuilder X/HBuilder X.ini'),
		'\\\\wsl.localhost\\Ubuntu\\home\\momo\\.local\\share\\HBuilder X\\HBuilder X.ini',
		'\\\\wsl$\\Ubuntu\\home\\momo\\.local\\share\\HBuilder X\\HBuilder X.ini'
	];

	for (const iniPath of localIniPaths) {
		if (fs.existsSync(iniPath)) {
			try {
				const content = fs.readFileSync(iniPath, 'utf8');
				parseIniContent(content, map);
				if (map.size > 0) {
					return map;
				}
			} catch {}
		}
	}

	// 2. 通过执行 bash 命令直接在 WSL Linux 内读取真实 ini 内容
	try {
		const cmd = process.platform === 'win32'
			? 'wsl bash -c "cat ~/.local/share/HBuilder\\ X/HBuilder\\ X.ini 2>/dev/null || cat /home/momo/.local/share/HBuilder\\ X/HBuilder\\ X.ini 2>/dev/null"'
			: 'bash -c "cat ~/.local/share/HBuilder\\ X/HBuilder\\ X.ini 2>/dev/null || cat /home/momo/.local/share/HBuilder\\ X/HBuilder\\ X.ini 2>/dev/null"';

		const content = await new Promise<string>((resolve) => {
			exec(cmd, { encoding: 'utf8' }, (_err, stdout) => {
				resolve(stdout || '');
			});
		});
		parseIniContent(content, map);
	} catch {}

	return map;
}

function parseProjectList(output: string, pathMap: Map<string, string>): HBuilderProject[] {
	const lines = output.split(/\r?\n/);
	const projects: HBuilderProject[] = [];

	for (const line of lines) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith('0:project list:') || trimmed.includes(':OK') || trimmed.includes(':FAILED')) {
			continue;
		}
		const match = trimmed.match(/^(\d+)\s*-\s*([^(]+)(?:\((.*)\))?$/);
		if (match) {
			const name = match[2].trim();
			projects.push({
				id: match[1].trim(),
				name: name,
				type: match[3]?.trim(),
				path: pathMap.get(name)
			});
		}
	}
	return projects;
}

export class ProjectService {
	public static async fetchProjects(): Promise<HBuilderProject[]> {
		try {
			const [output, pathMap] = await Promise.all([
				CliRunner.execAsync('project list'),
				getProjectPathsFromIniAsync()
			]);
			return parseProjectList(output, pathMap);
		} catch {
			return [];
		}
	}

	public static async closeProject(projectNameOrPath: string): Promise<void> {
		const pathMap = await getProjectPathsFromIniAsync();
		let targetPath = pathMap.get(projectNameOrPath) || projectNameOrPath;

		// 如果 targetPath 仍然是简写名称，尝试结合当前工作区父级目录解析出 /mnt/... 路径
		if (!targetPath.startsWith('/') && !targetPath.includes(':\\')) {
			const currentWs = CliRunner.getCurrentWorkspacePath();
			if (currentWs) {
				const parentDir = path.dirname(currentWs);
				const possiblePath = path.join(parentDir, targetPath);
				let linuxPath = possiblePath.replace(/\\/g, '/');
				if (/^[A-Za-z]:/.test(linuxPath)) {
					linuxPath = `/mnt/${linuxPath[0].toLowerCase()}${linuxPath.slice(2)}`;
				}
				targetPath = linuxPath;
			}
		}

		CliRunner.runInTerminal(`project close --path "${targetPath}"`, undefined, `移除工程 ${projectNameOrPath}`);
	}

	public static async openProject(folderUri?: vscode.Uri, onProjectOpened?: () => void): Promise<void> {
		const projectPath = CliRunner.getCurrentWorkspacePath(folderUri);
		if (projectPath) {
			CliRunner.runInTerminal('project open --path __PROJECT_PATH__', projectPath, '打开/导入项目');
			if (onProjectOpened) {
				setTimeout(onProjectOpened, 1500);
				setTimeout(onProjectOpened, 3000);
				setTimeout(onProjectOpened, 5000);
			}
		} else {
			const selected = await vscode.window.showOpenDialog({
				canSelectFiles: false,
				canSelectFolders: true,
				canSelectMany: false,
				openLabel: '在 HBuilderX 中打开'
			});
			if (selected && selected.length > 0) {
				CliRunner.runInTerminal('project open --path __PROJECT_PATH__', selected[0].fsPath, '打开/导入项目');
				if (onProjectOpened) {
					setTimeout(onProjectOpened, 1500);
					setTimeout(onProjectOpened, 3000);
					setTimeout(onProjectOpened, 5000);
				}
			}
		}
	}

	public static async listProjects(): Promise<void> {
		try {
			const output = await CliRunner.execAsync('project list');
			const pathMap = await getProjectPathsFromIniAsync();
			const projects = parseProjectList(output, pathMap);

			if (projects.length === 0) {
				const choice = await vscode.window.showInformationMessage(
					'当前 HBuilderX 中暂无已导入的项目。',
					'打开当前项目',
					'确定'
				);
				if (choice === '打开当前项目') {
					await this.openProject();
				}
				return;
			}

			const items: (vscode.QuickPickItem & { project: HBuilderProject })[] = projects.map((p) => ({
				label: `$(folder) ${p.name}`,
				description: p.type ? `[${p.type}]` : '',
				detail: `项目 ID: ${p.id}${p.path ? ' | ' + p.path : ''}`,
				project: p
			}));

			const selected = await vscode.window.showQuickPick(items, {
				title: `HBuilderX 已导入项目列表 (${projects.length})`,
				placeHolder: '选择一个项目以查看可用快捷操作...'
			});

			if (!selected) {
				return;
			}

			const proj = selected.project;
			const actionItems = [
				{
					label: '$(globe) 运行到 Web (H5)',
					description: `cli launch --platform web --project "${proj.name}"`,
					action: () =>
						CliRunner.runInTerminal(
							`launch --platform web --project "${proj.name}"`,
							undefined,
							`[${proj.name}] 运行到 Web`
						)
				},
				{
					label: '$(package) 打包 Android 平台资源',
					description: `cli publish --platform app-android --project "${proj.name}"`,
					action: () =>
						CliRunner.runInTerminal(
							`publish --platform app-android --project "${proj.name}"`,
							undefined,
							`[${proj.name}] 打包 Android 资源`
						)
				},
				{
					label: '$(folder-opened) 在 HBuilderX 中打开该工程',
					description: `cli project open --path "${proj.path || proj.name}"`,
					action: () =>
						CliRunner.runInTerminal(
							`project open --path "${proj.path || proj.name}"`,
							undefined,
							`打开项目 ${proj.name}`
						)
				},
				{
					label: '$(trash) 从 HBuilderX 中移除该工程',
					description: `cli project close --path "${proj.path || proj.name}"`,
					action: () => this.closeProject(proj.path || proj.name)
				}
			];

			const chosenAction = await vscode.window.showQuickPick(actionItems, {
				title: `项目快捷操作: ${proj.name} ${proj.type ? '(' + proj.type + ')' : ''}`,
				placeHolder: `请选择对项目 [${proj.name}] 执行的操作...`
			});

			if (chosenAction) {
				chosenAction.action();
			}
		} catch {
			// 异常降级在终端执行打印
			CliRunner.runInTerminal('project list', undefined, '已导入项目列表');
		}
	}

	public static launchWeb(): void {
		const projectPath = CliRunner.getCurrentWorkspacePath();
		const projName = projectPath ? path.basename(projectPath) : undefined;
		if (projName) {
			CliRunner.runInTerminal(`launch web --project "${projName}"`, undefined, '运行到 Web');
		} else {
			vscode.window.showWarningMessage('请先在 VS Code 中打开一个工作区项目');
		}
	}

	public static launchAndroid(): void {
		const projectPath = CliRunner.getCurrentWorkspacePath();
		const projName = projectPath ? path.basename(projectPath) : undefined;
		if (projName) {
			CliRunner.runInTerminal(`launch app-android --project "${projName}"`, undefined, '运行到 Android');
		} else {
			vscode.window.showWarningMessage('请先在 VS Code 中打开一个工作区项目');
		}
	}
}
