import * as vscode from 'vscode';
import { CONFIG_SECTION } from './constants';

export class AppConfig {
	private static get config(): vscode.WorkspaceConfiguration {
		return vscode.workspace.getConfiguration(CONFIG_SECTION);
	}

	public static getCliPath(): string {
		return this.config.get<string>('cliPath') || '/home/momo/repository/HBuilderX/cli';
	}

	public static getWechatDevToolsPath(): string {
		return this.config.get<string>('wechatDevToolsPath') || '';
	}
}
