import * as vscode from 'vscode';

/**
 * 树视图节点项
 */
class HBuilderTreeItem extends vscode.TreeItem {
	constructor(
		public readonly label: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly options?: {
			commandId?: string;
			description?: string;
			tooltip?: string;
			iconName?: string;
			contextValue?: string;
			children?: HBuilderTreeItem[];
		}
	) {
		super(label, collapsibleState);
		this.description = options?.description;
		this.tooltip = options?.tooltip || label;
		this.contextValue = options?.contextValue;

		if (options?.iconName) {
			this.iconPath = new vscode.ThemeIcon(options.iconName);
		}

		if (options?.commandId) {
			this.command = {
				command: options.commandId,
				title: label
			};
		}
	}

	public get children(): HBuilderTreeItem[] | undefined {
		return this.options?.children;
	}
}

/**
 * HBuilderX 操作面板 TreeDataProvider
 */
class HBuilderTreeDataProvider implements vscode.TreeDataProvider<HBuilderTreeItem> {
	private _onDidChangeTreeData: vscode.EventEmitter<HBuilderTreeItem | undefined | null | void> = new vscode.EventEmitter<HBuilderTreeItem | undefined | null | void>();
	readonly onDidChangeTreeData: vscode.Event<HBuilderTreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element: HBuilderTreeItem): vscode.TreeItem {
		return element;
	}

	getChildren(element?: HBuilderTreeItem): vscode.ProviderResult<HBuilderTreeItem[]> {
		if (element) {
			return element.children || [];
		}

		// 根分类节点
		return [
			new HBuilderTreeItem('🚀 项目与运行', vscode.TreeItemCollapsibleState.Expanded, {
				iconName: 'rocket',
				children: [
					new HBuilderTreeItem('打开当前项目', vscode.TreeItemCollapsibleState.None, {
						commandId: 'hbuilderx-cli-gui.openProject',
						iconName: 'folder-opened',
						description: 'cli open'
					}),
					new HBuilderTreeItem('列出已导入项目', vscode.TreeItemCollapsibleState.None, {
						commandId: 'hbuilderx-cli-gui.projectList',
						iconName: 'list-unordered',
						description: 'cli project list'
					}),
					new HBuilderTreeItem('运行到 Web 浏览器', vscode.TreeItemCollapsibleState.None, {
						commandId: 'hbuilderx-cli-gui.launchWeb',
						iconName: 'browser',
						description: 'HBuilderX 5.0+'
					}),
					new HBuilderTreeItem('运行到 Android 设备', vscode.TreeItemCollapsibleState.None, {
						commandId: 'hbuilderx-cli-gui.launchAndroid',
						iconName: 'device-mobile',
						description: 'HBuilderX 5.0+'
					})
				]
			}),
			new HBuilderTreeItem('📦 发行与打包', vscode.TreeItemCollapsibleState.Expanded, {
				iconName: 'package',
				children: [
					new HBuilderTreeItem('发布到 微信小程序', vscode.TreeItemCollapsibleState.None, {
						commandId: 'hbuilderx-cli-gui.publishWechat',
						iconName: 'comment-discussion',
						description: 'mp-weixin'
					}),
					new HBuilderTreeItem('发布到 支付宝小程序', vscode.TreeItemCollapsibleState.None, {
						commandId: 'hbuilderx-cli-gui.publishAlipay',
						iconName: 'credit-card',
						description: 'mp-alipay'
					}),
					new HBuilderTreeItem('发布到 抖音小程序', vscode.TreeItemCollapsibleState.None, {
						commandId: 'hbuilderx-cli-gui.publishToutiao',
						iconName: 'play-circle',
						description: 'mp-toutiao'
					}),
					new HBuilderTreeItem('发布到 百度小程序', vscode.TreeItemCollapsibleState.None, {
						commandId: 'hbuilderx-cli-gui.publishBaidu',
						iconName: 'search',
						description: 'mp-baidu'
					}),
					new HBuilderTreeItem('发布到 飞书小程序', vscode.TreeItemCollapsibleState.None, {
						commandId: 'hbuilderx-cli-gui.publishLark',
						iconName: 'organization',
						description: 'mp-lark'
					}),
					new HBuilderTreeItem('发布到 QQ 小程序', vscode.TreeItemCollapsibleState.None, {
						commandId: 'hbuilderx-cli-gui.publishQQ',
						iconName: 'comment',
						description: 'mp-qq'
					}),
					new HBuilderTreeItem('发布到 快手小程序', vscode.TreeItemCollapsibleState.None, {
						commandId: 'hbuilderx-cli-gui.publishKuaishou',
						iconName: 'video',
						description: 'mp-kuaishou'
					}),
					new HBuilderTreeItem('发布到 京东小程序', vscode.TreeItemCollapsibleState.None, {
						commandId: 'hbuilderx-cli-gui.publishJD',
						iconName: 'archive',
						description: 'mp-jd'
					}),
					new HBuilderTreeItem('发布到 H5 / Web', vscode.TreeItemCollapsibleState.None, {
						commandId: 'hbuilderx-cli-gui.publishH5',
						iconName: 'globe',
						description: 'h5'
					}),
					new HBuilderTreeItem('打包 App (Android 资源)', vscode.TreeItemCollapsibleState.None, {
						commandId: 'hbuilderx-cli-gui.publishAppAndroid',
						iconName: 'file-zip',
						description: 'app-android'
					}),
					new HBuilderTreeItem('打包 App (iOS 资源)', vscode.TreeItemCollapsibleState.None, {
						commandId: 'hbuilderx-cli-gui.publishAppIos',
						iconName: 'file-zip',
						description: 'app-ios'
					})
				]
			}),
			new HBuilderTreeItem('👤 账号与配置', vscode.TreeItemCollapsibleState.Expanded, {
				iconName: 'settings-gear',
				children: [
					new HBuilderTreeItem('用户登录', vscode.TreeItemCollapsibleState.None, {
						commandId: 'hbuilderx-cli-gui.userLogin',
						iconName: 'sign-in',
						description: 'cli user login'
					}),
					new HBuilderTreeItem('查看用户信息', vscode.TreeItemCollapsibleState.None, {
						commandId: 'hbuilderx-cli-gui.userInfo',
						iconName: 'account',
						description: 'cli user info'
					}),
					new HBuilderTreeItem('用户登出', vscode.TreeItemCollapsibleState.None, {
						commandId: 'hbuilderx-cli-gui.userLogout',
						iconName: 'sign-out',
						description: 'cli user logout'
					}),
					new HBuilderTreeItem('插件设置', vscode.TreeItemCollapsibleState.None, {
						commandId: 'hbuilderx-cli-gui.openSettings',
						iconName: 'gear',
						description: '配置 CLI 路径'
					})
				]
			})
		];
	}
}

