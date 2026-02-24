# 框架使用指南 - 给AI的说明

## 基础引用模板

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>页面标题</title>

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Noto+Sans+SC:wght@400;500;700&display=swap" rel="stylesheet">

  <!-- KaTeX (如果需要数学公式) -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">

  <!-- 框架CSS -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/wscyg/framework@main/css/aurafx.min.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/wscyg/framework@main/css/swiss-extensions.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/wscyg/framework@main/css/educational-components.min.css">
</head>
<body>

<!-- 网格背景 -->
<div class="grid-layer"></div>

<!-- 进度条 -->
<div id="progressBar"></div>

<!-- 导航栏 -->
<nav class="top-nav">
  <div class="top-nav-brand">项目名称 · <span>CH.1</span></div>
  <div class="top-nav-links">
    <a href="#s1">章节1</a>
    <a href="#s2">章节2</a>
  </div>
</nav>

<!-- 主内容 -->
<main>
  <section id="s1">
    <div class="container">
      <div class="section-label">§1 · 章节标题</div>
      <h2>主标题</h2>
      <p>正文内容...</p>
    </div>
  </section>
</main>

<!-- 框架JS -->
<script src="https://cdn.jsdelivr.net/gh/wscyg/framework@main/js/aurafx.core.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/wscyg/framework@main/js/aurafx.effects.min.js"></script>

<!-- KaTeX渲染 (如果需要) -->
<script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"></script>
<script>
document.addEventListener("DOMContentLoaded", function() {
  renderMathInElement(document.body, {
    delimiters: [
      {left: "$$", right: "$$", display: true},
      {left: "$", right: "$", display: false}
    ]
  });
});
</script>

</body>
</html>
```

---

## 可用的CSS类和组件

### 1. 布局组件

```html
<!-- 容器 -->
<div class="container">内容</div>

<!-- 网格背景 -->
<div class="grid-layer"></div>

<!-- 进度条 -->
<div id="progressBar"></div>

<!-- 导航栏 -->
<nav class="top-nav">
  <div class="top-nav-brand">品牌名</div>
  <div class="top-nav-links">
    <a href="#s1">链接1</a>
  </div>
</nav>
```

### 2. 章节标签

```html
<div class="section-label">§1 · 章节名称</div>
```

### 3. 要点总结框 (紫色)

```html
<div class="sk-tldr">
  <div class="sk-tldr-title">核心要点</div>
  <p>这是要点内容...</p>
</div>
```

### 4. 提示框

```html
<!-- 信息提示 (蓝色) -->
<div class="sk-callout">
  <div class="sk-callout-title">提示</div>
  <p>这是提示内容...</p>
</div>

<!-- 成功提示 (绿色) -->
<div class="sk-callout sk-callout-success">
  <div class="sk-callout-title">成功</div>
  <p>操作成功！</p>
</div>

<!-- 警告提示 (橙色) -->
<div class="sk-callout sk-callout-warning">
  <div class="sk-callout-title">警告</div>
  <p>请注意...</p>
</div>

<!-- 错误提示 (红色) -->
<div class="sk-callout sk-callout-error">
  <div class="sk-callout-title">错误</div>
  <p>发生错误...</p>
</div>
```

### 5. 对比卡片网格

```html
<div class="compare-grid">
  <div class="compare-card">
    <div class="compare-card-title">选项A</div>
    <p>选项A的描述...</p>
  </div>

  <div class="compare-card">
    <div class="compare-card-title">选项B</div>
    <p>选项B的描述...</p>
  </div>
</div>
```

### 6. 数学公式块

```html
<div class="sk-math-block">
  <div class="sk-math-label">公式标题</div>
  <div class="sk-formula">
    $$\text{Attention}(Q, K, V) = \text{Softmax}\left(\frac{Q \cdot K^T}{\sqrt{d_k}}\right) \cdot V$$
  </div>
</div>

<!-- 或者带代码的 -->
<div class="sk-math-block">
  <div class="sk-math-label">示例代码</div>
  <pre>
def attention(q, k, v):
    scores = q @ k.T / sqrt(d_k)
    weights = softmax(scores)
    return weights @ v
  </pre>
</div>
```

### 7. 对话框

```html
<div class="dialogue">
  <div class="dialogue-line">
    <div class="dialogue-speaker speaker-q">问</div>
    <div class="dialogue-text">这是问题？</div>
  </div>
  <div class="dialogue-line">
    <div class="dialogue-speaker speaker-a">答</div>
    <div class="dialogue-text">这是答案。</div>
  </div>
