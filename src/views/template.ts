import * as path from 'path';
import { AppConfig } from '../config/config';
import { CliRunner } from '../service/cliRunner';
import { UserService } from '../service/userService';
import { HBuilderProject } from '../service/projectService';

export interface CommandItemMeta {
	id: string;
	name: string;
	badge: string;
	commandTemplate: string;
}

export const LAUNCH_PLATFORMS: CommandItemMeta[] = [
	{ id: 'web', name: '运行到浏览器 (Web)', badge: 'web', commandTemplate: 'launch web --project "__PROJECT__"' },
	{ id: 'app-android', name: 'Android 真机 / 模拟器', badge: 'app-android', commandTemplate: 'launch app-android --project "__PROJECT__"' },
	{ id: 'app-ios', name: 'iOS 真机 / 模拟器', badge: 'app-ios', commandTemplate: 'launch app-ios --project "__PROJECT__"' },
	{ id: 'app-harmony', name: '鸿蒙真机 / 模拟器', badge: 'app-harmony', commandTemplate: 'launch app-harmony --project "__PROJECT__"' },
	{ id: 'mp-weixin', name: '微信小程序', badge: 'mp-weixin', commandTemplate: 'launch mp-weixin --project "__PROJECT__"' },
	{ id: 'mp-alipay', name: '支付宝小程序', badge: 'mp-alipay', commandTemplate: 'launch mp-alipay --project "__PROJECT__"' },
	{ id: 'mp-toutiao', name: '抖音小程序', badge: 'mp-toutiao', commandTemplate: 'launch mp-toutiao --project "__PROJECT__"' },
	{ id: 'mp-baidu', name: '百度小程序', badge: 'mp-baidu', commandTemplate: 'launch mp-baidu --project "__PROJECT__"' },
	{ id: 'mp-kuaishou', name: '快手小程序', badge: 'mp-kuaishou', commandTemplate: 'launch mp-kuaishou --project "__PROJECT__"' },
	{ id: 'mp-lark', name: '飞书小程序', badge: 'mp-lark', commandTemplate: 'launch mp-lark --project "__PROJECT__"' },
	{ id: 'mp-xhs', name: '小红书小程序', badge: 'mp-xhs', commandTemplate: 'launch mp-xhs --project "__PROJECT__"' },
	{ id: 'mp-qq', name: 'QQ 小程序', badge: 'mp-qq', commandTemplate: 'launch mp-qq --project "__PROJECT__"' },
	{ id: 'mp-jd', name: '京东小程序', badge: 'mp-jd', commandTemplate: 'launch mp-jd --project "__PROJECT__"' },
	{ id: 'mp-360', name: '360 小程序', badge: 'mp-360', commandTemplate: 'launch mp-360 --project "__PROJECT__"' },
	{ id: 'mp-harmony', name: '鸿蒙元服务', badge: 'mp-harmony', commandTemplate: 'launch mp-harmony --project "__PROJECT__"' },
	{ id: 'quickapp-webview-huawei', name: '快应用 (华为)', badge: 'quickapp-webview-huawei', commandTemplate: 'launch quickapp-webview-huawei --project "__PROJECT__"' },
	{ id: 'quickapp-webview-union', name: '快应用 (联盟)', badge: 'quickapp-webview-union', commandTemplate: 'launch quickapp-webview-union --project "__PROJECT__"' }
];

