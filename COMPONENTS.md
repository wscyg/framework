# AuraFX 组件文档

完整的组件使用指南和 API 文档。

## 📦 布局组件

### .wrap
内容容器，最大宽度 1140px，自动居中。

```html
<div class="wrap">
    <!-- 内容 -->
</div>
```

**CSS 变量**：
- `--maxw`: 最大宽度（默认 1140px）
- `--pad-x`: 水平内边距（响应式）

---

### .section
章节容器，提供垂直间距。

```html
<section class="section">
    <div class="wrap">
        <!-- 内容 -->
    </div>
</section>
```

**修饰类**：
- `.minh-100`: 最小高度 100vh
- `.pt-nav`: 顶部留出导航栏空间
- `.bg-soft`: 浅灰背景

---

### 网格系统

```html
<!-- 2列网格 -->
<div class="grid-2">
    <div>列1</div>
    <div>列2</div>
</div>

<!-- 3列网格 -->
<div class="grid-3">
    <div>列1</div>
    <div>列2</div>
    <div>列3</div>
</div>

<!-- 4列网格 -->
<div class="grid-4">
    <div>列1</div>
    <div>列2</div>
    <div>列3</div>
    <div>列4</div>
</div>
```

**响应式**：
- 移动端自动变为单列
- 平板端 2-3 列
- 桌面端完整列数

---

## 🎴 卡片组件

### .card
基础卡片，带阴影和圆角。

```html
<div class="card">
    <h3 class="t-h2">标题</h3>
    <p>内容</p>
</div>
```

**可访问性**：
```html
<div class="card" role="article" aria-labelledby="card-title">
    <h3 id="card-title">标题</h3>
    <p>内容</p>
</div>
```

---

### .card-spot
聚光灯卡片，鼠标跟随光效。

```html
<div class="card-spot">
    <h3>标题</h3>
    <p>鼠标移动时会有光效跟随</p>
</div>
```

**特性**：
- 自动鼠标跟随
- 硬件加速
- 性能优化

---

### .card-gl
玻璃态卡片，毛玻璃效果。

```html
<div class="card-gl">
    <h3>标题</h3>
    <p>半透明毛玻璃效果</p>
</div>
```

**CSS 变量**：
- `--glass-border`: 边框颜色
- `--bg-elev`: 背景色

---

### .card-glow
发光卡片，顶部渐变发光。

```html
<div class="card-glow">
    <h3>标题</h3>
    <p>顶部有渐变发光效果</p>
</div>
```

---

### .card-br
Brutal 风格卡片，硬边框设计。

```html
<div class="card-br">
    <h3>标题</h3>
    <p>Brutal 风格，硬边框</p>
</div>
```

---

## 🔘 按钮组件

### .btn
基础按钮，支持多种色调。

```html
<!-- 主按钮 -->
<button class="btn" data-tone="primary">主按钮</button>

<!-- 边框按钮 -->
<button class="btn" data-tone="outline">次要按钮</button>

<!-- 幽灵按钮 -->
<button class="btn" data-tone="ghost">幽灵按钮</button>
```

**色调选项**：
- `primary`: 主色
- `outline`: 边框
- `ghost`: 幽灵
- `ok`: 成功色
- `warn`: 警告色
- `bad`: 错误色

**可访问性**：
```html
<button class="btn" data-tone="primary" aria-label="提交表单">
    提交
</button>
```

---

### .btn-brutal
Brutal 风格按钮。

```html
<button class="btn-brutal">Brutal 按钮</button>
```

**特性**：
- 硬边框
- 无圆角
- 强对比

---

## 💬 交互组件

### Toast 提示

```html
<button data-af="toast"
        data-tone="ok"
        data-title="成功"
        data-desc="操作完成">
    点击我
</button>

<!-- Toast 容器（必需） -->
<div class="toast-root" id="toastRoot"></div>
```

**参数**：
- `data-tone`: ok | info | warn | bad
- `data-title`: 标题
- `data-desc`: 描述

**JavaScript API**：
```javascript
// 手动触发
window.toast({
    tone: 'ok',
    title: '成功',
    desc: '操作完成'
});
```

---

### 模态框

