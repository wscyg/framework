/**
 * AuraFX Framework Loader
 * 自动注入框架所需的所有资源和结构
 */

(function() {
    'use strict';

    // 配置
    const config = {
        frameworkPath: 'framework/',
        cssFiles: [
            'css/aurafx.min.css',
            'css/swiss-extensions.min.css',
            'css/educational-components.min.css'
        ],
        jsFiles: [
            'js/aurafx.min.js',
            'js/swiss-extensions.min.js'
        ],
        externalCSS: [
            'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css'
        ],
        externalJS: [
            'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js',
            'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js'
        ]
    };

    // 加载 CSS
    function loadCSS(href) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
    }

    // 加载 JS
    function loadJS(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
        });
    }

    // 注入框架结构
    function injectFrameworkStructure() {
        // 获取原始内容
        const originalContent = document.body.innerHTML;

        // 提取配置
        const pageConfig = window.AURAFX_CONFIG || {};
        const navBrand = pageConfig.navBrand || '手撕 Transformer';
        const navLinks = pageConfig.navLinks || [];
        const footerText = pageConfig.footerText || '';

        // 构建新的 HTML 结构
        const newHTML = `
<!-- Background Layers -->
<div class="grid-layer"></div>
<div class="grain-layer"></div>

<!-- Cursor System -->
<div id="cursor-system">
    <div class="cursor-crosshair"></div>
</div>

<!-- Progress Bar -->
<div id="progressBar"></div>

<!-- Navigation -->
<nav class="top-nav">
    <div class="top-nav-brand">${navBrand}</div>
    <div class="top-nav-links">
        ${navLinks.map(link => `<a href="${link.href}">${link.text}</a>`).join('')}
    </div>
</nav>

<main id="framework-content">
    ${originalContent}
</main>

<!-- Footer -->
<footer class="site-footer">
    <p>${footerText}</p>
    <p><a href="#top">回到顶部 ↑</a></p>
</footer>
        `;

        document.body.innerHTML = newHTML;
    }

    // 初始化框架功能
    function initFrameworkFeatures() {
        // KaTeX 渲染
        if (typeof renderMathInElement !== 'undefined') {
            renderMathInElement(document.body, {
                delimiters: [
                    { left: "$$", right: "$$", display: true },
                    { left: "$", right: "$", display: false }
                ],
                throwOnError: false
            });
        }

        // 进度条
        window.addEventListener('scroll', () => {
            const h = document.documentElement;
            const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
            const progressBar = document.getElementById('progressBar');
            if (progressBar) {
                progressBar.style.width = pct + '%';
            }
        });

        // 粒子系统（如果有 canvas）
        const heroCanvas = document.getElementById('heroParticles');
        if (heroCanvas) {
            initParticleSystem(heroCanvas);
        }
    }

    // 粒子系统
    function initParticleSystem(canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 50;

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 2 + 1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0, 47, 167, 0.6)';
                ctx.fill();
            }
        }

        function resize() {
            const rect = canvas.parentElement.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animate);
        }

        resize();
        animate();
        window.addEventListener('resize', resize);
    }

    // 主初始化函数
    async function init() {
        // 1. 加载所有 CSS
        config.cssFiles.forEach(file => {
            loadCSS(config.frameworkPath + file);
        });
        config.externalCSS.forEach(loadCSS);

        // 2. 等待 DOM 加载完成
        if (document.readyState === 'loading') {
            await new Promise(resolve => {
                document.addEventListener('DOMContentLoaded', resolve);
            });
        }

        // 3. 注入框架结构
        injectFrameworkStructure();

        // 4. 加载所有 JS
        for (const file of config.jsFiles) {
            await loadJS(config.frameworkPath + file);
        }
        for (const file of config.externalJS) {
            await loadJS(file);
        }

        // 5. 初始化框架功能
        initFrameworkFeatures();

        // 6. 触发自定义初始化事件
        window.dispatchEvent(new Event('aurafx:ready'));
    }

    // 启动
    init();
})();
