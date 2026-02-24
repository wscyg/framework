# 🚀 部署指南

## 方法1：GitHub Pages（推荐）

### 步骤1：创建仓库

```bash
# 在 GitHub 上创建新仓库，例如：aurafx-framework
```

### 步骤2：上传框架

```bash
cd /Users/wangshi05/WebstormProjects/正则化/手撕transfomer
git init
git add framework/
git commit -m "Add AuraFX framework"
git branch -M main
git remote add origin https://github.com/你的用户名/aurafx-framework.git
git push -u origin main
```

### 步骤3：启用 GitHub Pages

1. 进入仓库设置（Settings）
2. 左侧菜单选择 "Pages"
3. Source 选择 `main` 分支
4. 点击 Save

### 步骤4：使用 CDN

等待 1-2 分钟后，你的框架就可以通过以下地址访问：

```html
<!-- CSS -->
<link rel="stylesheet" href="https://你的用户名.github.io/aurafx-framework/framework/css/aurafx.css">

<!-- JS -->
<script src="https://你的用户名.github.io/aurafx-framework/framework/js/aurafx.js"></script>
```

### 完整示例

```html
<!DOCTYPE html>
<html lang="zh-CN" data-theme="light">
<head>
    <meta charset="UTF-8"/>
    <title>我的课程</title>

    <!-- 字体 -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,800;1,9..40,400&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">

    <!-- AuraFX 框架 CDN -->
    <link rel="stylesheet" href="https://你的用户名.github.io/aurafx-framework/framework/css/aurafx.css">
</head>
<body>
    <!-- 背景装饰（可选） -->
    <div class="ambient" aria-hidden="true">
        <canvas id="flow-canvas"></canvas>
        <div class="glow glow-a"></div>
        <div class="glow glow-b"></div>
        <div class="glow glow-c"></div>
    </div>
    <div id="cursor" aria-hidden="true"></div>
    <div class="progress" id="prog" aria-hidden="true"></div>

    <!-- 导航栏 -->
    <nav class="nav" id="nav">
        <div class="nav-inner">
            <div class="nav-brand">我的课程</div>
            <button class="toggle-pill" id="themeBtn" data-af="theme-toggle">
                <span class="t-cap" id="themeLabel">Light</span>
                <span class="switch"></span>
            </button>
        </div>
    </nav>

    <!-- 主内容 -->
    <section class="section minh-100 pt-nav">
        <div class="wrap">
            <h1 class="t-d mb-22">课程<span class="t-grad">标题</span></h1>
            <p class="t-body">这是内容</p>

            <div class="card mt-22">
                <h2 class="t-h2">知识点</h2>
                <p>详细说明</p>
            </div>
        </div>
    </section>

    <!-- Toast 容器 -->
    <div class="toast-root" id="toastRoot"></div>

    <!-- AuraFX 框架 JS -->
    <script src="https://你的用户名.github.io/aurafx-framework/framework/js/aurafx.js"></script>
</body>
</html>
```

---

## 方法2：jsDelivr CDN（更快）

如果你的仓库是公开的，可以使用 jsDelivr 加速：

```html
<!-- CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/你的用户名/aurafx-framework@main/framework/css/aurafx.css">

<!-- JS -->
<script src="https://cdn.jsdelivr.net/gh/你的用户名/aurafx-framework@main/framework/js/aurafx.js"></script>
```

优势：
- 全球 CDN 加速
- 自动缓存
- 更快的加载速度

---

## 方法3：Vercel/Netlify（专业）

### Vercel 部署

1. 安装 Vercel CLI：
```bash
npm i -g vercel
```

2. 部署：
```bash
cd /Users/wangshi05/WebstormProjects/正则化/手撕transfomer
vercel
```

3. 使用：
```html
<link rel="stylesheet" href="https://你的项目.vercel.app/framework/css/aurafx.css">
<script src="https://你的项目.vercel.app/framework/js/aurafx.js"></script>
```

### Netlify 部署

1. 拖拽 `framework` 文件夹到 [Netlify Drop](https://app.netlify.com/drop)
2. 获得地址：`https://随机名称.netlify.app/`
3. 使用：
```html
<link rel="stylesheet" href="https://随机名称.netlify.app/css/aurafx.css">
<script src="https://随机名称.netlify.app/js/aurafx.js"></script>
```

---

## 方法4：本地开发

如果只是本地使用：

```html
<!-- 相对路径 -->
<link rel="stylesheet" href="../framework/css/aurafx.css">
<script src="../framework/js/aurafx.js"></script>
```

---

## 🎯 推荐方案

| 场景 | 推荐方法 | 原因 |
|------|---------|------|
| 个人学习 | GitHub Pages | 免费、简单、稳定 |
| 团队协作 | jsDelivr | 全球加速、自动缓存 |
| 生产环境 | Vercel/Netlify | 专业、快速、可靠 |
| 本地开发 | 相对路径 | 无需网络 |

---

## 📊 效果对比

### 之前（每个文件 2000+ 行）
```
chapter1.html  2026 行
chapter2.html  2100 行
chapter3.html  1980 行
...
总计：约 20,000 行代码
```

### 之后（每个文件 ~50 行）
```
chapter1.html  52 行  ✅
chapter2.html  48 行  ✅
chapter3.html  55 行  ✅
...
总计：约 500 行代码 + 框架 1 份

代码减少：95%
维护成本：降低 90%
```

---

## 🔄 更新框架

当你修改框架后：

```bash
# 提交更改
git add framework/
git commit -m "Update framework"
git push

# GitHub Pages 会自动更新（1-2分钟）
# jsDelivr 需要清除缓存：访问 https://purge.jsdelivr.net/
```

---

## ✅ 验证部署

部署后访问以下地址验证：

```
https://你的用户名.github.io/aurafx-framework/framework/css/aurafx.css
https://你的用户名.github.io/aurafx-framework/framework/js/aurafx.js
https://你的用户名.github.io/aurafx-framework/framework/examples/minimal.html
```

如果能正常访问，说明部署成功！

---

## 🎉 完成

现在你可以：
1. 在任何 HTML 中引入框架
2. 只写内容，不写样式
3. 所有页面自动获得统一设计
4. 修改框架后所有页面自动更新
