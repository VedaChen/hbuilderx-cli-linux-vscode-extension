# HBuilderX CLI GUI (VS Code Extension)

HBuilderX Linux CLI 可视化操作与工程管理扩展，让您在 VS Code 中无缝调用 DCloud HBuilderX CLI 工具链。

## 功能特性 (Features)

- **工程管理**：一键导入 VS Code 当前工作区或指定目录到 HBuilderX，多项目快速切换与管理。
- **全平台编译与运行**：支持 Web / H5、Android、iOS、鸿蒙以及各大平台小程序（微信、支付宝、抖音、百度等）的一键调试与运行。
- **项目发行与打包**：提供 H5 发行、各端小程序发行、wgt 制作与 App 原生打包等完整流程。
- **uni_modules 插件市场与安装**：内置 DCloud 插件市场与 UTS 模块支持，支持普通安装与 `--force` 强制安装。
- **用户账号管理**：支持与 HBuilderX CLI 鉴权状态双向同步，提供登录、登出及状态检测。
- **云开发与日志**：支持 uniCloud 云函数操作、数据表管理及运行日志实时捕获。

## 环境要求 (Requirements)

- 已安装 HBuilderX 4.0+ 或 5.0+（支持 Linux CLI）。
- 配置 HBuilderX CLI 绝对路径（例如 `/opt/HBuilderX/cli` 或 `/home/username/repository/HBuilderX/cli`）。

## 配置项 (Extension Settings)

- `hbuilderx-cli-gui.cliPath`: HBuilderX CLI 可执行文件的绝对路径。
- `hbuilderx-cli-gui.wechatDevToolsPath`: 微信开发者工具可执行文件路径（可选）。

## 协议 (License)

MIT License

