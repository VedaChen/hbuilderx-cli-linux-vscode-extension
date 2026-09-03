import * as vscode from 'vscode';
import { getWebviewContent } from './template';
import { ProjectService, HBuilderProject, getProjectPathsFromIniAsync } from '../service/projectService';
import { UserService } from '../service/userService';
import { CliRunner } from '../service/cliRunner';

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
				case 'showGuide':
					const guideItems = [
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
						placeHolder: '选择要打开的官方文档...'
					}).then((selected) => {
						if (selected && selected.url) {
							vscode.env.openExternal(vscode.Uri.parse(selected.url));
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
			}
		});
	}

	public async refreshProjects(force = false): Promise<void> {
		const newProjects = await ProjectService.fetchProjects();
		const newHash = JSON.stringify(newProjects);

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
