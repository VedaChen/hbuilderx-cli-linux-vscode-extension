import * as vscode from 'vscode';
import { VIEW_ID } from './config/constants';
import { HBuilderWebviewProvider } from './views/HBuilderWebviewProvider';
import { registerCommands } from './commands';
import { CliRunner } from './service/cliRunner';
import { UserService } from './service/userService';

/**
 * 插件激活入口
 */
export function activate(context: vscode.ExtensionContext): void {
	// 初始化用户会话状态
	UserService.init(context);

	// 1. 实例化并注册 Webview View Provider
	const provider = new HBuilderWebviewProvider(context.extensionUri, context);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(VIEW_ID.ACTIONS_VIEW, provider, {
			webviewOptions: {
				retainContextWhenHidden: true
			}
		})
	);

	// 2. 集中注册所有业务命令
	registerCommands(context, provider);
}

/**
 * 插件销毁与资源释放
 */
export function deactivate(): void {
	CliRunner.dispose();
}
