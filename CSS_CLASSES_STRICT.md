# 框架CSS类完整清单（给AI的严格规范）

## ⚠️ 重要规则

1. **只能使用下面列出的CSS类**
2. **不要使用Tailwind类**（如 `.flex`, `.grid-2`, `.gap-12`）
3. **不要使用Bootstrap类**（如 `.btn`, `.container-fluid`）
4. **不要自己发明类名**
5. **如果需要的样式不在列表中，使用内联style**

---

## ✅ 可用的CSS类（完整列表）

### 1. 布局容器

```html
<!-- 主容器（最大宽度1200px，居中） -->
<div class="container">内容</div>

<!-- 网格背景层（必须有） -->
<div class="grid-layer"></div>
```

### 2. 导航和进度

```html
<!-- 进度条（必须有） -->
<div id="progressBar"></div>

<!-- 顶部导航栏 -->
<nav class="top-nav">
  <div class="top-nav-brand">品牌名 · <span>标签</span></div>
  <div class="top-nav-links">
    <a href="#s1">链接1</a>
    <a href="#s2">链接2</a>
  </div>
</nav>
```

### 3. 章节标签

```html
<!-- 章节标签（紫色边框，大写字母） -->
<div class="section-label">§1 · 章节标题</div>
```

### 4. 教学组件 - 要点总结框

```html
<!-- 紫色要点总结框 -->
<div class="sk-tldr">
  <div class="sk-tldr-title">核心要点</div>
  <p>要点内容...</p>
  <ul>
    <li>列表项1</li>
    <li>列表项2</li>
  </ul>
</div>
```

### 5. 教学组件 - 提示框

```html
<!-- 蓝色信息提示框（默认） -->
<div class="sk-callout">
  <div class="sk-callout-title">提示</div>
  <p>提示内容...</p>
</div>

<!-- 绿色成功提示框 -->
<div class="sk-callout sk-callout-success">
  <div class="sk-callout-title">成功</div>
  <p>成功信息...</p>
</div>

<!-- 橙色警告提示框 -->
<div class="sk-callout sk-callout-warning">
  <div class="sk-callout-title">警告</div>
  <p>警告信息...</p>
</div>

<!-- 红色错误提示框 -->
<div class="sk-callout sk-callout-error">
  <div class="sk-callout-title">错误</div>
  <p>错误信息...</p>
</div>
```

### 6. 教学组件 - 对比卡片

```html
<!-- 对比卡片网格（自动响应式布局） -->
<div class="compare-grid">
  <div class="compare-card">
    <div class="compare-card-title">标题1</div>
    <p>描述内容...</p>
  </div>

  <div class="compare-card">
    <div class="compare-card-title">标题2</div>
    <p>描述内容...</p>
  </div>

  <!-- 可以有3-4个卡片 -->
</div>
```

### 7. 教学组件 - 数学公式块

```html
<!-- 数学公式块 -->
<div class="sk-math-block">
  <div class="sk-math-label">公式标题</div>
  <div class="sk-formula">
    $$公式内容$$
  </div>
</div>

<!-- 或者带代码的 -->
<div class="sk-math-block">
  <div class="sk-math-label">代码示例</div>
  <pre>
def function():
    pass
  </pre>
</div>
```

### 8. 教学组件 - 对话框

```html
<div class="dialogue">
  <div class="dialogue-line">
    <div class="dialogue-speaker speaker-q">问</div>
    <div class="dialogue-text">问题内容？</div>
  </div>

  <div class="dialogue-line">
    <div class="dialogue-speaker speaker-a">答</div>
    <div class="dialogue-text">答案内容。</div>
  </div>
</div>
```

---

## ❌ 不可用的类（常见错误）

### 不要使用Tailwind类：
- ❌ `.flex`, `.grid`, `.grid-cols-2`
- ❌ `.items-center`, `.justify-between`
- ❌ `.gap-4`, `.gap-12`, `.space-x-4`
- ❌ `.p-4`, `.px-6`, `.py-8`, `.m-4`
- ❌ `.text-center`, `.font-bold`
- ❌ `.bg-blue-500`, `.text-white`