export const PUBLISH_PLATFORMS: CommandItemMeta[] = [
	{ id: 'publish-h5', name: '网站 - PC Web 或 手机 H5', badge: 'publish h5', commandTemplate: 'publish h5 --project "__PROJECT__"' },
	{ id: 'publish-mp-weixin', name: '小程序 - 微信', badge: 'publish mp-weixin', commandTemplate: 'publish mp-weixin --project "__PROJECT__"' },
	{ id: 'publish-mp-alipay', name: '小程序 - 支付宝', badge: 'publish mp-alipay', commandTemplate: 'publish mp-alipay --project "__PROJECT__"' },
	{ id: 'publish-app-android-wgt', name: '制作应用 wgt 包 (Android)', badge: 'publish app-android --type wgt', commandTemplate: 'publish app-android --type wgt --project "__PROJECT__"' },
	{ id: 'publish-app-ios-wgt', name: '制作应用 wgt 包 (iOS)', badge: 'publish app-ios --type wgt', commandTemplate: 'publish app-ios --type wgt --project "__PROJECT__"' },
	{ id: 'publish-app-harmony-wgt', name: '制作应用 wgt 包 (鸿蒙)', badge: 'publish app-harmony --type wgt', commandTemplate: 'publish app-harmony --type wgt --project "__PROJECT__"' },
	{ id: 'publish-app-android-resource', name: '生成本地打包 App 资源 (Android)', badge: 'publish app-android --type appResource', commandTemplate: 'publish app-android --type appResource --project "__PROJECT__"' },
	{ id: 'publish-app-ios-resource', name: '生成本地打包 App 资源 (iOS)', badge: 'publish app-ios --type appResource', commandTemplate: 'publish app-ios --type appResource --project "__PROJECT__"' },
	{ id: 'publish-app-harmony-resource', name: '生成本地打包 App 资源 (鸿蒙)', badge: 'publish app-harmony --type appResource', commandTemplate: 'publish app-harmony --type appResource --project "__PROJECT__"' },
	{ id: 'pack-android', name: '原生 App - Android 云打包', badge: 'pack --platform android', commandTemplate: 'pack --platform android --project "__PROJECT__"' },
	{ id: 'pack-ios', name: '原生 App - iOS 云打包', badge: 'pack --platform ios', commandTemplate: 'pack --platform ios --project "__PROJECT__"' },
	{ id: 'pack-app-harmony', name: 'App - 鸿蒙本地打包', badge: 'pack app-harmony', commandTemplate: 'pack app-harmony --project "__PROJECT__"' },
	{ id: 'pack-mp-harmony', name: '鸿蒙元服务本地打包', badge: 'pack mp-harmony', commandTemplate: 'pack mp-harmony --project "__PROJECT__"' }
];

export const LOGCAT_PLATFORMS: CommandItemMeta[] = [
	{ id: 'logcat-pack', name: 'App 云打包日志追踪', badge: 'logcat pack', commandTemplate: 'logcat pack' },
	{ id: 'logcat-app-android', name: 'Android App 运行日志', badge: 'logcat app-android', commandTemplate: 'logcat app-android --project "__PROJECT__"' },
	{ id: 'logcat-app-ios', name: 'iOS App 运行日志', badge: 'logcat app-ios', commandTemplate: 'logcat app-ios --project "__PROJECT__"' },
	{ id: 'logcat-app-harmony', name: '鸿蒙 App 运行日志', badge: 'logcat app-harmony', commandTemplate: 'logcat app-harmony --project "__PROJECT__"' },
	{ id: 'logcat-mp-weixin', name: '微信小程序运行日志', badge: 'logcat mp-weixin', commandTemplate: 'logcat mp-weixin --project "__PROJECT__"' },
	{ id: 'logcat-web', name: 'Web / H5 运行日志', badge: 'logcat web', commandTemplate: 'logcat web --project "__PROJECT__"' },
	{ id: 'logcat-unicloud', name: 'uniCloud 云函数日志', badge: 'logcat unicloud', commandTemplate: 'logcat unicloud --project "__PROJECT__"' }
];

export const DEVICE_PLATFORMS: CommandItemMeta[] = [
	{ id: 'devices-list', name: '查看可用设备列表', badge: 'devices list', commandTemplate: 'devices list' },
	{ id: 'devices-list-android', name: '查看 Android 设备', badge: 'devices list --platform android', commandTemplate: 'devices list --platform android' },
	{ id: 'devices-list-ios', name: '查看 iOS 设备', badge: 'devices list --platform ios-iPhone', commandTemplate: 'devices list --platform ios-iPhone' },
	{ id: 'screencap-android', name: 'Android 设备截屏', badge: 'screencap app-android', commandTemplate: 'screencap app-android --project "__PROJECT__" --saveFile screenshot-android.png' },
	{ id: 'screencap-ios', name: 'iOS 设备截屏', badge: 'screencap app-ios', commandTemplate: 'screencap app-ios --project "__PROJECT__" --saveFile screenshot-ios.png' },
	{ id: 'screencap-web', name: 'Web 页面截屏', badge: 'screencap web', commandTemplate: 'screencap web --project "__PROJECT__" --saveFile screenshot-web.png' }
];

