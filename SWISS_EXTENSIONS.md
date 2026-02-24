# AuraFX 瑞士建筑风格扩展

瑞士建筑风格扩展为 AuraFX 框架添加了极简主义、网格系统和精准设计元素。

## 🎨 设计特点

### 核心理念
- **极致对比**：纸白色背景 + 墨黑色文字
- **克莱因蓝**：唯一的色彩强调（#002fa7）
- **网格系统**：40px 精准网格
- **硬阴影**：建筑风格的立体感
- **瑞士缓动**：cubic-bezier(0.87, 0, 0.13, 1)

## 📦 安装使用

### 引入扩展

```html
<!-- 基础框架 -->
<link rel="stylesheet" href="framework/css/aurafx.css">
<link rel="stylesheet" href="framework/css/swiss-extensions.css">

<!-- JS -->
<script src="framework/js/aurafx.js"></script>
<script src="framework/js/swiss-extensions.js"></script>
```

### 必需的HTML结构

```html
<!-- 背景层 -->
<div class="grid-layer"></div>
<div class="grain-layer"></div>
<canvas id="canvas-flow"></canvas>

<!-- 自定义光标 -->
<div id="cursor-system">
    <div class="cursor-crosshair"></div>
    <div class="cursor-dot"></div>
</div>
```

## 🧩 组件

### 1. 蓝图卡片

```html
<div class="blueprint-card hover-target">
    <div class="symbol-box">Q</div>
    <h3>标题</h3>
    <p>描述内容</p>
    <div class="tech-line"></div>
    <div style="font-family: var(--font-mono); font-size: 10px;">
        TYPE: VECTOR<br>ROLE: SEEKER
    </div>
</div>
```

**特性**：
- 硬阴影效果（8px 8px 0px）
- 悬停时位移动画
- 符号盒子设计

### 2. 建筑风格按钮

```html
<button class="btn-arch hover-target">
    按钮文字
</button>
```

**特性**：
- 大写字母
- 单色设计
- 内边框悬停效果

### 3. 图表盒子

```html
<div class="diagram-box hover-target">
    <svg viewBox="0 0 400 300">
        <!-- SVG 内容 -->
    </svg>
</div>
```

**特性**：
- 内部网格背景
- 蓝图风格边框
- SVG 样式预设

### 4. 代码纸张

```html
<div class="code-sheet">
    <div class="interactive-line" data-target="desc-1">
        代码行 1
    </div>
    <div class="interactive-line" data-target="desc-2">
        代码行 2
    </div>
</div>

<!-- 描述框 -->
<div id="desc-1" class="desc-box">
    <h3>标题</h3>
    <p>描述</p>
</div>
```

**特性**：
- 左侧克莱因蓝边框
- 交互式代码行
- 与描述框联动

### 5. 沙盒面板

```html
<div class="sandbox-panel hover-target">
    <div class="sandbox-header">
        <span>标题</span>
        <span>状态</span>
    </div>
    <div style="padding: 30px;" id="sentence-container">
        <!-- Token 词 -->
    </div>
    <div class="heatmap-grid" id="heat-grid">
        <!-- 热力图单元格 -->
    </div>
</div>
```

**特性**：
- 实验室风格
- Token 交互
- 热力图可视化

### 6. 控制面板

```html
<div class="control-deck">
    <div style="position:relative">
        <button class="deck-btn hover-target" onclick="scrollToPage(0)">01</button>
        <div class="deck-label">标签</div>
    </div>
</div>
```

**特性**：
- 固定右下角
- 编号按钮
- 悬停标签提示

### 7. 全屏滚动

```html
<div class="viewport" id="main-scroll">
    <section class="slide in-view" id="slide-0">
        <div class="container">
            <!-- 内容 -->
        </div>
    </section>
</div>
```

**特性**：
- scroll-snap-type
- 自动滚动观察
- 淡入动画

### 8. 跑马灯

```html
<div class="marquee-container">
    <div class="marquee-content">
        文字内容 /// 文字内容 /// 文字内容 ///
    </div>
</div>
```

