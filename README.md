# HBuilderX CLI GUI (VS Code 扩展)

可视化 HBuilderX CLI 操作工具，为在 VS Code / 开源 IDE 中进行 uni-app 开发提供一站式的图形化调试、构建与管理面板。

无需频繁切换 HBuilderX 界面，直接在 VS Code 侧边栏即可完成运行、打包、日志追踪、设备管理及云开发操作。

---

## ✨ 核心特性

- **多端运行与调试**：
  - 支持一键运行至 Web / 浏览器
  - 支持 Android、iOS、鸿蒙真机与模拟器
  - 支持全平台小程序（微信、支付宝、抖音、百度、快手、飞书、小红书、QQ、京东、360 等）
  - 支持华为 / 联盟快应用
- **发行与打包**：
  - 网站 / PC Web / 手机 H5 发行
  - 小程序发行（微信、支付宝等）
  - App 制作 wgt 升级包（Android / iOS / 鸿蒙）
  - 生成本地 App 打包资源
  - 原生 App 云打包（Android / iOS）及鸿蒙本地打包
- **实时日志追踪 (Logcat)**：
  - App 云打包进度与日志追踪
  - Android / iOS / 鸿蒙真机运行日志
  - 微信小程序与 Web 运行日志
  - uniCloud 云函数运行日志
- **设备管理与截屏**：
  - 设备列表检测（Android / iOS）
  - 快速截屏（Android / iOS / Web）
- **uniCloud 云开发支持**：
  - 一键上传所有云函数与公共模块
  - 列举服务空间、项目云函数与数据表 Schema
- **uni_modules & UTS 插件**：
  - 查看已安装插件列表与帮助说明
  - 编译 Android / iOS UTS 插件

---

## ⚙️ 配置说明

在 VS Code 设置中搜索 `hbuilderx-cli-gui`，或在 `settings.json` 中配置：

```json
{
  // HBuilderX CLI 绝对路径（例如：/opt/HBuilderX/cli 或 Windows 对应 cli 路径）
  "hbuilderx-cli-gui.cliPath": "",

  // 微信开发者工具 CLI / 可执行文件路径
  "hbuilderx-cli-gui.wechatDevToolsPath": ""
}
```

---

## 🚀 快速上手

1. 安装插件后，VS Code 左侧活动栏将出现 **HBuilderX CLI 控制台** 图标。
2. 点击图标展开控制面板，插件会自动扫描当前工作区中的 uni-app 项目。
3. 选择目标项目后，即可在面板中点击对应的运行、发行、日志等功能按钮。

---

## 📄 License

[MIT](LICENSE)
