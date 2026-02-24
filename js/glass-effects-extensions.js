/* ==========================================
 * GLASS & EFFECTS EXTENSIONS - JS
 * 玻璃态与特效交互逻辑
 * ==========================================
 */

(function() {
    'use strict';

    // === 打字机效果 2.0 ===
    function typeWriter(el, baseSpeed = 30) {
        const text = el.dataset.text;
        const delay = parseInt(el.dataset.delay) || 0;

        if (!text || el.dataset.typing === 'true') return;
        el.dataset.typing = 'true';

        setTimeout(() => {
            el.innerHTML = '';
            el.style.position = 'relative';
            el.style.display = 'inline-block';

            // 创建隐藏占位符，防止布局抖动
            const placeholder = document.createElement('span');
            placeholder.className = 'typing-placeholder';
            placeholder.textContent = text;
            el.appendChild(placeholder);

            // 创建可见文字层
            const visibleLayer = document.createElement('span');
            visibleLayer.className = 'typing-visible';
            el.appendChild(visibleLayer);

            // 光标
            const cursor = el.nextElementSibling;
            if (cursor && cursor.classList.contains('typing-cursor')) {
                cursor.style.opacity = '1';
            }

            // 打字效果
            let i = 0;
            function type() {
                if (i < text.length) {
                    visibleLayer.textContent += text.charAt(i);
                    i++;
                    // 随机速度，模拟真实打字
                    const randomSpeed = baseSpeed + (Math.random() * 20 - 10);
                    setTimeout(type, randomSpeed);
                } else {
                    el.dataset.typed = 'done';
                }
            }
            type();
        }, delay);
    }

    // === 元素可见性观察器 ===
    function initVisibilityObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        // 观察所有需要动画的元素
        const elements = document.querySelectorAll(
            '.glass-card, .formula-box, .sticky-note, .diagram-container, ' +
            '.stat-item, .head-card, .app-card, .timeline-item, ' +
            '.col-content, .col-visual, .content-list li'
        );

        elements.forEach(el => observer.observe(el));
    }

    // === 便签飞入动画 ===
    function initStickyNotes() {
        const notes = document.querySelectorAll('.sticky-note');

        notes.forEach((note, i) => {
            const delay = parseInt(note.dataset.delay) || 400 + i * 200;
            setTimeout(() => {
                note.classList.add('fly-in');
            }, delay);
        });
    }

    // === 打字机自动初始化 ===
    function initTypewriters() {
        document.querySelectorAll('.typing-text').forEach(el => {
            typeWriter(el, 30);
        });
    }

    // === 统计数字动画 ===
    function animateStatValue(el) {
        const target = el.textContent;
        const isNumber = /^\d+$/.test(target);

        if (!isNumber) return;

        const targetNum = parseInt(target);
        const duration = 1500;
        const steps = 60;
        const increment = targetNum / steps;
        let current = 0;
        let step = 0;

        const timer = setInterval(() => {
            current += increment;
            step++;
            el.textContent = Math.floor(current);

            if (step >= steps) {
                el.textContent = target;
                clearInterval(timer);
            }
        }, duration / steps);
    }

    // === 统计项可见时触发动画 ===
    function initStatAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.animated) {
                    entry.target.dataset.animated = 'true';
                    const valueEl = entry.target.querySelector('.stat-value');
                    if (valueEl) {
                        setTimeout(() => {
                            animateStatValue(valueEl);
                        }, 400);
                    }
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.stat-item').forEach(el => {
            observer.observe(el);
        });
    }

    // === 公式框可见性 ===
    function initFormulaBoxes() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.3 });

        document.querySelectorAll('.formula-box').forEach(el => {
            observer.observe(el);
        });
    }

    // === 全局API ===
    window.GlassEffects = {
        typeWriter: typeWriter,
        initTypewriters: initTypewriters,
        initStickyNotes: initStickyNotes
    };

    // === 初始化 ===
    function init() {
        initVisibilityObserver();
        initTypewriters();
        initStickyNotes();
        initStatAnimations();
        initFormulaBoxes();
    }

    // === 启动 ===
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
