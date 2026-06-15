# 海创周 H5 · Cloudflare 部署指南

---

## 一、部署 Worker API（签到 + 留言后端）

### 1. 安装 Wrangler CLI
```bash
npm install -g wrangler
```

### 2. 登录 Cloudflare
```bash
wrangler login
```
浏览器会弹出授权确认。

### 3. 创建 D1 数据库
```bash
wrangler d1 create haichuangzhou
```
返回 JSON 里找到 `database_id`，粘贴到 `wrangler.toml` 里替换 `YOUR_DATABASE_ID_HERE`。

### 4. 初始化数据表
```bash
wrangler d1 execute haichuangzhou --file=worker/schema.sql
```

### 5. 部署 Worker
```bash
wrangler deploy
```
部署成功后会显示 `https://haichuangzhou-api.<你的账号>.workers.dev`。

### 6. 把 API 地址填入代码
`worker/api.js` 里的 `ALLOWED_ORIGINS` 已包含 `https://haichuangzhou.pages.dev`（Cloudflare Pages 默认域名）。
如果用自定义域名，追加进去即可。

`js/app.js` 里的 `API_BASE` 也更新为你的 Worker 地址：
```js
const API_BASE = 'https://haichuangzhou-api.你的账号.workers.dev';
```

---

## 二、上传 H5 静态页面

### 方案 A：Cloudflare Pages（推荐）
1. 登录 [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **创建应用程序** → **上传静态站点**
2. 选择 `~/Downloads/haichuangzhou/` 文件夹（不要上传 `worker` 和 `DEPLOY.md`）
3. 项目名称填 `haichuangzhou`
4. 部署完成，获得 `https://haichuangzhou.pages.dev`（或你绑定的自定义域名）

### 方案 B：GitHub + Cloudflare Pages 自动部署
1. 把 `~/Downloads/haichuangzhou/` 推到 GitHub 仓库
2. Cloudflare Pages 连接该仓库，**构建命令留空**，**输出目录**填 `/`
3. 每次 push 自动部署

---

## 三、配置 Worker 允许 H5 页面跨域

`worker/api.js` 的 `ALLOWED_ORIGINS` 数组里加上你的 H5 页面域名：
```js
const ALLOWED_ORIGINS = [
  'https://haichuangzhou.pages.dev',   // Cloudflare Pages
  'https://haichuangzhou.yourdomain.com',  // 自定义域名（如果有）
  'http://localhost:8787',
];
```
改完后重新 `wrangler deploy`。

---

## 四、完成后验证

打开 H5 页面：
1. 输入姓名签到 → 刷新页面，签到记录仍在 → ✅
2. 另一台手机打开同一页面 → 能看到刚才的签到 → ✅
3. 留言 → 刷新 → 留言仍在 → ✅

---

## 五、日常管理

- **查看签到数据**：`wrangler d1 execute haichuangzhou --command="SELECT * FROM checkins ORDER BY id DESC"`
- **查看留言**：`wrangler d1 execute haichuangzhou --command="SELECT * FROM messages ORDER BY id DESC"`
- **清空签到**：`wrangler d1 execute haichuangzhou --command="DELETE FROM checkins"`
- **重新部署 Worker**：`wrangler deploy`
- **重新部署 H5**：重新上传或 push 到 GitHub