export const UNICLOUD_PLATFORMS: CommandItemMeta[] = [
	{ id: 'cloud-upload-all', name: '上传所有云函数与公共模块', badge: 'cloud functions --upload all', commandTemplate: 'cloud functions --upload all --prj "__PROJECT__" --provider aliyun' },
	{ id: 'cloud-list-space', name: '列举服务空间', badge: 'cloud functions --list space', commandTemplate: 'cloud functions --list space --prj "__PROJECT__" --provider aliyun' },
	{ id: 'cloud-list-functions', name: '列举项目云函数', badge: 'cloud functions --list cloudfunction', commandTemplate: 'cloud functions --list cloudfunction --prj "__PROJECT__" --provider aliyun' },
	{ id: 'cloud-list-db', name: '列举数据表 Schema', badge: 'cloud functions --list db', commandTemplate: 'cloud functions --list db --prj "__PROJECT__" --provider aliyun' }
];

export const MODULES_UTS_PLATFORMS: CommandItemMeta[] = [
	{ id: 'uni-modules-list', name: '查看已安装插件列表', badge: 'uni_modules --list', commandTemplate: 'uni_modules --list --project "__PROJECT_PATH__"' },
	{ id: 'uni-modules-help', name: 'uni_modules 帮助说明', badge: 'uni_modules --help', commandTemplate: 'uni_modules --help' },
	{ id: 'compile-uts-android', name: '编译 Android UTS 插件', badge: 'compile app-android', commandTemplate: 'compile app-android --project "__PROJECT__"' },
	{ id: 'compile-uts-ios', name: '编译 iOS UTS 插件', badge: 'compile app-ios', commandTemplate: 'compile app-ios --project "__PROJECT__"' }
];

export const ALL_COMMANDS: CommandItemMeta[] = [
	...LAUNCH_PLATFORMS,
	...PUBLISH_PLATFORMS,
	...LOGCAT_PLATFORMS,
	...DEVICE_PLATFORMS,
	...UNICLOUD_PLATFORMS,
	...MODULES_UTS_PLATFORMS
];

function renderCommandGrid(items: CommandItemMeta[]): string {
	return `
		<div class="launch-grid">
			${items.map((item) => `
				<button class="launch-btn" onclick="executeItem('${item.id}')" title="${item.name}">
					<div class="launch-name">${item.name}</div>
					<div class="launch-badge">${item.badge}</div>
				</button>
			`).join('')}
		</div>`;
}