/**
 * 终端管理与 CLI 命令执行助手
 */
let hbuilderTerminal: vscode.Terminal | undefined;

function getCliCommand(args: string): string {
	const config = vscode.workspace.getConfiguration('hbuilderx-cli-gui');
	const customCliPath = config.get<string>('cliPath');
	const cliExec = customCliPath && customCliPath.trim().length > 0 ? `"${customCliPath.trim()}"` : 'cli';
	return `${cliExec} ${args}`;
}

function runCliInTerminal(args: string, title?: string) {
	if (!hbuilderTerminal || hbuilderTerminal.exitStatus !== undefined) {
		hbuilderTerminal = vscode.window.createTerminal({
			name: 'HBuilderX CLI',
			iconPath: new vscode.ThemeIcon('terminal')
		});
	}
	hbuilderTerminal.show();
	if (title) {
		vscode.window.showInformationMessage(`[HBuilderX] 正在执行: ${title}`);
	}
	const fullCmd = getCliCommand(args);
	hbuilderTerminal.sendText(fullCmd);
}

function getCurrentWorkspacePath(folderUri?: vscode.Uri): string | undefined {
	if (folderUri && folderUri.fsPath) {
		return folderUri.fsPath;
	}
	const workspaceFolders = vscode.workspace.workspaceFolders;
	if (workspaceFolders && workspaceFolders.length > 0) {
		return workspaceFolders[0].uri.fsPath;
	}
	return undefined;
}

