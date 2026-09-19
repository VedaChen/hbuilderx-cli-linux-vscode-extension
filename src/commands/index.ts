import * as vscode from 'vscode';
import { COMMAND_ID } from '../config/constants';
import { UserService } from '../service/userService';
import { ProjectService } from '../service/projectService';
import { PublishService } from '../service/publishService';
import { HBuilderWebviewProvider } from '../views/HBuilderWebviewProvider';

export function registerCommands(context: vscode.ExtensionContext, provider: HBuilderWebviewProvider): void {
	context.subscriptions.push(
		// 基础控制
		vscode.commands.registerCommand(COMMAND_ID.REFRESH, () => {
			provider.refresh();
		}),

		vscode.commands.registerCommand(COMMAND_ID.OPEN_SETTINGS, () => {
			vscode.commands.executeCommand('workbench.action.openSettings', 'hbuilderx-cli-gui');
		}),

		// 项目操作
		vscode.commands.registerCommand(COMMAND_ID.OPEN_PROJECT, (folderUri?: vscode.Uri) => {
			return ProjectService.openProject(folderUri, () => provider.refreshProjects());
		}),

		vscode.commands.registerCommand(COMMAND_ID.PROJECT_LIST, () => {
			return ProjectService.listProjects();
		}),

		vscode.commands.registerCommand(COMMAND_ID.LAUNCH_WEB, () => {
			ProjectService.launchWeb();
		}),

		vscode.commands.registerCommand(COMMAND_ID.LAUNCH_ANDROID, () => {
			ProjectService.launchAndroid();
		}),

		// 发布操作
		vscode.commands.registerCommand(COMMAND_ID.PUBLISH_WECHAT, () => {
			PublishService.publish('mp-weixin', '微信小程序');
		}),

		vscode.commands.registerCommand(COMMAND_ID.PUBLISH_ALIPAY, () => {
			PublishService.publish('mp-alipay', '支付宝小程序');
		}),

		vscode.commands.registerCommand(COMMAND_ID.PUBLISH_BAIDU, () => {
			PublishService.publish('mp-baidu', '百度小程序');
		}),

		vscode.commands.registerCommand(COMMAND_ID.PUBLISH_TOUTIAO, () => {
			PublishService.publish('mp-toutiao', '抖音小程序');
		}),

		vscode.commands.registerCommand(COMMAND_ID.PUBLISH_LARK, () => {
			PublishService.publish('mp-lark', '飞书小程序');
		}),

		vscode.commands.registerCommand(COMMAND_ID.PUBLISH_QQ, () => {
			PublishService.publish('mp-qq', 'QQ 小程序');
		}),

		vscode.commands.registerCommand(COMMAND_ID.PUBLISH_KUAISHOU, () => {
			PublishService.publish('mp-kuaishou', '快手小程序');
		}),

		vscode.commands.registerCommand(COMMAND_ID.PUBLISH_JD, () => {
			PublishService.publish('mp-jd', '京东小程序');
		}),

		vscode.commands.registerCommand(COMMAND_ID.PUBLISH_H5, () => {
			PublishService.publish('h5', 'H5 / Web');
		}),

		vscode.commands.registerCommand(COMMAND_ID.PUBLISH_APP_ANDROID, () => {
			PublishService.publish('app-android', 'App Android 资源');
		}),

		vscode.commands.registerCommand(COMMAND_ID.PUBLISH_APP_IOS, () => {
			PublishService.publish('app-ios', 'App iOS 资源');
		}),

		// 用户账号
		vscode.commands.registerCommand(COMMAND_ID.USER_LOGIN, () => {
			return UserService.login(() => provider.refresh(false));
		}),

		vscode.commands.registerCommand(COMMAND_ID.USER_LOGOUT, () => {
			return UserService.logout(() => provider.refresh(false));
		}),

		vscode.commands.registerCommand(COMMAND_ID.USER_INFO, () => {
			UserService.getUserInfo();
		})
	);
}