```html
<!-- 触发按钮 -->
<button data-af="modal-open" data-target="#myModal">
    打开弹窗
</button>

<!-- 模态框 -->
<div class="modal" id="myModal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <div class="modal-backdrop" data-af="modal-close"></div>
    <div class="modal-box">
        <div class="modal-head">
            <h3 id="modal-title">标题</h3>
            <button class="modal-x" data-af="modal-close" aria-label="关闭">×</button>
        </div>
        <div class="modal-body">
            <p>内容</p>
        </div>
    </div>
</div>
```

**可访问性**：
- 自动焦点管理
- ESC 键关闭
- 焦点陷阱
- 滚动锁定

---

### 标签页

```html
<div class="tab-bar" role="tablist">
    <button class="tab-b active"
            data-af="tab"
            data-tab="tab1"
            role="tab"
            aria-selected="true"
            aria-controls="panel1">
        标签1
    </button>
    <button class="tab-b"
            data-af="tab"
            data-tab="tab2"
            role="tab"
            aria-selected="false"
            aria-controls="panel2">
        标签2
    </button>
</div>

<div class="tab-panel active" id="panel1" role="tabpanel">内容1</div>
<div class="tab-panel" id="panel2" role="tabpanel">内容2</div>
```

**键盘导航**：
- `←` / `→`: 切换标签
- `Home`: 第一个标签
- `End`: 最后一个标签

---

### 手风琴

```html
<div class="acc" data-af="acc" data-state="closed">
    <button class="acc-h" aria-expanded="false" aria-controls="acc-body-1">
        点击展开
    </button>
    <div class="acc-body" id="acc-body-1">
        <p>内容</p>
    </div>
</div>
```

**特性**：
- 动态高度计算
- 平滑动画
- 键盘支持

---

## 📝 排版组件

### 标题

```html
<h1 class="t-d">超大标题</h1>
<h1 class="t-h1">一级标题</h1>
<h2 class="t-h2">二级标题</h2>
<h3 class="t-h3">三级标题</h3>
```

**修饰类**：
- `.t-grad`: 渐变文字
- `.t-cap`: 小标题（大写）

---

### 正文

```html
<p class="t-body">正文内容</p>
<p class="t-body mw-680">限制最大宽度的正文</p>
```

---

## 💻 代码组件

### 代码窗口

```html
<div class="code-win">
    <div class="mac-bar">
        <div class="mac-dot dot-r"></div>
        <div class="mac-dot dot-y"></div>
        <div class="mac-dot dot-g"></div>
        <div class="mac-title">example.py</div>
    </div>
    <div class="code-body">
        <span class="cline"><span class="ck">def</span> hello():</span>
        <span class="cline">    print("Hello!")</span>
    </div>
</div>
```

**语法高亮类**：
- `.ck`: 关键字（keyword）
- `.cf`: 函数（function）
- `.cs`: 字符串（string）
- `.cn`: 数字（number）
- `.cc`: 注释（comment）

---

## 🏷️ 标签组件

### .tag
小标签。

```html
<span class="tag tag-blue">标签</span>
<span class="tag tag-violet">标签</span>
<span class="tag tag-ok">标签</span>
<span class="tag tag-warn">标签</span>
<span class="tag tag-bad">标签</span>
```

---

### .badge
徽章。

```html
<span class="badge" data-tone="brand">徽章</span>
<span class="badge" data-tone="ok">成功</span>
<span class="badge" data-tone="warn">警告</span>
```

---

## 🎨 工具类

### 间距

```css
/* 外边距 */
.mb-6, .mb-12, .mb-16, .mb-24, .mb-32
.mt-10, .mt-14, .mt-16, .mt-22

/* 内边距 */
.p-12, .p-16, .p-24

/* 间隙 */
.gap-8, .gap-12, .gap-16, .gap-24
```

---

### 布局

```css
/* Flexbox */
.flex
.items-center
.items-start
.items-end
.justify-between
.justify-center
.justify-end

/* 宽度 */
.w-100
.mw-680
.mx-auto

/* 高度 */
.minh-100

/* 文本对齐 */
.text-center
.text-left
.text-right
```

---

### 动画