export function activate(context: vscode.ExtensionContext) {
	// 1. 创建并注册 TreeDataProvider
	const treeDataProvider = new HBuilderTreeDataProvider();
	vscode.window.registerTreeDataProvider('hx-actions-view', treeDataProvider);

	// 2. 注册通用与管理命令
	context.subscriptions.push(
		vscode.commands.registerCommand('hbuilderx-cli-gui.refresh', () => {
			treeDataProvider.refresh();
			vscode.window.showInformationMessage('HBuilderX 操作面板已刷新');
		}),

		vscode.commands.registerCommand('hbuilderx-cli-gui.openSettings', () => {
			vscode.commands.executeCommand('workbench.action.openSettings', 'hbuilderx-cli-gui');
		}),

		vscode.commands.registerCommand('hbuilderx-cli-gui.openProject', async (folderUri?: vscode.Uri) => {
			const projectPath = getCurrentWorkspacePath(folderUri);
			if (projectPath) {
				runCliInTerminal(`open "${projectPath}"`, `打开项目 ${projectPath}`);
			} else {
				const selected = await vscode.window.showOpenDialog({
					canSelectFiles: false,
					canSelectFolders: true,
					canSelectMany: false,
					openLabel: '在 HBuilderX 中打开'
				});
				if (selected && selected.length > 0) {
					runCliInTerminal(`open "${selected[0].fsPath}"`, `打开项目 ${selected[0].fsPath}`);
				}
			}
		}),

		vscode.commands.registerCommand('hbuilderx-cli-gui.projectList', () => {
			runCliInTerminal('project list', '列出已导入项目');
		}),

		vscode.commands.registerCommand('hbuilderx-cli-gui.launchWeb', () => {
			const projectPath = getCurrentWorkspacePath();
			if (projectPath) {
				runCliInTerminal(`launch --project "${projectPath}" --platform web`, '运行到 Web');
			} else {
				vscode.window.showWarningMessage('请先在 VS Code 中打开一个工作区项目');
			}
		}),

		vscode.commands.registerCommand('hbuilderx-cli-gui.launchAndroid', () => {
			const projectPath = getCurrentWorkspacePath();
			if (projectPath) {
				runCliInTerminal(`launch --project "${projectPath}" --platform android`, '运行到 Android');
			} else {
				vscode.window.showWarningMessage('请先在 VS Code 中打开一个工作区项目');
			}
		}),

		// 发布命令
		vscode.commands.registerCommand('hbuilderx-cli-gui.publishWechat', () => {
			const projectPath = getCurrentWorkspacePath();
			if (projectPath) {
				runCliInTerminal(`publish --project "${projectPath}" --platform mp-weixin`, '发布到微信小程序');
			} else {
				vscode.window.showWarningMessage('请先在 VS Code 中打开一个工作区项目');
			}
		}),

		vscode.commands.registerCommand('hbuilderx-cli-gui.publishAlipay', () => {
			const projectPath = getCurrentWorkspacePath();
			if (projectPath) {
				runCliInTerminal(`publish --project "${projectPath}" --platform mp-alipay`, '发布到支付宝小程序');
			} else {
				vscode.window.showWarningMessage('请先在 VS Code 中打开一个工作区项目');
			}
		}),

		vscode.commands.registerCommand('hbuilderx-cli-gui.publishBaidu', () => {
			const projectPath = getCurrentWorkspacePath();
			if (projectPath) {
				runCliInTerminal(`publish --project "${projectPath}" --platform mp-baidu`, '发布到百度小程序');
			} else {
				vscode.window.showWarningMessage('请先在 VS Code 中打开一个工作区项目');
			}
		}),

		vscode.commands.registerCommand('hbuilderx-cli-gui.publishToutiao', () => {
			const projectPath = getCurrentWorkspacePath();
			if (projectPath) {
				runCliInTerminal(`publish --project "${projectPath}" --platform mp-toutiao`, '发布到抖音小程序');
			} else {
				vscode.window.showWarningMessage('请先在 VS Code 中打开一个工作区项目');
			}
		}),

		vscode.commands.registerCommand('hbuilderx-cli-gui.publishLark', () => {
			const projectPath = getCurrentWorkspacePath();
			if (projectPath) {
				runCliInTerminal(`publish --project "${projectPath}" --platform mp-lark`, '发布到飞书小程序');
			} else {
				vscode.window.showWarningMessage('请先在 VS Code 中打开一个工作区项目');
			}
		}),

		vscode.commands.registerCommand('hbuilderx-cli-gui.publishQQ', () => {
			const projectPath = getCurrentWorkspacePath();
			if (projectPath) {
				runCliInTerminal(`publish --project "${projectPath}" --platform mp-qq`, '发布到QQ小程序');
			} else {
				vscode.window.showWarningMessage('请先在 VS Code 中打开一个工作区项目');
			}
		}),

		vscode.commands.registerCommand('hbuilderx-cli-gui.publishKuaishou', () => {
			const projectPath = getCurrentWorkspacePath();
			if (projectPath) {
				runCliInTerminal(`publish --project "${projectPath}" --platform mp-kuaishou`, '发布到快手小程序');
			} else {
				vscode.window.showWarningMessage('请先在 VS Code 中打开一个工作区项目');
			}
		}),

		vscode.commands.registerCommand('hbuilderx-cli-gui.publishJD', () => {
			const projectPath = getCurrentWorkspacePath();
			if (projectPath) {
				runCliInTerminal(`publish --project "${projectPath}" --platform mp-jd`, '发布到京东小程序');
			} else {
				vscode.window.showWarningMessage('请先在 VS Code 中打开一个工作区项目');
			}
		}),

		vscode.commands.registerCommand('hbuilderx-cli-gui.publishH5', () => {
			const projectPath = getCurrentWorkspacePath();
			if (projectPath) {
				runCliInTerminal(`publish --project "${projectPath}" --platform h5`, '发布到 H5/Web');
			} else {
				vscode.window.showWarningMessage('请先在 VS Code 中打开一个工作区项目');
			}
		}),

		vscode.commands.registerCommand('hbuilderx-cli-gui.publishAppAndroid', () => {
			const projectPath = getCurrentWorkspacePath();
			if (projectPath) {
				runCliInTerminal(`publish --project "${projectPath}" --platform app-android`, '打包 App Android 资源');
			} else {
				vscode.window.showWarningMessage('请先在 VS Code 中打开一个工作区项目');
			}
		}),

		vscode.commands.registerCommand('hbuilderx-cli-gui.publishAppIos', () => {
			const projectPath = getCurrentWorkspacePath();
			if (projectPath) {
				runCliInTerminal(`publish --project "${projectPath}" --platform app-ios`, '打包 App iOS 资源');
			} else {
				vscode.window.showWarningMessage('请先在 VS Code 中打开一个工作区项目');
			}
		}),

		// 用户账户命令
		vscode.commands.registerCommand('hbuilderx-cli-gui.userLogin', () => {
			runCliInTerminal('user login', '用户登录');
		}),

		vscode.commands.registerCommand('hbuilderx-cli-gui.userLogout', () => {
			runCliInTerminal('user logout', '用户登出');
		}),

		vscode.commands.registerCommand('hbuilderx-cli-gui.userInfo', () => {
			runCliInTerminal('user info', '查看用户信息');
		})
	);
}

export function deactivate() {
	if (hbuilderTerminal) {
		hbuilderTerminal.dispose();
	}
}

