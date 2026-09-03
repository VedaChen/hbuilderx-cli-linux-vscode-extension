import * as vscode from 'vscode';
import { getWebviewContent } from './template';
import { ProjectService, HBuilderProject, getProjectPathsFromIniAsync } from '../service/projectService';
import { UserService } from '../service/userService';
import { CliRunner } from '../service/cliRunner';
import { PluginInstallService } from '../service/pluginInstallService';

export class HBuilderWebviewProvider implements vscode.WebviewViewProvider {
	private _view?: vscode.WebviewView;
	private _projects: HBuilderProject[] = [];
	private _selectedTargetProject?: string;
	private _selectedTab = 'tab-projects';
	private _lastProjectsHash = '';
	private _pollInterval?: NodeJS.Timeout;
	private _hasLaunchedApp = false;

	constructor(
		private readonly _extensionUri: vscode.Uri,
		private readonly _context?: vscode.ExtensionContext
	) {
		// 监听 VS Code 窗口焦点，当用户切回窗口时自动检测并刷新项目列表
		vscode.window.onDidChangeWindowState((e) => {
			if (e.focused && this._view?.visible) {
				this.refreshProjects();
			}
		});
	}

	public async resolveWebviewView(
		webviewView: vscode.WebviewView,
		_context: vscode.WebviewViewResolveContext,
		_token: vscode.CancellationToken
	): Promise<void> {
		this._view = webviewView;

		webviewView.webview.options = {
			enableScripts: true,
			localResourceRoots: [this._extensionUri]
		};

		// 点击左侧拓展图标进入主页面时仅执行一次 cli open 唤起主服务
		if (!this._hasLaunchedApp) {
			this._hasLaunchedApp = true;
			CliRunner.runInTerminal('open', undefined, '启动 HBuilderX 主程序');
		}

		// 监听 Webview 显示/隐藏状态
		webviewView.onDidChangeVisibility(() => {
			if (webviewView.visible) {
				this.refreshProjects();
			}
		});

		// 启动轻量级静默轮询（每 3 秒检测一次项目列表变更，有增减时自动无缝更新）
		if (this._pollInterval) {
			clearInterval(this._pollInterval);
		}
		this._pollInterval = setInterval(() => {
			if (this._view?.visible) {
				this.refreshProjects();
			}
		}, 3000);

		// 首次加载
		await this.refreshProjects(true);

		// 监听 Webview 发送的消息
		webviewView.webview.onDidReceiveMessage(async (message) => {
			switch (message.command) {
				case 'executeAction':
					if (message.action) {
						vscode.commands.executeCommand(message.action);
						// 若执行的是打开项目命令，延迟触发连续刷新以捕获新导入的项目
						if (message.action === 'hbuilderx-cli-gui.openProject') {
							setTimeout(() => this.refreshProjects(), 1500);
							setTimeout(() => this.refreshProjects(), 3000);
							setTimeout(() => this.refreshProjects(), 5000);
						}
					}
					break;
				case 'loginCredentials':
					if (message.username && message.password) {
						UserService.loginWithCredentials(message.username, message.password, () => {
							this.refresh(false);
						});
					}
					break;
				case 'confirmLogout':
					UserService.logoutDirect(() => {
						this.refresh(false);
					});
					break;
				case 'refreshProjects':
					await this.refreshProjects(true);
					break;
				case 'openWorkspaceProject':
					const wsPath = CliRunner.getCurrentWorkspacePath();
					if (wsPath) {
						CliRunner.runInTerminal('project open --path __PROJECT_PATH__', wsPath, '导入当前工作区');
						setTimeout(() => this.refreshProjects(true), 1500);
						setTimeout(() => this.refreshProjects(true), 3500);
					} else {
						vscode.window.showWarningMessage('当前未打开工作区文件夹，请选择本地目录');
						vscode.commands.executeCommand('hbuilderx-cli-gui.openProject');
					}
					break;
				case 'openFolderProject':
					vscode.window.showOpenDialog({
						canSelectFiles: false,
						canSelectFolders: true,
						canSelectMany: false,
						openLabel: '在 HBuilderX 中导入打开'
					}).then((selected) => {
						if (selected && selected.length > 0) {
							CliRunner.runInTerminal('project open --path __PROJECT_PATH__', selected[0].fsPath, '打开/导入本地项目');
							setTimeout(() => this.refreshProjects(true), 1500);
							setTimeout(() => this.refreshProjects(true), 3500);
						}
					});
					break;
				case 'openActiveFile':
					const activeEditor = vscode.window.activeTextEditor;
					if (activeEditor && activeEditor.document) {
						let filePath = activeEditor.document.fileName;
						if (process.platform === 'win32') {
							filePath = filePath.replace(/\\/g, '/');
							if (/^[A-Za-z]:/.test(filePath)) {
								filePath = `/mnt/${filePath[0].toLowerCase()}${filePath.slice(2)}`;
							}
						}
						const line = activeEditor.selection.active.line + 1;
						const col = activeEditor.selection.active.character + 1;
						CliRunner.runInTerminal(`open --file "${filePath}:${line}:${col}"`, undefined, '在 HBuilderX 中打开当前文件');
					} else {
						vscode.window.showWarningMessage('当前没有处于活动状态的代码编辑器文件');
					}
					break;
				case 'listProjectsInTerminal':
					CliRunner.runInTerminal('project list', undefined, '列举所有项目');
					break;
				case 'openSpecificProject':
					if (message.path || message.projectName) {
						let tPath = message.path || message.projectName;
						if (!tPath.startsWith('/') && !tPath.includes(':\\')) {
							const pathMap = await getProjectPathsFromIniAsync();
							tPath = pathMap.get(tPath) || tPath;
						}
						CliRunner.runInTerminal(`project open --path "${tPath}"`, undefined, `在 HBuilderX 中打开 ${message.projectName || tPath}`);
					}
					break;
				case 'closeProject':
					if (message.projectPath || message.projectName) {
						await ProjectService.closeProject(message.projectPath || message.projectName);
						setTimeout(() => this.refreshProjects(true), 600);
						setTimeout(() => this.refreshProjects(true), 1500);
					}
					break;
				case 'selectTargetProject':
					if (message.target) {
						this._selectedTargetProject = message.target;
					}
					break;
				case 'selectTab':
					if (message.tab) {
						this._selectedTab = message.tab;
					}
					break;
				case 'executeGenericAction':
					if (message.template) {
						const targetName = message.target || '';
						let rawCmd = message.template;
						if (rawCmd.includes('__PROJECT__')) {
							rawCmd = rawCmd.replace(/__PROJECT__/g, targetName);
						}
						if (rawCmd.includes('__PROJECT_PATH__')) {
							const pathMap = await getProjectPathsFromIniAsync();
							const pPath = pathMap.get(targetName) || targetName;
							rawCmd = rawCmd.replace(/__PROJECT_PATH__/g, pPath);
						}
						CliRunner.runInTerminal(
							rawCmd,
							undefined,
							message.title || '执行操作'
						);
					}
					break;
				case 'openTutorial':
					const tutorialUri = vscode.Uri.joinPath(this._extensionUri, 'docs', 'tutorial.md');
					vscode.commands.executeCommand('markdown.showPreview', tutorialUri).then(undefined, () => {
						vscode.commands.executeCommand('vscode.open', tutorialUri);
					});
					break;
				case 'showGuide':
					const guideItems = [
						{
							label: 'CLI 安装与配置教程 (本地 Markdown)',
							description: 'docs/tutorial.md',
							detail: '查看扩展内置的 Markdown 安装与配置教程',
							action: 'openTutorial'
						},
						{
							label: '官方下载与安装教程 (官网)',
							description: 'https://hx.dcloud.net.cn/Tutorial/install/linux-cli',
							detail: 'DCloud 官方 Linux CLI 下载与环境配置教程',
							url: 'https://hx.dcloud.net.cn/Tutorial/install/linux-cli'
						},
						{
							label: '官方CLI文档 (官网)',
							description: 'https://hx.dcloud.net.cn/cli/README',
							detail: 'DCloud 官方 Linux CLI 完整手册',
							url: 'https://hx.dcloud.net.cn/cli/README'
						},
						{
							label: '官方CLI文档 (GitHub)',
							description: 'github.com/dcloudio/hbuilderx-extension-docs',
							detail: 'GitHub 开源文档仓库 (zh-cn/cli)',
							url: 'https://github.com/dcloudio/hbuilderx-extension-docs/blob/master/zh-cn/cli/README.md'
						}
					];
					vscode.window.showQuickPick(guideItems, {
						title: 'HBuilderX 官方 CLI 帮助与引导',
						placeHolder: '选择要打开的文档或教程...'
					}).then((selected) => {
						if (selected) {
							if (selected.action === 'openTutorial') {
								const tUri = vscode.Uri.joinPath(this._extensionUri, 'docs', 'tutorial.md');
								vscode.commands.executeCommand('markdown.showPreview', tUri).then(undefined, () => {
									vscode.commands.executeCommand('vscode.open', tUri);
								});
							} else if (selected.url) {
								vscode.env.openExternal(vscode.Uri.parse(selected.url));
							}
						}
					});
					break;
				case 'openSettings':
					vscode.commands.executeCommand('workbench.action.openSettings', 'hbuilderx-cli-gui');
					break;
				case 'openExternal':
					if (message.url) {
						vscode.env.openExternal(vscode.Uri.parse(message.url));
					}
					break;
				case 'refresh':
					await this.refresh(true);
					break;
				case 'installPlugin':
					if (message.pluginIdOrUrl) {
						PluginInstallService.install(message.pluginIdOrUrl, message.target || this._selectedTargetProject, !!message.force);
					}
					break;
			}
		});
	}

	public async refreshProjects(force = false): Promise<void> {
		const [newProjects] = await Promise.all([
			ProjectService.fetchProjects(),
			UserService.fetchCurrentUserFromCli()
		]);
		const currentUser = UserService.getCurrentUser();
		const newHash = JSON.stringify({ projects: newProjects, user: currentUser });

		if (!force && newHash === this._lastProjectsHash) {
			return;
		}

		this._projects = newProjects;
		this._lastProjectsHash = newHash;

		if (this._view) {
			this._view.webview.html = getWebviewContent(this._projects, this._selectedTargetProject, this._selectedTab);
		}
	}

	public async refresh(showNotification = true): Promise<void> {
		await this.refreshProjects(true);
		if (showNotification) {
			vscode.window.showInformationMessage('HBuilderX CLI 控制台已刷新');
		}
	}
}
