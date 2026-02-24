/* ==========================================
 * SWISS ARCHITECTURAL EXTENSIONS - JS
 * 瑞士建筑风格交互逻辑
 * ==========================================
 */

(function() {
    'use strict';

    // === 1. 自定义光标系统 ===
    function initSwissCursor() {
        const cursorSystem = document.getElementById('cursor-system');
        if (!cursorSystem) return;

        const crosshair = cursorSystem.querySelector('.cursor-crosshair');
        const dot = cursorSystem.querySelector('.cursor-dot');

        let mx = window.innerWidth / 2;
        let my = window.innerHeight / 2;

        document.addEventListener('mousemove', (e) => {
            mx = e.clientX;
            my = e.clientY;

            if (crosshair) {
                crosshair.style.left = mx + 'px';
                crosshair.style.top = my + 'px';
            }

            // 光标点有轻微延迟
            setTimeout(() => {
                if (dot) {
                    dot.style.left = mx + 'px';
                    dot.style.top = my + 'px';
                }
            }, 50);
        });

        // 悬停状态
        document.querySelectorAll('.hover-target, button, a, .card, .blueprint-card').forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
        });
    }

    // === 2. 流场背景（Canvas）===
    function initFlowCanvas() {
        const canvas = document.getElementById('canvas-flow');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let w, h;
        let particles = [];

        function resize() {
            w = window.innerWidth;
            h = window.innerHeight;
            canvas.width = w;
            canvas.height = h;

            particles = [];
            for (let i = 0; i < 100; i++) {
                particles.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    vx: (Math.random() - 0.5) * 2,
                    vy: (Math.random() - 0.5) * 2,
                    life: Math.random() * 100
                });
            }
        }

        function draw() {
            ctx.clearRect(0, 0, w, h);
            ctx.strokeStyle = '#002fa7'; // Klein Blue
            ctx.lineWidth = 0.5;

            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.life--;

                if (p.life <= 0 || p.x < 0 || p.x > w || p.y < 0 || p.y > h) {
                    p.x = Math.random() * w;
                    p.y = Math.random() * h;
                    p.life = 100;
                }

                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p.x - p.vx * 10, p.y - p.vy * 10);
                ctx.stroke();
            });

            requestAnimationFrame(draw);
        }

        window.addEventListener('resize', resize);
        resize();
        draw();
    }

    // === 3. 滚动动画观察器 ===
    function initScrollObserver() {
        const slides = document.querySelectorAll('.slide');
        const deckBtns = document.querySelectorAll('.deck-btn');

        if (slides.length === 0) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');

                    // 更新导航按钮
                    const idx = parseInt(entry.target.id.split('-')[1]);
                    deckBtns.forEach(btn => btn.classList.remove('active'));
                    if (deckBtns[idx]) {
                        deckBtns[idx].classList.add('active');
                    }
                }
            });
        }, { threshold: 0.5 });

        slides.forEach(slide => observer.observe(slide));
    }

    // === 4. 页面滚动导航 ===
    window.scrollToPage = function(idx) {
        const slide = document.getElementById(`slide-${idx}`);
        if (slide) {
            slide.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // === 5. SVG 信号脉冲动画 ===
    function initPulseAnimation() {
        const btnPulse = document.getElementById('btn-pulse');
        const dotEl = document.getElementById('signal-dot');

        if (!btnPulse || !dotEl) return;

        btnPulse.addEventListener('click', () => {
            dotEl.style.opacity = 1;

            // 定义路径点
            const path = [
                {x: 50, y: 280}, {x: 100, y: 200}, {x: 120, y: 180},
                {x: 120, y: 130}, {x: 120, y: 100},
                {x: 120, y: 70}, {x: 120, y: 55},
                {x: 200, y: 55}, {x: 300, y: 60},
                {x: 300, y: 10}
            ];

            let step = 0;
            const interval = setInterval(() => {
                if (step >= path.length) {
                    clearInterval(interval);
                    dotEl.style.opacity = 0;
                    return;
                }
                dotEl.setAttribute('cx', path[step].x);
                dotEl.setAttribute('cy', path[step].y);
                step++;
            }, 100);
        });
    }

    // === 6. 交互式代码行 ===
    function initInteractiveCode() {
        const lines = document.querySelectorAll('.interactive-line');
        const descBoxes = document.querySelectorAll('.desc-box');

        if (lines.length === 0) return;

        lines.forEach(line => {
            line.addEventListener('mouseenter', () => {
                lines.forEach(l => l.classList.remove('active'));
                line.classList.add('active');

                descBoxes.forEach(box => box.style.opacity = 0.3);
                const target = document.getElementById(line.dataset.target);
                if (target) {
                    target.style.opacity = 1;
                }
            });
        });
    }

    // === 7. 沙盒实验室 ===
    function initSandbox() {
        const container = document.getElementById('sentence-container');
        const selWord = document.getElementById('selected-word');
        const heatGrid = document.getElementById('heat-grid');

        if (!container || !selWord || !heatGrid) return;

        const sentence = "The animal didn't cross the street because it was too tired";
        const words = sentence.split(' ');

        // 初始化热力图网格
        for (let i = 0; i < 100; i++) {
            const cell = document.createElement('div');
            cell.className = 'heat-cell';
            heatGrid.appendChild(cell);
        }

        // 初始化单词
        words.forEach((word, idx) => {
            const span = document.createElement('span');
            span.className = 'token-word';
            span.textContent = word;
            span.dataset.idx = idx;
            span.addEventListener('mouseenter', () => highlightWord(idx, word));
            container.appendChild(span);
        });

        function highlightWord(idx, word) {
            selWord.textContent = word;

            // 随机化热力图模拟注意力
            const cells = heatGrid.querySelectorAll('.heat-cell');
            cells.forEach(cell => {
                const val = Math.random();
                cell.style.background = val > 0.8 ? '#002fa7' : (val > 0.5 ? '#668cff' : '#f0f0f0');
            });

            // 特殊逻辑：'it' 关注 'animal'
            const tokenWords = container.querySelectorAll('.token-word');
            tokenWords.forEach(tw => tw.classList.remove('active'));

            if (word === 'it') {
                tokenWords[1].classList.add('active'); // animal
            }
        }
    }

    // === 8. 蓝图卡片鼠标跟随 ===
    function initBlueprintCards() {
        const cards = document.querySelectorAll('.blueprint-card');

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                card.style.setProperty('--mx', x + 'px');
                card.style.setProperty('--my', y + 'px');
            });
        });
    }

    // === 初始化所有功能 ===
    function init() {
        initSwissCursor();
        initFlowCanvas();
        initScrollObserver();
        initPulseAnimation();
        initInteractiveCode();
        initSandbox();
        initBlueprintCards();
    }

    // DOM 加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
    // ── Enhanced Typewriter Effect for Hero Titles ──
    function typewriterEffect() {
        const title1 = document.getElementById('heroTitle1');
        const title2 = document.getElementById('heroTitle2');
        const title3 = document.getElementById('heroTitle3');

        if (!title1 || !title2 || !title3) return;

        // Remove typewriter class after animation
        setTimeout(() => {
            title1.classList.remove('typewriter');
            title1.style.borderRight = 'none';

            // Show title2 with character reveal
            setTimeout(() => {
                const text2 = title2.textContent;
                title2.textContent = '';
                title2.style.opacity = '1';

                text2.split('').forEach((char, i) => {
                    const span = document.createElement('span');
                    span.textContent = char;
                    span.className = 'char-reveal';
                    span.style.animationDelay = `${i * 0.05}s`;
                    title2.appendChild(span);
                });

                // Show title3 with fade in
                setTimeout(() => {
                    title3.style.opacity = '1';
                    title3.style.animation = 'fadeUp 0.8s ease-out';
                }, 1200);
            }, 500);
        }, 2500);
    }

    // ── Scroll Reveal Animation ──
    function initScrollReveal() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;

                    // Add different animations based on element type
                    if (element.classList.contains('compare-card')) {
                        element.style.animation = 'scaleIn 0.6s ease-out forwards';
                    } else if (element.classList.contains('sk-code-block')) {
                        element.style.animation = 'slideInLeft 0.8s ease-out forwards';
                    } else if (element.classList.contains('sk-math-block')) {
                        element.style.animation = 'slideInRight 0.8s ease-out forwards';
                    } else {
                        element.style.animation = 'fadeUp 0.8s ease-out forwards';
                    }

                    observer.unobserve(element);
                }
            });
        }, { threshold: 0.1 });

        // Observe all major content blocks
        document.querySelectorAll('.sk-tldr, .sk-math-block, .sk-code-block, .compare-card, .sk-insight, .dialogue').forEach(el => {
            el.style.opacity = '0';
            observer.observe(el);
        });
    }

    // ── KaTeX Rendering ──
    window.addEventListener('load', function() {
        // Initialize typewriter effect
        typewriterEffect();

        // Initialize scroll reveal
        initScrollReveal();

        // 等待KaTeX库完全加载
        const renderMath = () => {
            if (typeof renderMathInElement === 'undefined') {
                console.log('KaTeX not loaded yet, retrying...');
                setTimeout(renderMath, 100);
                return;
            }

            try {
                renderMathInElement(document.body, {
                    delimiters: [
                        { left: "$$", right: "$$", display: true },
                        { left: "$", right: "$", display: false }
                    ],
                    throwOnError: false,
                    strict: false,
                    trust: true
                });
                console.log('Math rendering completed');
            } catch (e) {
                console.error('Math rendering error:', e);
            }
        };

        renderMath();
    });

    // ── Progress Bar & Nav Enhancement ──
    window.addEventListener('scroll', () => {
        const h = document.documentElement;
        const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
        document.getElementById('progressBar').style.width = pct + '%';

        // Add scrolled class to nav
        const nav = document.querySelector('.top-nav');
        if (h.scrollTop > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // ── Fade-in Observer ──
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.08 });
    document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));

    // ── Quiz Logic ──
    function checkQuiz(el, qid, correct) {
        const quiz = document.getElementById(qid);
        if (quiz.dataset.answered) return;
        quiz.dataset.answered = '1';
        el.classList.add(correct ? 'correct' : 'wrong');
        if (!correct) {
            quiz.querySelectorAll('.sk-quiz-opt').forEach(opt => {
                if (opt.getAttribute('onclick')?.includes('true')) opt.classList.add('correct');
            });
        }
        quiz.querySelector('.sk-quiz-explain').style.display = 'block';
    }

    // ── Hero Particles with Mouse Interaction ──
    (function() {
        const canvas = document.getElementById('heroParticles');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let W, H, particles = [];
        let mouse = { x: null, y: null, radius: 150 };

        function resize() {
            const rect = canvas.parentElement.getBoundingClientRect();
            W = canvas.width = rect.width;
            H = canvas.height = rect.height;
        }
        resize();
        window.addEventListener('resize', resize);

        // Mouse tracking
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        });
        canvas.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        const colors = [
            { base: 'rgba(0,47,167,', glow: '0,47,167' }
        ];

        for (let i = 0; i < 40; i++) {
            const colorObj = colors[0];
            particles.push({
                x: Math.random() * W,
                y: Math.random() * H,
                baseX: 0,
                baseY: 0,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                r: Math.random() * 1.5 + 0.5,
                color: colorObj,
                opacity: Math.random() * 0.3 + 0.2
            });
            particles[i].baseX = particles[i].x;
            particles[i].baseY = particles[i].y;
        }

        function draw() {
            ctx.clearRect(0, 0, W, H);

            particles.forEach(p => {
                // Mouse interaction
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - p.x;
                    const dy = mouse.y - p.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < mouse.radius) {
                        const force = (mouse.radius - dist) / mouse.radius;
                        const angle = Math.atan2(dy, dx);
                        p.x -= Math.cos(angle) * force * 2;
                        p.y -= Math.sin(angle) * force * 2;
                    }
                }

                // Return to base position
                const dxBase = p.baseX - p.x;
                const dyBase = p.baseY - p.y;
                p.x += dxBase * 0.03;
                p.y += dyBase * 0.03;

                // Normal movement
                p.x += p.vx;
                p.y += p.vy;
                p.baseX += p.vx;
                p.baseY += p.vy;

                // Bounce
                if (p.baseX < 0 || p.baseX > W) {
                    p.vx *= -1;
                    p.baseX = Math.max(0, Math.min(W, p.baseX));
                }
                if (p.baseY < 0 || p.baseY > H) {
                    p.vy *= -1;
                    p.baseY = Math.max(0, Math.min(H, p.baseY));
                }

                // Draw particle (no glow for performance)
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = p.color.base + p.opacity + ')';
                ctx.fill();
            });

            // Draw connections (optimized - skip some for performance)
            for (let i = 0; i < particles.length; i += 2) {
                for (let j = i + 2; j < particles.length; j += 2) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        const opacity = (1 - dist / 120) * 0.1;
                        ctx.strokeStyle = `rgba(0,47,167,${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(draw);
        }
        draw();
    })();

    // ═══════════════════════════════════════════════════════════════
    // Lab 1: Attention Weight Visualizer
    // ═══════════════════════════════════════════════════════════════
    const attnWeights = [
        [0.82, 0.05, 0.08, 0.05],
        [0.08, 0.72, 0.12, 0.08],
        [0.02, 0.05, 0.85, 0.08],
        [0.03, 0.05, 0.35, 0.57],
    ];
    const srcLabels = ['我', '爱', '北京', '天安门'];
    const tgtLabels = ['I', 'love', 'Beijing', 'Tiananmen'];
    let currentTarget = -1;

    function setTarget(idx) {
        currentTarget = idx;
        document.querySelectorAll('#tgtButtons .attn-token').forEach((b, i) => {
            b.classList.toggle('active', i === idx);
        });
        drawAttn();
    }

    function drawAttn() {
        const canvas = document.getElementById('attnCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.parentElement.getBoundingClientRect();
        const W = rect.width - 32;
        const H = 320;
        canvas.width = W * dpr; canvas.height = H * dpr;
        canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, W, H);

        if (currentTarget < 0) {
            ctx.fillStyle = '#6a6a7a';
            ctx.font = '13px "Inter", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('点击上方绿色目标词开始', W / 2, H / 2);
            return;
        }

        const weights = attnWeights[currentTarget];
        const srcY = 65, tgtY = 245;
        const margin = 60;
        const spacing = (W - margin * 2) / (srcLabels.length - 1);
        const srcPositions = srcLabels.map((_, i) => margin + i * spacing);
        const tgtX = W / 2;

        // Draw source tokens
        srcLabels.forEach((label, i) => {
            const x = srcPositions[i];
            const w = weights[i];
            const radius = 18 + w * 28;

            // Glow
            const grad = ctx.createRadialGradient(x, srcY, 0, x, srcY, radius + 20);
            grad.addColorStop(0, `rgba(249,115,22,${w * 0.45})`);
            grad.addColorStop(1, 'rgba(249,115,22,0)');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(x, srcY, radius + 20, 0, Math.PI * 2);
            ctx.fill();

            // Circle
            ctx.beginPath();
            ctx.arc(x, srcY, radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(249,115,22,${0.08 + w * 0.25})`;
            ctx.fill();
            ctx.strokeStyle = `rgba(249,115,22,${0.3 + w * 0.7})`;
            ctx.lineWidth = 1 + w * 2.5;
            ctx.stroke();

            // Token label
            ctx.fillStyle = '#f97316';
            ctx.font = `${w > 0.3 ? 'bold ' : ''}${13 + w * 5}px "JetBrains Mono", monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(label, x, srcY);

            // Weight number
            ctx.fillStyle = '#22d3ee';
            ctx.font = 'bold 11px "JetBrains Mono", monospace';
            ctx.textBaseline = 'top';
            ctx.fillText(w.toFixed(2), x, srcY + radius + 8);

            // Connection curve
            ctx.beginPath();
            ctx.moveTo(x, srcY + radius + 2);
            ctx.bezierCurveTo(
                x, (srcY + tgtY) / 2,
                tgtX, (srcY + tgtY) / 2,
                tgtX, tgtY - 26
            );
            ctx.strokeStyle = `rgba(16,185,129,${0.15 + w * 0.7})`;
            ctx.lineWidth = 1 + w * 6;
            ctx.stroke();
        });

        // Draw target token
        ctx.beginPath();
        ctx.arc(tgtX, tgtY, 26, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(16,185,129,0.12)';
        ctx.fill();
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 14px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(tgtLabels[currentTarget], tgtX, tgtY);

        // Center label
        ctx.fillStyle = '#6a6a7a';
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.textBaseline = 'middle';
        ctx.fillText('← Attention 权重 →', tgtX, (srcY + tgtY) / 2 + 35);

        // Output text
        const maxI = weights.indexOf(Math.max(...weights));
        document.getElementById('attnOutput').textContent =
            `目标词「${tgtLabels[currentTarget]}」最关注「${srcLabels[maxI]}」(权重 ${weights[maxI].toFixed(2)}) | ` +
            `分布: ${srcLabels.map((s, i) => `${s}=${weights[i].toFixed(2)}`).join(', ')} | Σ = ${weights.reduce((a, b) => a + b, 0).toFixed(2)}`;
    }

    // ═══════════════════════════════════════════════════════════════
    // Lab 2: Softmax Temperature Simulator
    // ═══════════════════════════════════════════════════════════════
    (function() {
        const canvas = document.getElementById('tempCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const slider = document.getElementById('tempSlider');
        const valDisplay = document.getElementById('tempVal');
        const output = document.getElementById('tempOutput');

        const rawScores = [4.2, 1.8, 0.5, 0.3];
        const labels = ['北京', '天安门', '爱', '我'];
        const colors = ['#10b981', '#22d3ee', '#8b5cf6', '#f97316'];

        function softmax(arr) {
            const max = Math.max(...arr);
            const exps = arr.map(x => Math.exp(x - max));
            const sum = exps.reduce((a, b) => a + b, 0);
            return exps.map(e => e / sum);
        }

        function draw() {
            const temp = parseFloat(slider.value);
            valDisplay.textContent = temp.toFixed(1);

            const scaled = rawScores.map(s => s / temp);
            const probs = softmax(scaled);

            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.parentElement.getBoundingClientRect();
            const W = rect.width;
            const H = 260;
            canvas.width = W * dpr; canvas.height = H * dpr;
            canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
            ctx.scale(dpr, dpr);
            ctx.clearRect(0, 0, W, H);

            const pad = { l: 70, r: 30, t: 30, b: 50 };
            const chartW = W - pad.l - pad.r;
            const chartH = H - pad.t - pad.b;
            const barW = Math.min(80, (chartW - 50) / 4);
            const gap = (chartW - barW * 4) / 5;

            // Title
            ctx.fillStyle = '#6a6a7a';
            ctx.font = '10px "JetBrains Mono", monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillText('Softmax 输出概率', W / 2, 8);

            // Grid lines
            for (let i = 0; i <= 4; i++) {
                const y = pad.t + chartH - (i / 4) * chartH;
                ctx.strokeStyle = 'rgba(255,255,255,0.04)';
                ctx.lineWidth = 1;
                ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(pad.l + chartW, y); ctx.stroke();
                ctx.fillStyle = '#6a6a7a';
                ctx.font = '9px "JetBrains Mono", monospace';
                ctx.textAlign = 'right';
                ctx.textBaseline = 'middle';
                ctx.fillText((i * 25) + '%', pad.l - 8, y);
            }

            // Bars
            probs.forEach((p, i) => {
                const x = pad.l + gap + i * (barW + gap);
                const barH = p * chartH;
                const y = pad.t + chartH - barH;

                // Gradient fill
                const grad = ctx.createLinearGradient(x, y, x, pad.t + chartH);
                grad.addColorStop(0, colors[i] + 'cc');
                grad.addColorStop(1, colors[i] + '33');
                ctx.fillStyle = grad;

                // Rounded top bar
                const r = 4;
                ctx.beginPath();
                ctx.moveTo(x, pad.t + chartH);
                ctx.lineTo(x, y + r);
                ctx.quadraticCurveTo(x, y, x + r, y);
                ctx.lineTo(x + barW - r, y);
                ctx.quadraticCurveTo(x + barW, y, x + barW, y + r);
                ctx.lineTo(x + barW, pad.t + chartH);
                ctx.closePath();
                ctx.fill();

                // Border
                ctx.strokeStyle = colors[i];
                ctx.lineWidth = 1.5;
                ctx.stroke();

                // Probability
                ctx.fillStyle = '#e8e8ed';
                ctx.font = 'bold 11px "JetBrains Mono", monospace';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                ctx.fillText((p * 100).toFixed(1) + '%', x + barW / 2, y - 4);

                // Token label
                ctx.fillStyle = colors[i];
                ctx.font = '11px "JetBrains Mono", monospace';
                ctx.textBaseline = 'top';
                ctx.fillText(labels[i], x + barW / 2, pad.t + chartH + 8);

                // Raw score
                ctx.fillStyle = '#6a6a7a';
                ctx.font = '8px "JetBrains Mono", monospace';
                ctx.fillText(`s=${rawScores[i]}`, x + barW / 2, pad.t + chartH + 24);
            });

            // Baseline
            ctx.strokeStyle = 'rgba(255,255,255,0.1)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(pad.l, pad.t + chartH);
            ctx.lineTo(pad.l + chartW, pad.t + chartH);
            ctx.stroke();

            // 25% uniform line
            const uniformY = pad.t + chartH - 0.25 * chartH;
            ctx.strokeStyle = 'rgba(245,158,11,0.3)';
            ctx.setLineDash([4, 4]);
            ctx.beginPath(); ctx.moveTo(pad.l, uniformY); ctx.lineTo(pad.l + chartW, uniformY); ctx.stroke();
            ctx.setLineDash([]);
            ctx.fillStyle = '#f59e0b';
            ctx.font = '8px "JetBrains Mono", monospace';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'bottom';
            ctx.fillText('均匀 25%', pad.l + chartW, uniformY - 4);

            // Status
            const maxP = Math.max(...probs);
            let status = '';
            if (maxP > 0.95) status = '接近 one-hot — 梯度消失风险！';
            else if (maxP < 0.35) status = '接近均匀 — 失去区分度！';
            else status = '√ 有区分度的软分布 — 理想状态';

            output.textContent =
                `√d_k = ${temp.toFixed(1)} | 缩放后: [${scaled.map(s => s.toFixed(2)).join(', ')}] | ` +
                `最大: ${(maxP * 100).toFixed(1)}% (${labels[probs.indexOf(maxP)]}) | ${status}`;
        }

        slider.addEventListener('input', draw);
        draw();
    })();

    // ═══════════════════════════════════════════════════════════════
    // Lab 3: Step-by-Step Attention Calculator
    // ═══════════════════════════════════════════════════════════════
    let calcCurrentStep = -1;
    const calcData = {
        q: [1.5, 0.8],
        keys: [[0.2, 0.1], [0.5, 0.3], [1.4, 0.9], [1.0, 0.7]],
        values: [[0.3, 0.9], [0.7, 0.4], [1.2, 0.6], [0.9, 0.8]],
        labels: ['我', '爱', '北京', '天安门'],
        dk: 2
    };

    function calcStep(step) {
        calcCurrentStep = step;
        document.querySelectorAll('#calcSteps .attn-token').forEach((b, i) => {
            b.style.borderColor = i === step ? '#22d3ee' : 'rgba(249,115,22,.3)';
            b.style.background = i <= step ? 'rgba(34,211,238,.12)' : 'rgba(249,115,22,.08)';
            b.style.color = i <= step ? '#22d3ee' : '#f97316';
        });
        drawCalc();
    }

    function drawCalc() {
        const canvas = document.getElementById('calcCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.parentElement.getBoundingClientRect();
        const W = rect.width;
        const H = 280;
        canvas.width = W * dpr; canvas.height = H * dpr;
        canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, W, H);

        const { q, keys, values, labels, dk } = calcData;
        const step = calcCurrentStep;

        if (step < 0) {
            ctx.fillStyle = '#6a6a7a';
            ctx.font = '13px "Inter", sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('点击上方步骤按钮开始逐步计算', W / 2, H / 2);
            return;
        }

        // Compute
        const rawScores = keys.map(k => q[0] * k[0] + q[1] * k[1]);
        const sqrtDk = Math.sqrt(dk);
        const scaledScores = rawScores.map(s => s / sqrtDk);

        function softmax(arr) {
            const mx = Math.max(...arr);
            const exps = arr.map(x => Math.exp(x - mx));
            const sm = exps.reduce((a, b) => a + b, 0);
            return exps.map(e => e / sm);
        }
        const probs = softmax(scaledScores);

        const colW = Math.min(160, (W - 80) / 4);
        const startX = 65;
        const rowH = 48;
        const headerY = 28;

        // Column headers
        const headers = ['q · kᵢ', '÷ √d_k', 'Softmax', '× vᵢ'];
        const headerColors = ['#8b5cf6', '#f59e0b', '#10b981', '#22d3ee'];

        headers.forEach((h, i) => {
            const x = startX + i * colW + colW / 2;
            const active = i <= step;
            ctx.fillStyle = active ? headerColors[i] : '#3a3a4a';
            ctx.font = `${active ? 'bold ' : ''}10px "JetBrains Mono", monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillText(h, x, headerY);

            // Highlight active column
            if (i === step) {
                ctx.fillStyle = headerColors[i] + '15';
                ctx.fillRect(startX + i * colW + 2, headerY + 16, colW - 4, rowH * 4 + 8);
                ctx.strokeStyle = headerColors[i] + '30';
                ctx.lineWidth = 1;
                ctx.strokeRect(startX + i * colW + 2, headerY + 16, colW - 4, rowH * 4 + 8);
            }
        });

        // Progress arrow
        if (step > 0) {
            for (let i = 0; i < step; i++) {
                const ax = startX + (i + 1) * colW;
                ctx.fillStyle = '#6a6a7a';
                ctx.font = '10px "JetBrains Mono", monospace';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'top';
                ctx.fillText('→', ax, headerY);
            }
        }

        // Data rows
        labels.forEach((label, i) => {
            const y = headerY + 30 + i * rowH;

            // Token label
            ctx.fillStyle = '#f97316';
            ctx.font = '11px "JetBrains Mono", monospace';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            ctx.fillText(label, startX - 12, y + 8);

            // Row separator
            ctx.strokeStyle = 'rgba(255,255,255,0.03)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(startX, y + rowH - 2);
            ctx.lineTo(startX + colW * 4, y + rowH - 2);
            ctx.stroke();

            // Col 0: Raw scores
            if (step >= 0) {
                ctx.fillStyle = step === 0 ? '#8b5cf6' : '#8b5cf680';
                ctx.font = `${step === 0 ? 'bold ' : ''}12px "JetBrains Mono", monospace`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(rawScores[i].toFixed(2), startX + colW / 2, y + 8);
            }

            // Col 1: Scaled
            if (step >= 1) {
                ctx.fillStyle = step === 1 ? '#f59e0b' : '#f59e0b80';
                ctx.font = `${step === 1 ? 'bold ' : ''}12px "JetBrains Mono", monospace`;
                ctx.textAlign = 'center';
                ctx.fillText(scaledScores[i].toFixed(2), startX + colW + colW / 2, y + 8);
            }

            // Col 2: Softmax (probability bars)
            if (step >= 2) {
                const barMaxW = colW * 0.55;
                const barH = 16;
                const bx = startX + 2 * colW + (colW - barMaxW) / 2 - 8;
                const by = y;
                const bw = probs[i] * barMaxW;

                // Bar bg
                ctx.fillStyle = 'rgba(16,185,129,0.08)';
                ctx.fillRect(bx, by, barMaxW, barH);

                // Bar fill
                const grad = ctx.createLinearGradient(bx, by, bx + bw, by);
                grad.addColorStop(0, 'rgba(16,185,129,0.85)');
                grad.addColorStop(1, 'rgba(16,185,129,0.4)');
                ctx.fillStyle = grad;
                ctx.fillRect(bx, by, bw, barH);

                // Percentage
                ctx.fillStyle = step === 2 ? '#10b981' : '#10b98190';
                ctx.font = `${step === 2 ? 'bold ' : ''}10px "JetBrains Mono", monospace`;
                ctx.textAlign = 'left';
                ctx.textBaseline = 'middle';
                ctx.fillText((probs[i] * 100).toFixed(1) + '%', bx + barMaxW + 4, y + 8);
            }

            // Col 3: Weighted values
            if (step >= 3) {
                const wv = values[i].map(v => (probs[i] * v).toFixed(3));
                ctx.fillStyle = '#22d3ee';
                ctx.font = '10px "JetBrains Mono", monospace';
                ctx.textAlign = 'center';
                ctx.fillText(`[${wv.join(', ')}]`, startX + 3 * colW + colW / 2, y + 8);
            }
        });

        // Final output vector
        if (step >= 3) {
            const outVec = [0, 1].map(d =>
                probs.reduce((sum, p, i) => sum + p * values[i][d], 0)
            );

            const oy = H - 25;
            // Bg highlight
            ctx.fillStyle = 'rgba(34,211,238,0.08)';
            ctx.fillRect(W / 2 - 160, oy - 14, 320, 28);
            ctx.strokeStyle = 'rgba(34,211,238,0.2)';
            ctx.lineWidth = 1;
            ctx.strokeRect(W / 2 - 160, oy - 14, 320, 28);

            ctx.fillStyle = '#22d3ee';
            ctx.font = 'bold 12px "JetBrains Mono", monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`Output = [${outVec.map(v => v.toFixed(3)).join(', ')}]`, W / 2, oy);

            // Sum arrow
            ctx.strokeStyle = '#22d3ee';
            ctx.lineWidth = 1;
            ctx.setLineDash([3, 3]);
            ctx.beginPath();
            ctx.moveTo(W / 2, oy - 30);
            ctx.lineTo(W / 2, oy - 16);
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.fillStyle = '#6a6a7a';
            ctx.font = '9px "JetBrains Mono", monospace';
            ctx.fillText('Σ 加权求和', W / 2, oy - 36);
        }

        // Step descriptions
        const descs = [
            'Step 1: q·kᵢ 点积 → "北京"得分最高(2.82)，语义最相关',
            'Step 2: ÷ √2 ≈ 1.414 → 分数缩小，防止 Softmax 饱和',
            'Step 3: Softmax 归一化 → "北京" 48.9%，"天安门" 28.8%',
            'Step 4: 加权求和 → "Beijing" 的新表示，融合了主要来自"北京"的信息'
        ];
        document.getElementById('calcOutput').textContent = descs[step];
    }

    // ═══════════════════════════════════════════════════════════════
    // FLOATING BUBBLES ANIMATION
    // ═══════════════════════════════════════════════════════════════
    function createFloatingBubbles() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        const bubbleContainer = document.createElement('div');
        bubbleContainer.className = 'bubble-container';
        bubbleContainer.style.cssText = `
            position: absolute;
            inset: 0;
            z-index: 3;
            pointer-events: none;
            overflow: hidden;
        `;

        const colors = [
            'rgba(249,115,22,0.15)',
            'rgba(139,92,246,0.15)',
            'rgba(34,211,238,0.15)',
            'rgba(16,185,129,0.15)',
            'rgba(245,158,11,0.15)',
            'rgba(236,72,153,0.15)'
        ];

        for (let i = 0; i < 20; i++) {
            const bubble = document.createElement('div');
            const size = Math.random() * 60 + 20;
            const left = Math.random() * 100;
            const delay = Math.random() * 10;
            const duration = Math.random() * 15 + 15;
            const color = colors[Math.floor(Math.random() * colors.length)];

            bubble.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                border-radius: 50%;
                bottom: -100px;
                left: ${left}%;
                animation: floatUp ${duration}s ease-in-out ${delay}s infinite;
                filter: blur(${Math.random() * 3 + 1}px);
                opacity: ${Math.random() * 0.5 + 0.3};
            `;

            bubbleContainer.appendChild(bubble);
        }

        hero.appendChild(bubbleContainer);

        // Add keyframes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes floatUp {
                0% {
                    transform: translateY(0) translateX(0) scale(1);
                    opacity: 0;
                }
                10% {
                    opacity: 0.6;
                }
                50% {
                    transform: translateY(-50vh) translateX(${Math.random() * 100 - 50}px) scale(1.2);
                    opacity: 0.4;
                }
                90% {
                    opacity: 0.2;
                }
                100% {
                    transform: translateY(-100vh) translateX(${Math.random() * 150 - 75}px) scale(0.8);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // ═══════════════════════════════════════════════════════════════
    // INTERACTIVE CODE ANNOTATIONS
    // ═══════════════════════════════════════════════════════════════
    function initCodeAnnotations() {
        const codeLines = document.querySelectorAll('.code-line');
        const annotations = document.querySelectorAll('.code-annotation');
        const placeholder = document.querySelector('.code-placeholder');

        if (codeLines.length === 0) return;

        codeLines.forEach(line => {
            line.addEventListener('mouseenter', function() {
                const lineNum = this.getAttribute('data-line');

                // Remove active class from all lines and annotations
                codeLines.forEach(l => l.classList.remove('active'));
                annotations.forEach(a => a.classList.remove('active'));

                // Add active class to current line
                this.classList.add('active');

                // Show corresponding annotation
                const annotation = document.querySelector(`.code-annotation[data-for="${lineNum}"]`);
                if (annotation) {
                    annotation.classList.add('active');
                    if (placeholder) placeholder.style.display = 'none';
                }
            });
        });

        // Optional: Reset on mouse leave from code area
        const codeInteractive = document.querySelector('.code-interactive');
        if (codeInteractive) {
            codeInteractive.addEventListener('mouseleave', function() {
                codeLines.forEach(l => l.classList.remove('active'));
                annotations.forEach(a => a.classList.remove('active'));
                if (placeholder) placeholder.style.display = 'block';
            });
        }
    }

    // Initialize bubbles when page loads
    // ── Mouse Cursor Glow Effect ──
    (function() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            hero.style.setProperty('--mouse-x', x + 'px');
            hero.style.setProperty('--mouse-y', y + 'px');
        });
    })();

    // ── Hero Stats Counter Animation ──
    function animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }

    function initHeroStatsAnimation() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const nums = entry.target.querySelectorAll('.hero-stat .num');
                    nums.forEach(num => {
                        const target = parseInt(num.textContent);
                        num.textContent = '0';
                        setTimeout(() => {
                            animateCounter(num, target, 1500);
                        }, 500);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        const heroStats = document.querySelector('.hero-stats');
        if (heroStats) {
            observer.observe(heroStats);
        }
    }

    // ── Swiss Architectural Cursor System ──
    (function() {
        const cursorSystem = document.getElementById('cursor-system');
        const cursorCrosshair = document.querySelector('.cursor-crosshair');
        const cursorDot = document.querySelector('.cursor-dot');

        if (!cursorSystem || !cursorCrosshair || !cursorDot) return;

        // Track mouse position
        document.addEventListener('mousemove', (e) => {
            const x = e.clientX;
            const y = e.clientY;

            cursorCrosshair.style.left = x + 'px';
            cursorCrosshair.style.top = y + 'px';
            cursorDot.style.left = x + 'px';
            cursorDot.style.top = y + 'px';
        });

        // Add hovering class on interactive elements
        const interactiveElements = 'a, button, input, textarea, select, [role="button"], .hero-stat, .callout';

        document.addEventListener('mouseover', (e) => {
            if (e.target.closest(interactiveElements)) {
                document.body.classList.add('hovering');
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.closest(interactiveElements)) {
                document.body.classList.remove('hovering');
            }
        });
    })();

    // ═══════════════════════════════════════════════════════════════
    // DOMContentLoaded
    // ═══════════════════════════════════════════════════════════════
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            typewriterEffect();
            initHeroStatsAnimation();
            createFloatingBubbles();
            initCodeAnnotations();
        });
    } else {
        typewriterEffect();
        initHeroStatsAnimation();
        createFloatingBubbles();
        initCodeAnnotations();
    }