```css
/* 淡入 */
.rv          /* 从下淡入 */
.rv-r        /* 从右淡入 */
.rv-l        /* 从左淡入 */

/* 阶梯式淡入 */
.stg         /* 子元素依次出现 */

/* 交互 */
.ix          /* 悬停效果 */
```

---

## 🌓 主题系统

### 切换主题

```html
<!-- 主题切换按钮 -->
<button data-af="theme-toggle">切换主题</button>

<!-- 或使用 toggle-pill -->
<button class="toggle-pill" data-af="theme-toggle">
    <span class="t-cap">Light</span>
    <span class="switch"></span>
</button>
```

### CSS 变量

```css
:root {
    /* 颜色 */
    --brand: #2563eb;
    --brand2: #8b5cf6;
    --ok: #10b981;
    --warn: #f59e0b;
    --bad: #f43f5e;

    /* 背景 */
    --bg: #ffffff;
    --bg-s: #f8fafc;
    --bg-elev: rgba(255,255,255,.86);

    /* 文字 */
    --ink: #0f172a;
    --muted: #64748b;
    --light: #94a3b8;

    /* 边框 */
    --border: rgba(15,23,42,.08);

    /* 阴影 */
    --sh-1: 0 2px 8px -2px rgba(2,6,23,.05);
    --sh-2: 0 14px 30px -10px rgba(2,6,23,.08);
    --sh-3: 0 26px 60px -18px rgba(37,99,235,.14);
}

html[data-theme="dark"] {
    --bg: #070a12;
    --bg-s: #0b1020;
    --ink: #e5e7eb;
    /* ... */
}
```

---

## 🎯 数据属性 API

### data-af
框架交互系统。

```html
<!-- Toast -->
<button data-af="toast" data-tone="ok" data-title="标题" data-desc="描述">

<!-- 模态框 -->
<button data-af="modal-open" data-target="#modal">
<button data-af="modal-close">

<!-- 标签页 -->
<button data-af="tab" data-tab="tab1">

<!-- 手风琴 -->
<div data-af="acc" data-state="closed">

<!-- 主题切换 -->
<button data-af="theme-toggle">
```

---

## 📱 响应式断点

```css
/* 移动端 */
@media (max-width: 768px) {
    /* 单列布局 */
}

/* 平板 */
@media (max-width: 1024px) {
    /* 2-3列布局 */
}

/* 桌面 */
@media (min-width: 1025px) {
    /* 完整布局 */
}
```

---

## ♿ 可访问性

### ARIA 标签

所有交互组件都包含完整的 ARIA 标签：
- `role`: 组件角色
- `aria-label`: 标签
- `aria-expanded`: 展开状态
- `aria-selected`: 选中状态
- `aria-controls`: 控制关系
- `aria-modal`: 模态框
- `aria-labelledby`: 标题关联

### 键盘导航

- **Tab**: 焦点移动
- **Enter/Space**: 激活
- **ESC**: 关闭模态框/菜单
- **←/→**: 标签页切换
- **Home/End**: 首尾导航

---

## 🎨 扩展组件

### 瑞士建筑风格

查看 [SWISS_EXTENSIONS.md](SWISS_EXTENSIONS.md)

### 玻璃态特效

- 便签卡片
- 打字机效果
- 统计行
- 时间线
- 应用卡片

---

## 📊 性能优化

### 硬件加速

所有动画使用 `transform` 和 `opacity`：
```css
.card {
    will-change: transform;
    backface-visibility: hidden;
    transform: translateZ(0);
}
```

### 防抖节流

滚动和 resize 事件自动防抖。

### 懒加载

使用 Intersection Observer 实现元素可见性检测。

---

## 🔧 自定义

### 覆盖 CSS 变量

```css
:root {
    --brand: #your-color;
    --font-sans: 'Your Font', sans-serif;
    --maxw: 1280px;
}
```

### 扩展组件

```css
.card.my-custom-card {
    /* 自定义样式 */
}
```

---

## 📚 相关文档

- [README](README.md) - 快速开始
- [SWISS_EXTENSIONS](SWISS_EXTENSIONS.md) - 瑞士风格
- [DEPLOY](DEPLOY.md) - 部署指南
- [OPTIMIZATION_SUGGESTIONS](OPTIMIZATION_SUGGESTIONS.md) - 优化建议
