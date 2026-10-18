# 飞书多维表格工作台

运行在飞书多维表格 **应用模式自定义插件容器** 中的原生 Web 页面。飞书只提供数据源和 iframe 承载，界面与数据加工全部由本项目前端完成。

## 启动

```bash
npm install
npm run dev
```

本地地址：`http://localhost:5173/`

生产构建：

```bash
npm run build
```

产物在 `dist/`，可部署到任意静态 HTTPS 托管。

## 填到飞书里的服务地址

应用模式路径：`添加组件 → 插件 → 更多 → 添加自定义插件 → 服务地址`

- 若飞书允许 HTTP 本地地址：填 `http://localhost:5173/`
- 更常见的情况是 **只接受 HTTPS**。飞书页面本身是 HTTPS，直接填 `http://localhost:5173/` 往往会被拦截。

最简单的 HTTPS 调试方式（无需改代码）：

```bash
npm run dev
npx cloudflared tunnel --url http://localhost:5173
```

把 cloudflared 输出的 `https://*.trycloudflare.com` 填进服务地址。也可以用 `npm run dev:https` 启动本机自签证书，或把 `dist/` 部署到 GitHub Pages / Cloudflare Pages 后再填正式 HTTPS 地址。

## 发布到飞书插件市场前

这个仓库是 **应用模式插件**（自定义 Web 页面），不是字段捷径、边栏、连接器或工作流节点。

发布前必须：

```bash
npm install
npm run build
```

官方托管会用 **Node v16.19.0 / npm 8.19.3** 执行 `npm install` 和 `npm run build`。本仓库已按官方应用插件模板固定为 Vite 3，并在 `package.json` 设置 `output: dist`。

如果是上传插件包 / 提交 GitHub 仓库，请带上构建后的 `dist/`。

不要把本仓库当成字段捷径（FaaS/公式）或工作流节点包去发，类型选错会直接发布失败。

## 如何验证读到了真实数据

1. 在飞书应用模式页面中打开该插件。
2. 顶部状态应显示 **已连接飞书**，而不是「未连接飞书插件环境」。
3. 左侧出现当前文档真实数据表名称。
4. 中间统计和底部列表应与多维表格中的字段、记录一致。
5. 浏览器直接打开 `http://localhost:5173/`（不经过飞书）必须显示「未连接飞书插件环境」，不会出现演示数据。