### 不要使用Bootstrap类：
- ❌ `.btn`, `.btn-primary`, `.btn-outline`
- ❌ `.row`, `.col-md-6`
- ❌ `.card`, `.card-body`, `.card-title`
- ❌ `.alert`, `.alert-info`

### 不要自己发明类：
- ❌ `.grid-bg` （应该用 `.grid-layer`）
- ❌ `.wrap` （应该用 `.container`）
- ❌ `.hero-kicker` （框架没有，用内联style）
- ❌ `.card-glow` （框架没有，用 `.compare-card`）

---

## 📝 正确的页面结构模板

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>页面标题</title>

  <!-- Google Fonts（必须） -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Noto+Sans+SC:wght@400;500;700&display=swap" rel="stylesheet">

  <!-- 框架CSS（必须按顺序） -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/wscyg/framework@main/css/aurafx.min.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/wscyg/framework@main/css/swiss-extensions.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/wscyg/framework@main/css/educational-components.min.css">

  <!-- KaTeX（如果需要数学公式） -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
</head>
<body>

<!-- 网格背景（必须） -->
<div class="grid-layer"></div>

<!-- 进度条（必须） -->
<div id="progressBar"></div>

<!-- 导航栏（必须） -->
<nav class="top-nav">
  <div class="top-nav-brand">项目名 · <span>CH.1</span></div>
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

      <div class="sk-tldr">
        <div class="sk-tldr-title">核心要点</div>
        <p>要点内容...</p>
      </div>

      <h3>小标题</h3>
      <p>正文段落...</p>

      <div class="compare-grid">
        <div class="compare-card">
          <div class="compare-card-title">对比项1</div>
          <p>描述...</p>
        </div>
        <div class="compare-card">
          <div class="compare-card-title">对比项2</div>
          <p>描述...</p>
        </div>
      </div>

      <div class="sk-callout">
        <div class="sk-callout-title">提示</div>
        <p>提示内容...</p>
      </div>
    </div>
  </section>

  <section id="s2">
    <div class="container">
      <div class="section-label">§2 · 第二章节</div>
      <h2>第二章标题</h2>
      <p>内容...</p>
    </div>
  </section>
</main>

<!-- 框架JS（必须） -->
<script src="https://cdn.jsdelivr.net/gh/wscyg/framework@main/js/aurafx.core.min.js"></script>

<!-- KaTeX渲染（如果需要） -->
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

## 🎨 如果需要额外样式

如果框架没有你需要的样式，**使用内联style或添加自定义style标签**：

```html
<head>
  <!-- 框架CSS -->
  <link rel="stylesheet" href="...">

  <!-- 自定义样式 -->
  <style>
    .my-custom-class {
      /* 你的样式 */
    }
  </style>
</head>
```

---

## 📋 检查清单

生成HTML后，检查：

- [ ] 是否使用了 `.grid-layer` 而不是 `.grid-bg`
- [ ] 是否使用了 `.container` 而不是 `.wrap`
- [ ] 是否没有使用 `.flex`, `.grid-2` 等Tailwind类
- [ ] 是否没有使用 `.btn`, `.card` 等Bootstrap类
- [ ] 所有CSS类都在上面的"可用列表"中
- [ ] 必须有：`.grid-layer`, `#progressBar`, `.top-nav`
- [ ] 每个section都有 `.container` 包裹内容

---

## 🚫 严格禁止

1. **不要混用其他框架的类名**
2. **不要假设框架有某个类**
3. **不确定的类就不要用，改用内联style**
4. **按钮、表单等元素用原生HTML + 内联style**

---

## ✅ 完整示例（保证能用）

见上面的"正确的页面结构模板"。

复制那个模板，只修改内容部分，不要改变结构和类名。
