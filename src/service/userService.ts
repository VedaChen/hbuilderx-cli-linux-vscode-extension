import * as vscode from 'vscode';
import { CliRunner } from './cliRunner';

/**
 * 带有显式关闭按钮与步骤指示的自定义输入弹窗
 */
function promptInputBox(options: {
	title: string;
	step: number;
	totalSteps: number;
	prompt: string;
	placeholder: string;
	password?: boolean;
	validate?: (value: string) => string | undefined;
}): Promise<string | undefined> {
	return new Promise((resolve) => {
		const inputBox = vscode.window.createInputBox();
		inputBox.title = options.title;
		inputBox.step = options.step;
		inputBox.totalSteps = options.totalSteps;
		inputBox.prompt = options.prompt;
		inputBox.placeholder = options.placeholder;
		inputBox.password = options.password ?? false;
		// 严禁点击遮罩/失焦关闭，只能点击右上角 ❌ 按钮或按 Esc/Enter
		inputBox.ignoreFocusOut = true;

		// 右上角显式关闭按钮
		const closeBtn: vscode.QuickInputButton = {
			iconPath: new vscode.ThemeIcon('close'),
			tooltip: '关闭 / 取消'
		};
		inputBox.buttons = [closeBtn];

		let isResolved = false;

		inputBox.onDidTriggerButton((btn) => {
			if (btn === closeBtn) {
				if (!isResolved) {
					isResolved = true;
					inputBox.hide();
					resolve(undefined);
				}
			}
		});

		inputBox.onDidChangeValue((text) => {
			if (options.validate) {
				inputBox.validationMessage = options.validate(text);
			}
		});

		inputBox.onDidAccept(() => {
			const val = inputBox.value.trim();
			if (options.validate) {
				const errMsg = options.validate(val);
				if (errMsg) {
					inputBox.validationMessage = errMsg;
					return;
				}
			}
			if (!isResolved) {
				isResolved = true;
				inputBox.hide();
				resolve(val);
			}
		});

		inputBox.onDidHide(() => {
			if (!isResolved) {
				isResolved = true;
				resolve(undefined);
			}
			inputBox.dispose();
		});

		inputBox.show();
	});
}

export class UserService {
	private static _currentUser?: string;
	private static _context?: vscode.ExtensionContext;

	public static init(context: vscode.ExtensionContext): void {
		this._context = context;
		this._currentUser = context.globalState.get<string>('hbx_logged_in_user');
	}

	public static getCurrentUser(): string | undefined {
		return this._currentUser;
	}

	public static setCurrentUser(user?: string): void {
		this._currentUser = user;
		if (this._context) {
			this._context.globalState.update('hbx_logged_in_user', user);
		}
	}

	public static isLoggedIn(): boolean {
		return !!this._currentUser;
	}

	public static async login(onSuccess?: () => void): Promise<void> {
		// 如果当前已经登录，点击时提示已登录不可重复点，并提供退出选项
		if (this.isLoggedIn()) {
			const choice = await vscode.window.showInformationMessage(
				`当前账号 [${this._currentUser}] 已处于登录状态，无需重复登录。若需切换账号请先退出当前账号。`,
				'退出当前账号',
				'查看信息'
			);
			if (choice === '退出当前账号') {
				this.logout(onSuccess);
			} else if (choice === '查看信息') {
				this.getUserInfo();
			}
			return;
		}

		const username = await promptInputBox({
			title: 'HBuilderX 用户登录',
			step: 1,
			totalSteps: 2,
			prompt: '第 1/2 步：请输入 DCloud / HBuilderX 账号（邮箱 / 用户名 / 手机号）',
			placeholder: '例如：your_account@foxmail.com',
			validate: (value) => {
				return value && value.trim().length > 0 ? undefined : '账号不能为空';
			}
		});

		if (!username) {
			return;
		}

		const password = await promptInputBox({
			title: 'HBuilderX 用户登录',
			step: 2,
			totalSteps: 2,
			prompt: `第 2/2 步：请输入账号 [${username.trim()}] 的登录密码`,
			placeholder: '请输入密码',
			password: true,
			validate: (value) => {
				return value && value.length > 0 ? undefined : '密码不能为空';
			}
		});

		if (!password) {
			return;
		}

		const safePassword = password.replace(/"/g, '\\"');
		this.setCurrentUser(username.trim());
		if (onSuccess) {
			onSuccess();
		}
		CliRunner.runInTerminal(
			`user login --username "${username.trim()}" --password "${safePassword}"`,
			undefined,
			`用户登录 (${username.trim()})`
		);
	}

	public static loginWithCredentials(username: string, password: string, onSuccess?: () => void): void {
		const safePassword = password.replace(/"/g, '\\"');
		this.setCurrentUser(username.trim());
		if (onSuccess) {
			onSuccess();
		}
		CliRunner.runInTerminal(
			`user login --username "${username.trim()}" --password "${safePassword}"`,
			undefined,
			`用户登录 (${username.trim()})`
		);
	}

	public static logoutDirect(onSuccess?: () => void): void {
		this.setCurrentUser(undefined);
		if (onSuccess) {
			onSuccess();
		}
		CliRunner.runInTerminal('user logout', undefined, '用户登出');
	}

	public static async logout(onSuccess?: () => void): Promise<void> {
		this.logoutDirect(onSuccess);
	}

	public static getUserInfo(): void {
		CliRunner.runInTerminal('user info', undefined, '查看用户信息');
	}
}
