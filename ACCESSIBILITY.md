# AuraFX 可访问性指南

本框架遵循 WCAG 2.1 AA 标准，确保所有用户都能访问。

## ✅ 已实现的可访问性特性

### 键盘导航
- **Tab**: 焦点在所有交互元素间移动
- **Enter/Space**: 激活按钮和链接
- **ESC**: 关闭模态框和菜单
- **←/→**: 标签页切换
- **Home/End**: 跳转到首尾

### 焦点管理
```css
:focus-visible {
    outline: 3px solid var(--ring);
    outline-offset: 3px;
    border-radius: 12px;
}
```

### 颜色对比
- 文字与背景对比度 ≥ 4.5:1
- 大文字对比度 ≥ 3:1
- 交互元素对比度 ≥ 3:1

### 动画控制
```css
@media (prefers-reduced-motion: reduce) {
    * {
        animation: none !important;
        transition: none !important;
    }
}
```

## 📋 ARIA 标签使用指南

### 按钮
```html
<!-- 图标按钮必须有 aria-label -->
<button class="btn" aria-label="关闭对话框">
    ×
</button>

<!-- 状态按钮 -->
<button class="btn" aria-pressed="false">
    收藏
</button>
```

### 模态框
```html
<div class="modal"
     role="dialog"
     aria-modal="true"
     aria-labelledby="modal-title"
     aria-describedby="modal-desc">
    <h3 id="modal-title">标题</h3>
    <p id="modal-desc">描述</p>
</div>
```

### 标签页
```html
<div class="tab-bar" role="tablist">
    <button class="tab-b"
            role="tab"
            aria-selected="true"
            aria-controls="panel1"
            id="tab1">
        标签1
    </button>
</div>
<div class="tab-panel"
     role="tabpanel"
     aria-labelledby="tab1"
     id="panel1">
    内容
</div>
```

### 手风琴
```html
<div class="acc">
    <button class="acc-h"
            aria-expanded="false"
            aria-controls="acc-body-1">
        标题
    </button>
    <div class="acc-body" id="acc-body-1">
        内容
    </div>
</div>
```

### 导航
```html
<nav class="nav" aria-label="主导航">
    <ul role="list">
        <li><a href="#" aria-current="page">首页</a></li>
        <li><a href="#">关于</a></li>
    </ul>
</nav>
```

## 🎯 最佳实践

### 1. 语义化 HTML
```html
<!-- ✅ 好 -->
<button>点击</button>
<nav>导航</nav>
<main>主内容</main>

<!-- ❌ 差 -->
<div onclick="...">点击</div>
<div class="nav">导航</div>
<div class="main">主内容</div>
```

### 2. 图片替代文本
```html
<!-- 装饰性图片 -->
<img src="decoration.png" alt="" role="presentation">

<!-- 信息性图片 -->
<img src="chart.png" alt="2024年销售数据图表">
```

### 3. 表单标签
```html
<label for="email">邮箱</label>
<input type="email" id="email" aria-required="true">

<input type="text" aria-label="搜索" placeholder="搜索...">
```

### 4. 错误提示
```html
<input type="email"
       id="email"
       aria-invalid="true"
       aria-describedby="email-error">
<span id="email-error" role="alert">
    请输入有效的邮箱地址
</span>
```

### 5. 加载状态
```html
<button aria-busy="true" aria-live="polite">
    加载中...
</button>
```

## 🔍 测试清单

### 键盘测试
- [ ] 所有交互元素可通过 Tab 访问
- [ ] 焦点顺序符合逻辑
- [ ] 焦点可见且清晰
- [ ] ESC 键可关闭弹窗
- [ ] Enter/Space 可激活按钮

### 屏幕阅读器测试
- [ ] 所有图片有替代文本
- [ ] 表单有正确标签
- [ ] 按钮有描述性文字
- [ ] 页面结构清晰
- [ ] 动态内容有通知

### 颜色对比测试
- [ ] 文字对比度 ≥ 4.5:1
- [ ] 大文字对比度 ≥ 3:1
- [ ] 不依赖颜色传达信息

### 缩放测试
- [ ] 200% 缩放下可用
- [ ] 文字不重叠
- [ ] 功能不丢失

## 🛠️ 测试工具

### 浏览器扩展
- **axe DevTools**: 自动化可访问性测试
- **WAVE**: 可视化可访问性评估
- **Lighthouse**: Chrome 内置审计工具

### 屏幕阅读器
- **NVDA** (Windows, 免费)
- **JAWS** (Windows)
- **VoiceOver** (macOS/iOS, 内置)
- **TalkBack** (Android, 内置)

### 命令行工具
```bash
# 使用 pa11y 测试
npm install -g pa11y
pa11y https://your-site.com

# 使用 axe-core
npm install -g @axe-core/cli
axe https://your-site.com
```

## 📚 参考资源

- [WCAG 2.1 指南](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA 实践指南](https://www.w3.org/WAI/ARIA/apg/)
- [MDN 可访问性](https://developer.mozilla.org/zh-CN/docs/Web/Accessibility)
- [WebAIM](https://webaim.org/)

## 🎓 常见问题

### Q: 什么时候使用 role 属性？
A: 当 HTML 语义不足时使用。例如 `<div role="button">` 应该改为 `<button>`。

### Q: aria-label 和 aria-labelledby 的区别？
A: `aria-label` 直接提供文本，`aria-labelledby` 引用其他元素的 ID。

### Q: 如何处理纯装饰性元素？
A: 使用 `aria-hidden="true"` 或 `role="presentation"`。

### Q: 动态内容如何通知屏幕阅读器？
A: 使用 `aria-live="polite"` 或 `role="alert"`。

---

**可访问性不是可选项，而是必需品** - 让每个人都能使用你的网站。
