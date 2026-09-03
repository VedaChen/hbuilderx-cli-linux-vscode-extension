import * as path from 'path';
import { AppConfig } from '../config/config';
import { CliRunner } from '../service/cliRunner';
import { UserService } from '../service/userService';
import { HBuilderProject } from '../service/projectService';

export interface LaunchPlatformMeta {
	id: string;
	name: string;
	badge: string;
}

export const LAUNCH_PLATFORMS: LaunchPlatformMeta[] = [
	{ id: 'web', name: '运行到浏览器 (Web)', badge: 'web' },
	{ id: 'mp-weixin', name: '微信小程序模拟器', badge: 'mp-weixin' },
	{ id: 'mp-alipay', name: '支付宝小程序模拟器', badge: 'mp-alipay' },
	{ id: 'mp-toutiao', name: '抖音小程序模拟器', badge: 'mp-toutiao' },
	{ id: 'mp-baidu', name: '百度小程序模拟器', badge: 'mp-baidu' },
	{ id: 'app-android', name: 'Android 真机 / 模拟器', badge: 'app-android' },
	{ id: 'app-ios', name: 'iOS 真机 / 模拟器', badge: 'app-ios' }
];

export function getWebviewContent(projects: HBuilderProject[] = [], activeTarget?: string): string {
	const cliPath = AppConfig.getCliPath();
	const currentUser = UserService.getCurrentUser();
	const isLoggedIn = UserService.isLoggedIn();

	const currentWorkspace = CliRunner.getCurrentWorkspacePath();
	const workspaceBaseName = currentWorkspace ? path.basename(currentWorkspace) : '';
	const matchedProj = projects.find((p) => p.name === workspaceBaseName || (p.path && p.path.includes(workspaceBaseName)));
	const defaultTarget = activeTarget || matchedProj?.path || matchedProj?.name || projects[0]?.path || projects[0]?.name || '';

	return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>HBuilderX CLI 控制台</title>
	<style>
		:root {
			--hx-primary: #1A9F35;
			--hx-primary-hover: #22C55E;
			--hx-primary-bg: rgba(26, 159, 53, 0.12);
			--hx-card-bg: var(--vscode-editor-background);
			--hx-card-border: var(--vscode-widget-border, rgba(128, 128, 128, 0.2));
			--hx-text-muted: var(--vscode-descriptionForeground, #888);
		}

		* {
			box-sizing: border-box;
			margin: 0;
			padding: 0;
			user-select: none;
		}

		body {
			font-family: var(--vscode-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif);
			font-size: var(--vscode-font-size, 13px);
			color: var(--vscode-foreground);
			background-color: transparent;
			padding: 12px 10px 24px;
			line-height: 1.4;
		}

		/* 顶部概览卡片（严格遵守 .geminirules 规范） */
		.header-card {
			background: var(--hx-primary-bg);
			border: 1px solid rgba(26, 159, 53, 0.3);
			border-radius: 8px;
			padding: 10px 12px;
			margin-bottom: 12px;
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		.header-title {
			display: flex;
			align-items: center;
			gap: 8px;
			font-weight: 600;
			font-size: 14px;
			color: var(--hx-primary-hover);
		}

		.header-logo {
			width: 20px;
			height: 20px;
			fill: var(--hx-primary);
		}

		.header-tag {
			font-size: 11px;
			padding: 2px 6px;
			border-radius: 4px;
			background: rgba(26, 159, 53, 0.2);
			color: var(--hx-primary-hover);
			font-weight: normal;
		}

		/* 通用模块样式 */
		.section-group {
			margin-bottom: 12px;
		}

		.section-title {
			font-size: 11px;
			font-weight: 700;
			text-transform: uppercase;
			letter-spacing: 0.6px;
			color: var(--hx-text-muted);
			margin-bottom: 8px;
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		/* 卡片面板 */
		.card {
			background-color: var(--hx-card-bg);
			border: 1px solid var(--hx-card-border);
			border-radius: 8px;
			padding: 10px;
			box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
		}

		/* 用户与配置模块 */
		.account-box {
			display: flex;
			flex-direction: column;
			gap: 8px;
		}

		.account-info {
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 12px;
			padding-bottom: 6px;
			border-bottom: 1px dashed var(--hx-card-border);
		}

		.cli-path-box {
			font-size: 11px;
			color: var(--hx-text-muted);
			word-break: break-all;
			background: rgba(128, 128, 128, 0.08);
			padding: 6px 8px;
			border-radius: 4px;
			border: 1px solid rgba(128, 128, 128, 0.12);
			font-family: var(--vscode-editor-font-family, monospace);
		}

		.btn-row {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 6px;
		}

		/* 折叠面板 (Accordion Details) */
		details.accordion-group {
			background-color: var(--hx-card-bg);
			border: 1px solid var(--hx-card-border);
			border-radius: 8px;
			margin-bottom: 10px;
			overflow: hidden;
		}

		summary.accordion-header {
			padding: 8px 12px;
			font-size: 12px;
			font-weight: 600;
			cursor: pointer;
			display: flex;
			align-items: center;
			justify-content: space-between;
			user-select: none;
			background: rgba(128, 128, 128, 0.04);
			border-bottom: 1px solid transparent;
			transition: background 0.15s ease;
			outline: none;
		}

		summary.accordion-header:hover {
			background: rgba(128, 128, 128, 0.09);
		}

		details[open] > summary.accordion-header {
			border-bottom-color: var(--hx-card-border);
			background: rgba(128, 128, 128, 0.08);
		}

		.accordion-content {
			padding: 10px;
		}

		.header-actions {
			display: flex;
			align-items: center;
			gap: 8px;
		}

		.link-btn {
			cursor: pointer;
			color: var(--hx-primary-hover);
			font-size: 11px;
			font-weight: normal;
			transition: opacity 0.15s ease;
		}

		.link-btn:hover {
			opacity: 0.8;
			text-decoration: underline;
		}

		/* 按钮设计（默认原生灰质感） */
		button {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			gap: 4px;
			font-size: 12px;
			font-family: inherit;
			padding: 6px 10px;
			border: 1px solid var(--vscode-button-border, transparent);
			border-radius: 6px;
			cursor: pointer;
			background-color: var(--vscode-button-secondaryBackground, rgba(128, 128, 128, 0.15));
			color: var(--vscode-button-secondaryForeground, var(--vscode-foreground));
			transition: all 0.15s ease;
			text-align: center;
			white-space: nowrap;
		}

		button:hover {
			background-color: var(--vscode-button-secondaryHoverBackground, rgba(128, 128, 128, 0.25));
			transform: translateY(-1px);
		}

		button:active {
			transform: translateY(0);
		}

		button.primary-btn {
			background-color: var(--hx-primary);
			color: #ffffff;
			font-weight: 500;
		}

		button.primary-btn:hover {
			background-color: var(--hx-primary-hover);
		}

		button.danger-btn {
			background-color: rgba(239, 68, 68, 0.18);
			border: 1px solid rgba(239, 68, 68, 0.4);
			color: #ef4444;
		}

		button.danger-btn:hover {
			background-color: #ef4444;
			color: #ffffff;
		}

		button.disabled-btn {
			opacity: 0.55;
			cursor: not-allowed;
		}

		/* 已导入项目列表项（纯净列表展示） */
		.imported-card {
			background: rgba(128, 128, 128, 0.06);
			border: 1px solid var(--hx-card-border);
			border-radius: 6px;
			padding: 8px 10px;
			margin-bottom: 6px;
		}

		.proj-item-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		.proj-item-title {
			font-weight: 600;
			font-size: 12px;
			color: var(--vscode-foreground);
		}

		.remove-btn {
			font-size: 11px;
			padding: 2px 8px;
			border-radius: 4px;
			cursor: pointer;
			background-color: rgba(239, 68, 68, 0.12);
			border: 1px solid rgba(239, 68, 68, 0.3);
			color: #ef4444;
			transition: all 0.15s ease;
		}

		.remove-btn:hover {
			background-color: #ef4444;
			color: #ffffff;
		}

		.empty-hint {
			font-size: 11px;
			color: var(--hx-text-muted);
			text-align: center;
			padding: 8px;
		}

		/* 目标选择器与运行平台卡片 */
		.target-select-box {
			display: flex;
			align-items: center;
			gap: 8px;
			margin-bottom: 10px;
			background: rgba(128, 128, 128, 0.06);
			padding: 6px 10px;
			border-radius: 6px;
			border: 1px solid var(--hx-card-border);
		}

		.target-label {
			font-size: 11px;
			font-weight: 600;
			color: var(--hx-text-muted);
			white-space: nowrap;
		}

		.hbx-select {
			flex: 1;
			background-color: var(--vscode-dropdown-background, var(--hx-card-bg));
			color: var(--vscode-dropdown-foreground, var(--vscode-foreground));
			border: 1px solid var(--vscode-dropdown-border, var(--hx-card-border));
			border-radius: 4px;
			padding: 4px 6px;
			font-size: 12px;
			outline: none;
			cursor: pointer;
		}

		.hbx-select:focus {
			border-color: var(--hx-primary-hover);
		}

		.launch-grid {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 6px;
		}

		.launch-btn {
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			padding: 8px 10px;
			border-radius: 6px;
			background-color: var(--hx-card-bg);
			border: 1px solid var(--hx-card-border);
			color: var(--vscode-foreground);
			cursor: pointer;
			transition: all 0.15s ease;
			text-align: left;
			width: 100%;
		}

		.launch-btn:hover {
			border-color: var(--hx-primary);
			background-color: var(--hx-primary-bg);
			transform: translateY(-1px);
		}

		.launch-name {
			font-size: 12px;
			font-weight: 500;
		}

		.launch-badge {
			font-size: 10px;
			color: var(--hx-text-muted);
			margin-top: 2px;
		}

		/* 内嵌表单与确认框 */
		.inline-box {
			background: rgba(128, 128, 128, 0.08);
			border: 1px solid var(--hx-card-border);
			border-radius: 6px;
			padding: 8px 10px;
			margin-top: 8px;
			display: flex;
			flex-direction: column;
			gap: 6px;
		}

		.inline-title {
			font-size: 11px;
			font-weight: 600;
			color: var(--vscode-foreground);
		}

		.hbx-input {
			width: 100%;
			padding: 6px 8px;
			border: 1px solid var(--vscode-input-border, rgba(128, 128, 128, 0.3));
			background-color: var(--vscode-input-background, transparent);
			color: var(--vscode-input-foreground, inherit);
			border-radius: 4px;
			font-size: 12px;
			outline: none;
		}

		.hbx-input:focus {
			border-color: var(--hx-primary-hover);
		}

		.inline-actions {
			display: flex;
			gap: 6px;
			justify-content: flex-end;
			margin-top: 4px;
		}
	</style>
</head>
<body>

	<!-- 顶部标题徽标（严格遵守 .geminirules 规范） -->
	<div class="header-card">
		<div class="header-title">
			<svg class="header-logo" viewBox="0 0 24 24">
				<path d="M 2 2 L 22 2 L 20 19 L 12 22 L 4 19 Z M 7 6.5 V 17 H 9.5 V 13 H 14.5 V 17 H 17 V 6.5 H 14.5 V 10.5 H 9.5 V 6.5 Z"/>
			</svg>
			<span>HBuilderX CLI</span>
		</div>
		<span class="header-tag">Linux</span>
	</div>

	<!-- 1. 账号与全局配置模块（置顶常驻独立卡片） -->
	<div class="section-group">
		<div class="section-title">
			<span>账号与全局配置</span>
			<span class="link-btn" onclick="sendAction('openSettings')">设置</span>
		</div>
		<div class="card account-box">
			<div class="account-info">
				<span><strong>账号状态</strong>: ${isLoggedIn ? `<span style="color: var(--hx-primary-hover); font-weight: 600;" title="${currentUser}">已登录 (${currentUser})</span>` : '<span>未登录</span>'}</span>
			</div>
			<div class="cli-path-box" title="${cliPath}">
				${cliPath}
			</div>
			<div class="btn-row">
				<button class="${isLoggedIn ? 'disabled-btn' : ''}" onclick="handleLoginClick()" title="${isLoggedIn ? '当前账号已登录: ' + currentUser : '在侧边栏直接输入账号登录'}">
					登录
				</button>
				<button onclick="handleLogoutClick()">
					登出
				</button>
			</div>

			<!-- 内嵌登录输入表单 -->
			<div id="inline-login-box" class="inline-box" style="display: none;">
				<div class="inline-title">HBuilderX 账号登录</div>
				<input id="login-username-input" class="hbx-input" type="text" placeholder="邮箱 / 用户名 / 手机号" />
				<input id="login-password-input" class="hbx-input" type="password" placeholder="请输入密码" />
				<div class="inline-actions">
					<button onclick="toggleLoginForm(false)">取消</button>
					<button class="primary-btn" onclick="submitInlineLogin()">确认登录</button>
				</div>
			</div>

			<!-- 内嵌登出确认框 -->
			<div id="inline-logout-box" class="inline-box" style="display: none;">
				<div class="inline-title">确定要退出当前账号？</div>
				<div class="inline-actions">
					<button onclick="toggleLogoutConfirm(false)">取消</button>
					<button class="danger-btn" onclick="submitInlineLogout()">确认登出</button>
				</div>
			</div>
		</div>
	</div>

	<!-- 2. 项目列表 (默认展开显示列表，右上角附带打开项目按钮) -->
	<details class="accordion-group" open>
		<summary class="accordion-header">
			<span>项目 (${projects.length})</span>
			<div class="header-actions">
				<span class="link-btn" onclick="event.stopPropagation(); sendAction('executeAction', 'hbuilderx-cli-gui.openProject')" title="在 HBuilderX 中打开/导入项目">打开项目</span>
				<span class="link-btn" onclick="event.stopPropagation(); sendAction('refreshProjects')" title="重新拉取已导入的项目列表">刷新</span>
			</div>
		</summary>
		<div class="accordion-content">
			${
				projects.length === 0
					? `<div class="empty-hint">暂无已导入项目，点击右上角【打开项目】即可导入</div>`
					: projects
							.map(
								(p) => `
				<div class="imported-card">
					<div class="proj-item-header">
						<span class="proj-item-title">${p.name}</span>
						<button class="remove-btn" onclick="removeProject(event, '${p.name}', '${p.path || ''}')" title="从 HBuilderX 中移除工程">移除</button>
					</div>
				</div>`
							)
							.join('')
			}
		</div>
	</details>

	<!-- 3. 运行与本地调试 (Run / Dev) -->
	<details class="accordion-group" open>
		<summary class="accordion-header">
			<span>运行与本地调试 (Run / Dev)</span>
		</summary>
		<div class="accordion-content">
			<!-- 目标工程选择器 -->
			<div class="target-select-box">
				<div class="target-label">目标项目:</div>
				<select id="target-project-select" class="hbx-select" onchange="handleTargetChange(this.value)">
					${projects.length === 0
						? `<option value="">(暂无已导入项目，请先打开项目)</option>`
						: projects.map((p) => {
								const val = p.path || p.name;
								const isSelected = val === defaultTarget || p.name === defaultTarget;
								return `<option value="${val}" ${isSelected ? 'selected' : ''}>${p.name}${p.type ? ' [' + p.type + ']' : ''}</option>`;
						  }).join('')
					}
				</select>
			</div>

			<!-- 运行平台网格 -->
			<div class="launch-grid">
				${LAUNCH_PLATFORMS.map((platform) => `
					<button class="launch-btn" onclick="launchTarget('${platform.id}')" title="运行到 ${platform.name}">
						<div class="launch-name">${platform.name}</div>
						<div class="launch-badge">${platform.badge}</div>
					</button>
				`).join('')}
			</div>
		</div>
	</details>

	<script>
		const vscode = acquireVsCodeApi();
		const isLoggedIn = ${isLoggedIn ? 'true' : 'false'};

		function sendAction(command, action) {
			vscode.postMessage({
				command: command,
				action: action
			});
		}

		function handleLoginClick() {
			if (isLoggedIn) {
				toggleLogoutConfirm(true);
				return;
			}
			toggleLoginForm(true);
		}

		function handleLogoutClick() {
			toggleLogoutConfirm(true);
		}

		function toggleLoginForm(show) {
			document.getElementById('inline-login-box').style.display = show ? 'flex' : 'none';
			if (show) {
				document.getElementById('inline-logout-box').style.display = 'none';
				document.getElementById('login-username-input').focus();
			}
		}

		function toggleLogoutConfirm(show) {
			document.getElementById('inline-logout-box').style.display = show ? 'flex' : 'none';
			if (show) {
				document.getElementById('inline-login-box').style.display = 'none';
			}
		}

		function submitInlineLogin() {
			const username = document.getElementById('login-username-input').value.trim();
			const password = document.getElementById('login-password-input').value;
			if (!username || !password) {
				alert('请输入完整的账号和密码');
				return;
			}
			vscode.postMessage({
				command: 'loginCredentials',
				username: username,
				password: password
			});
			toggleLoginForm(false);
		}

		function submitInlineLogout() {
			vscode.postMessage({
				command: 'confirmLogout'
			});
			toggleLogoutConfirm(false);
		}

		function removeProject(event, projectName, projectPath) {
			if (event) {
				event.stopPropagation();
			}
			vscode.postMessage({
				command: 'closeProject',
				projectName: projectName,
				projectPath: projectPath
			});
		}

		function launchTarget(platformId) {
			const selectEl = document.getElementById('target-project-select');
			const targetVal = selectEl ? selectEl.value : '';
			if (!targetVal) {
				alert('请先导入或选择一个目标项目');
				return;
			}
			vscode.postMessage({
				command: 'launchProject',
				target: targetVal,
				platform: platformId
			});
		}

		function handleTargetChange(val) {
			vscode.postMessage({
				command: 'selectTargetProject',
				target: val
			});
		}
	</script>
</body>
</html>`;
}