</div>
```

---

## CSS变量（可以在style中覆盖）

```css
:root {
  /* 颜色 */
  --c-paper: #f2f2f0;      /* 背景色 */
  --c-ink: #050505;         /* 文字色 */
  --c-accent: #002fa7;      /* 强调色（克莱因蓝）*/
  --c-grid: #e0e0e0;        /* 网格颜色 */

  /* 主题色 */
  --violet: #8b5cf6;        /* 紫色 */
  --emerald: #10b981;       /* 绿色 */
  --cyan: #06b6d4;          /* 青色 */
  --orange: #f97316;        /* 橙色 */
  --amber: #f59e0b;         /* 琥珀色 */
  --rose: #f43f5e;          /* 玫瑰色 */

  /* 字体 */
  --font-serif: 'Playfair Display', serif;
  --font-sans: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

---

## 完整示例

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>Transformer教程</title>

  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;600&family=JetBrains+Mono:wght@400&family=Noto+Sans+SC:wght@400;700&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/wscyg/framework@main/css/aurafx.min.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/wscyg/framework@main/css/swiss-extensions.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/wscyg/framework@main/css/educational-components.min.css">
</head>
<body>

<div class="grid-layer"></div>
<div id="progressBar"></div>

<nav class="top-nav">
  <div class="top-nav-brand">手撕 Transformer · <span>CH.1</span></div>
  <div class="top-nav-links">
    <a href="#s1">Attention</a>
    <a href="#s2">Multi-Head</a>
  </div>
</nav>

<main>
  <section id="s1">
    <div class="container">
      <div class="section-label">§1 · Attention机制</div>
      <h2>Self-Attention：每个词从所有词借信息</h2>

      <div class="sk-tldr">
        <div class="sk-tldr-title">核心要点</div>
        <p>每个词根据「内容相似度」从所有词借信息。</p>
      </div>

      <h3>公式推导</h3>

      <div class="sk-math-block">
        <div class="sk-math-label">Attention公式</div>
        <pre>
Attention(Q, K, V) = softmax(Q·K^T / √d_k) · V
        </pre>
      </div>

      <div class="compare-grid">
        <div class="compare-card">
          <div class="compare-card-title">Query (Q)</div>
          <p>查询向量，表示"我想要什么信息"</p>
        </div>

        <div class="compare-card">
          <div class="compare-card-title">Key (K)</div>
          <p>键向量，表示"我有什么信息"</p>
        </div>

        <div class="compare-card">
          <div class="compare-card-title">Value (V)</div>
          <p>值向量，实际传递的信息</p>
        </div>
      </div>

      <div class="sk-callout sk-callout-success">
        <div class="sk-callout-title">✓ 理解要点</div>
        <p>Q和K决定注意力权重，V携带实际信息。</p>
      </div>
    </div>
  </section>
</main>

<script src="https://cdn.jsdelivr.net/gh/wscyg/framework@main/js/aurafx.core.min.js"></script>

</body>
</html>
```

---

## 使用说明

1. **必须引用的CSS**（按顺序）：
   - `aurafx.min.css` - 基础样式
   - `swiss-extensions.css` - 瑞士风格
   - `educational-components.min.css` - 教学组件

2. **必须引用的JS**：
   - `aurafx.core.min.js` - 核心功能（进度条、导航等）
   - `aurafx.effects.min.js` - 可选，视觉特效

3. **必须引用的字体**：
   - Playfair Display（标题）
   - Inter（正文）
   - JetBrains Mono（代码）
   - Noto Sans SC（中文）

4. **页面结构**：
   - 必须有 `<div class="grid-layer"></div>` 网格背景
   - 必须有 `<div id="progressBar"></div>` 进度条
   - 必须有 `<nav class="top-nav">` 导航栏
   - 主内容放在 `<main>` 标签中
   - 每个章节用 `<section>` 包裹
   - 内容用 `<div class="container">` 包裹

---

## 注意事项

- 所有CDN链接使用 `https://cdn.jsdelivr.net/gh/wscyg/framework@main/`
- 标题必须使用 `h2`, `h3` 标签才能应用正确的字体
- 章节标签必须使用 `<div class="section-label">§数字 · 标题</div>` 格式
- 提示框必须包含 `sk-callout-title` 和内容
- 对比卡片必须放在 `compare-grid` 容器中

---

## 颜色语义

- **紫色** (`--violet`) - 要点、重要概念
- **蓝色** (`--cyan`) - 信息提示
- **绿色** (`--emerald`) - 成功、正确
- **橙色** (`--orange`) - 警告、注意
- **红色** (`--rose`) - 错误、危险
- **琥珀色** (`--amber`) - 配置、参数
