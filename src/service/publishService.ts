import * as vscode from 'vscode';
import { CliRunner } from './cliRunner';

export type PublishPlatform =
	| 'mp-weixin'
	| 'mp-alipay'
	| 'mp-baidu'
	| 'mp-toutiao'
	| 'mp-lark'
	| 'mp-qq'
	| 'mp-kuaishou'
	| 'mp-jd'
	| 'web'
	| 'h5'
	| 'app-android'
	| 'app-ios';

export class PublishService {
	public static publish(platform: PublishPlatform, platformName: string): void {
		const projectPath = CliRunner.getCurrentWorkspacePath();
		if (!projectPath) {
			vscode.window.showWarningMessage('请先在 VS Code 中打开一个工作区项目');
			return;
		}

		let args = '';
		if (platform === 'h5' || platform === 'web') {
			args = 'publish --platform h5 --project __PROJECT_PATH__';
		} else if (platform === 'app-android') {
			args = 'publish --platform app-android --project __PROJECT_PATH__';
		} else if (platform === 'app-ios') {
			args = 'publish --platform app-ios --project __PROJECT_PATH__';
		} else {
			args = `publish --platform ${platform} --project __PROJECT_PATH__`;
		}

		CliRunner.runInTerminal(args, projectPath, `发布到 ${platformName}`);
	}
}