export function getWebviewContent(projects: HBuilderProject[] = [], activeTarget?: string, activeTab = 'tab-projects'): string {
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
			padding: 2px 8px;
			border-radius: 4px;
			background: rgba(26, 159, 53, 0.2);
			color: var(--hx-primary-hover);
			font-weight: 500;
			cursor: pointer;
			transition: all 0.15s ease;
		}

		.header-tag:hover {
			background: rgba(26, 159, 53, 0.35);
			transform: scale(1.04);
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
			gap: 6px;
		}

		.account-info-row {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 8px;
		}

		.account-status-text {
			font-size: 12px;
			flex: 1;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.account-actions {
			display: flex;
			align-items: center;
			gap: 4px;
		}

		.mini-btn {
			padding: 2px 8px;
			font-size: 11px;
			border-radius: 4px;
		}

		.cli-path-box {
			font-size: 11px;
			color: var(--hx-text-muted);
			word-break: break-all;
			background: rgba(128, 128, 128, 0.08);
			padding: 5px 8px;
			border-radius: 4px;
			border: 1px solid rgba(128, 128, 128, 0.12);
			font-family: var(--vscode-editor-font-family, monospace);
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

		/* 全局目标项目栏 */
		.global-target-card {
			background: var(--hx-card-bg);
			border: 1px solid var(--hx-card-border);
			border-radius: 8px;
			padding: 8px 10px;
			display: flex;
			align-items: center;
			gap: 8px;
			margin-bottom: 10px;
		}

		.global-target-label {
			font-size: 11px;
			font-weight: 700;
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

		/* 分段标签导航栏 (Segmented Tabs) */
		.tabs-container {
			margin-bottom: 8px;
		}

		.tabs-nav {
			display: flex;
			gap: 4px;
			overflow-x: auto;
			padding-bottom: 4px;
			scrollbar-width: none;
		}

		.tabs-nav::-webkit-scrollbar {
			display: none;
		}

		.tab-item {
			padding: 5px 10px;
			font-size: 11px;
			font-weight: 500;
			border-radius: 6px;
			cursor: pointer;
			border: 1px solid var(--hx-card-border);
			background: rgba(128, 128, 128, 0.08);
			color: var(--vscode-foreground);
			transition: all 0.15s ease;
			white-space: nowrap;
			user-select: none;
		}

		.tab-item:hover {
			background: rgba(128, 128, 128, 0.16);
		}

		.tab-item.active {
			background-color: var(--hx-primary);
			color: #ffffff;
			border-color: var(--hx-primary);
			font-weight: 600;
		}

		/* 标签页内容面板 */
		.tab-pane {
			display: none;
		}

		.tab-pane.active {
			display: block;
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
		.project-list-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 4px 2px 8px;
			margin-bottom: 4px;
			border-bottom: 1px dashed var(--hx-card-border);
		}

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
			padding: 12px 8px;
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
		<span class="header-tag" onclick="sendAction('showGuide')" title="点击查看帮助与官方引导">Linux</span>
	</div>

	<!-- 1. 账号与全局配置模块（置顶常驻独立卡片） -->
	<div class="section-group">
		<div class="section-title">
			<span>账号与全局配置</span>
			<span class="link-btn" onclick="sendAction('openSettings')">设置</span>
		</div>
		<div class="card account-box">
			<div class="account-info-row">
				<div class="account-status-text">
					<strong>账号状态</strong>: ${isLoggedIn ? `<span style="color: var(--hx-primary-hover); font-weight: 600;" title="${currentUser}">已登录 (${currentUser})</span>` : '<span>未登录</span>'}
				</div>
				<div class="account-actions">
					<button class="mini-btn ${isLoggedIn ? 'disabled-btn' : ''}" onclick="handleLoginClick()" title="${isLoggedIn ? '当前账号已登录: ' + currentUser : '在侧边栏直接输入账号登录'}">
						登录
					</button>
					<button class="mini-btn" onclick="handleLogoutClick()" title="退出当前账号">
						登出
					</button>
				</div>
			</div>
			<div class="cli-path-box" title="${cliPath || '未配置 CLI 路径'}">
				${cliPath ? cliPath : `<span>未配置 CLI 路径，点击右上角【设置】进行配置。查看教程：</span><span class="link-btn" onclick="sendAction('openTutorial')">教程</span>`}
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

	<!-- 2. 全局目标工程选择栏 (单个统一选择器) -->
	<div class="global-target-card">
		<div class="global-target-label">目标工程:</div>
		<select id="global-target-select" class="hbx-select" onchange="handleTargetChange(this.value)">
			${projects.length === 0
				? `<option value="">(暂无已导入项目，请先打开项目)</option>`
				: projects.map((p) => {
						const isSelected = p.name === defaultTarget || (p.path && p.path === defaultTarget);
						return `<option value="${p.name}" ${isSelected ? 'selected' : ''}>${p.name}${p.type ? ' [' + p.type + ']' : ''}</option>`;
				  }).join('')
			}
		</select>
	</div>

	<!-- 3. 水平分段标签页导航 (Tabs) -->
	<div class="tabs-container">
		<div class="tabs-nav">
			<div class="tab-item ${activeTab === 'tab-projects' ? 'active' : ''}" onclick="switchTab('tab-projects', this)">项目 (${projects.length})</div>
			<div class="tab-item ${activeTab === 'tab-launch' ? 'active' : ''}" onclick="switchTab('tab-launch', this)">运行</div>
			<div class="tab-item ${activeTab === 'tab-publish' ? 'active' : ''}" onclick="switchTab('tab-publish', this)">发行</div>
			<div class="tab-item ${activeTab === 'tab-logcat' ? 'active' : ''}" onclick="switchTab('tab-logcat', this)">日志</div>
			<div class="tab-item ${activeTab === 'tab-devices' ? 'active' : ''}" onclick="switchTab('tab-devices', this)">设备</div>
			<div class="tab-item ${activeTab === 'tab-unicloud' ? 'active' : ''}" onclick="switchTab('tab-unicloud', this)">云开发</div>
			<div class="tab-item ${activeTab === 'tab-modules-uts' ? 'active' : ''}" onclick="switchTab('tab-modules-uts', this)">插件/UTS</div>
		</div>
	</div>

	<!-- 4. 标签页内容面板 (Tab Panels) -->
	<div class="tab-content-wrapper">
		<!-- 项目管理面板 -->
		<div id="tab-projects" class="tab-pane ${activeTab === 'tab-projects' ? 'active' : ''}">
			<div class="project-list-header">
				<span style="font-size: 11px; color: var(--hx-text-muted); font-weight: 600;">已导入工程列表</span>
				<div class="header-actions">
					<span class="link-btn" onclick="sendAction('executeAction', 'hbuilderx-cli-gui.openProject')" title="在 HBuilderX 中打开/导入项目">打开项目</span>
					<span class="link-btn" onclick="sendAction('refreshProjects')" title="重新拉取已导入的项目列表">刷新</span>
				</div>
			</div>
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

		<!-- 运行面板 -->
		<div id="tab-launch" class="tab-pane ${activeTab === 'tab-launch' ? 'active' : ''}">
			${renderCommandGrid(LAUNCH_PLATFORMS)}
		</div>

		<!-- 发行面板 -->
		<div id="tab-publish" class="tab-pane ${activeTab === 'tab-publish' ? 'active' : ''}">
			${renderCommandGrid(PUBLISH_PLATFORMS)}
		</div>

		<!-- 日志面板 -->
		<div id="tab-logcat" class="tab-pane ${activeTab === 'tab-logcat' ? 'active' : ''}">
			${renderCommandGrid(LOGCAT_PLATFORMS)}
		</div>

		<!-- 设备与截图面板 -->
		<div id="tab-devices" class="tab-pane ${activeTab === 'tab-devices' ? 'active' : ''}">
			${renderCommandGrid(DEVICE_PLATFORMS)}
		</div>

		<!-- uniCloud 云开发面板 -->
		<div id="tab-unicloud" class="tab-pane ${activeTab === 'tab-unicloud' ? 'active' : ''}">
			${renderCommandGrid(UNICLOUD_PLATFORMS)}
		</div>

		<!-- uni_modules 与 UTS 面板 -->
		<div id="tab-modules-uts" class="tab-pane ${activeTab === 'tab-modules-uts' ? 'active' : ''}">
			${renderCommandGrid(MODULES_UTS_PLATFORMS)}
		</div>
	</div>

	<script>
		const vscode = acquireVsCodeApi();
		const isLoggedIn = ${isLoggedIn ? 'true' : 'false'};
		const ALL_COMMANDS_MAP = ${JSON.stringify(ALL_COMMANDS)};

		function sendAction(command, action, extra) {
			vscode.postMessage({
				command: command,
				action: action,
				url: extra || (typeof action === 'string' && action.startsWith('http') ? action : undefined)
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

		function switchTab(tabId, el) {
			document.querySelectorAll('.tab-item').forEach(item => item.classList.remove('active'));
			if (el) el.classList.add('active');

			document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
			const targetPane = document.getElementById(tabId);
			if (targetPane) targetPane.classList.add('active');

			vscode.postMessage({
				command: 'selectTab',
				tab: tabId
			});
		}

		function executeItem(itemId) {
			const selectEl = document.getElementById('global-target-select');
			const targetVal = selectEl ? selectEl.value : '';
			const found = ALL_COMMANDS_MAP.find(item => item.id === itemId);
			if (found) {
				vscode.postMessage({
					command: 'executeGenericAction',
					template: found.commandTemplate,
					target: targetVal,
					title: found.name
				});
			}
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