**特性**：
- 无限循环滚动
- 倾斜效果
- 大字体展示

## 🎯 CSS 变量

```css
:root {
    --swiss-accent: #002fa7;      /* 克莱因蓝 */
    --swiss-grid: #e0e0e0;        /* 网格颜色 */
    --swiss-paper: #f2f2f0;       /* 纸张背景 */
    --swiss-grid-size: 40px;      /* 网格大小 */
    --swiss-border: 1.5px;        /* 边框宽度 */
    --ease-snap: cubic-bezier(0.87, 0, 0.13, 1);  /* 瑞士缓动 */
}
```

## 🎬 JavaScript API

### 初始化

所有功能自动初始化，无需手动调用。

### 页面滚动

```javascript
// 滚动到指定页面
scrollToPage(0);  // 滚动到第一页
scrollToPage(1);  // 滚动到第二页
```

### 自定义光标

光标自动跟随鼠标，悬停在 `.hover-target` 元素上时自动变化。

### 流场背景

Canvas 背景自动渲染，响应窗口大小变化。

## 📐 布局系统

### 网格

```html
<div class="split">
    <div>左侧内容</div>
    <div>右侧内容</div>
</div>

<div class="grid-3">
    <div>项目 1</div>
    <div>项目 2</div>
    <div>项目 3</div>
</div>
```

### 容器

```html
<div class="container">
    <!-- 最大宽度 1200px，自动居中 -->
</div>
```

## 🎨 SVG 样式

```html
<svg viewBox="0 0 400 300">
    <!-- 线条 -->
    <path d="M 50,260 L 100,200" class="svg-line" />

    <!-- 节点 -->
    <rect x="100" y="160" width="40" height="40" class="svg-node" />
    <circle cx="300" cy="60" r="20" class="svg-node" />

    <!-- 文字 -->
    <text x="120" y="180" class="svg-text">文字</text>

    <!-- 流动粒子 -->
    <circle cx="0" cy="0" r="4" class="flow-packet" id="signal-dot" />
</svg>
```

## 🌓 深色主题

瑞士扩展自动适配 AuraFX 的深色主题：

```html
<html data-theme="dark">
```

## 📱 响应式

所有组件在移动端自动适配：
- 网格变为单列
- 字体大小缩小
- 控制面板位置调整

## 🎯 完整示例

查看 `framework/examples/swiss-demo.html` 获取完整演示。

## 🔗 与 AuraFX 集成

瑞士扩展完全兼容 AuraFX 核心组件：

```html
<!-- 混合使用 -->
<div class="card blueprint-card">
    <!-- AuraFX 卡片 + 瑞士蓝图风格 -->
</div>

<button class="btn btn-arch">
    <!-- AuraFX 按钮 + 瑞士建筑风格 -->
</button>
```

## 🎨 设计灵感

- **瑞士国际主义风格**：网格系统、无衬线字体、极简主义
- **包豪斯运动**：形式追随功能
- **克莱因蓝**：Yves Klein 的标志性色彩
- **建筑蓝图**：技术图纸的精准美学

## 📊 性能

- Canvas 背景：60fps 流畅渲染
- 滚动动画：硬件加速
- 光标跟随：50ms 延迟优化
- 文件大小：CSS 15KB + JS 8KB（未压缩）

## 🚀 最佳实践

1. **光标系统**：确保添加 `.hover-target` 类到可交互元素
2. **滚动页面**：每个 `<section>` 必须有唯一 ID（slide-0, slide-1...）
3. **网格对齐**：使用 40px 的倍数作为间距
4. **色彩使用**：克莱因蓝仅用于强调，保持极简
5. **字体层级**：使用 Playfair（衬线）+ Inter（无衬线）+ JetBrains Mono（等宽）

## 🎓 学习资源

- [瑞士国际主义风格](https://en.wikipedia.org/wiki/International_Typographic_Style)
- [克莱因蓝](https://en.wikipedia.org/wiki/International_Klein_Blue)
- [网格系统设计](https://www.designsystems.com/space-grids-and-layouts/)
