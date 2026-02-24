/**
 * AuraFX Effects v1.0.0 - 视觉特效模块
 * 包含：Canvas粒子、Spotlight卡片、背景特效等
 * 依赖：aurafx.core.js
 */
(function(){
    'use strict';

    // 检查是否已加载核心模块
    if(typeof window.AuraFX === 'undefined'){
        console.warn('AuraFX Effects requires aurafx.core.js to be loaded first');
        return;
    }

    const $ = (s, r=document) => r.querySelector(s);
    const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

    /* ============================================================
       动画控制：尊重用户偏好
       ============================================================ */
    const mqlReduce = window.matchMedia?.('(prefers-reduced-motion: reduce)');

    function isAnimAllowed(){
        return !(mqlReduce && mqlReduce.matches);
    }

    /* ============================================================
       Spotlight Cards - 鼠标跟随光效
       ============================================================ */
    function initSpotlightCards(){
        const cards = $$('.card-spot');
        if(cards.length === 0) return;

        cards.forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                card.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
                card.style.setProperty('--my', (e.clientY - rect.top) + 'px');
            });
        });

        console.log(`✓ Initialized ${cards.length} spotlight cards`);
    }

    /* ============================================================
       Canvas Particles - 粒子背景动画
       性能优化：
       - 每2帧渲染一次
       - 页面不可见时暂停
       - 尊重 prefers-reduced-motion
       - 移动端减少粒子数量
       ============================================================ */
    function initCanvasParticles(){
        const canvas = $('#flow-canvas');
        if(!canvas) return;

        const ctx = canvas.getContext('2d');
        if(!ctx) return;

        let W = 0, H = 0, particles = [];
        let rafId = null, frame = 0, running = false;

        // 根据设备性能调整粒子数量
        const isMobile = /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent);
        const particleCount = isMobile ? 30 : 58;

        function initParticles(){
            W = window.innerWidth;
            H = window.innerHeight;
            canvas.width = W;
            canvas.height = H;

            particles = [];
            for(let i = 0; i < particleCount; i++){
                particles.push({
                    x: Math.random() * W,
                    y: Math.random() * H,
                    r: Math.random() * 1.8 + 0.5,
                    vx: (Math.random() - 0.5) * 0.32,
                    vy: (Math.random() - 0.5) * 0.32,
                    a: Math.random() * 0.35 + 0.08
                });
            }
        }

        function drawParticles(){
            if(!running){
                rafId = null;
                return;
            }

            rafId = requestAnimationFrame(drawParticles);

            // 性能优化：每2帧渲染一次
            frame = (frame + 1) % 2;
            if(frame !== 0) return;

            ctx.clearRect(0, 0, W, H);

            // 根据主题选择颜色
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            const rgb = isDark ? '139,92,246' : '37,99,235';

            // 更新和绘制粒子
            for(const p of particles){
                p.x += p.vx;
                p.y += p.vy;

                // 边界反弹
                if(p.x < 0 || p.x > W) p.vx *= -1;
                if(p.y < 0 || p.y > H) p.vy *= -1;

                // 绘制粒子
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${rgb},${p.a})`;
                ctx.fill();
            }

            // 绘制连线（性能优化：使用平方距离比较）
            const maxDistSq = 110 * 110; // 避免 sqrt
            for(let i = 0; i < particles.length; i++){
                for(let j = i + 1; j < particles.length; j++){
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distSq = dx * dx + dy * dy;

                    if(distSq < maxDistSq){
                        const dist = Math.sqrt(distSq);
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(${rgb},${0.06 * (1 - dist / 110)})`;
                        ctx.stroke();
                    }
                }
            }
        }

        function startCanvas(){
            if(!isAnimAllowed()){
                running = false;
                return;
            }
            if(running) return;

            running = true;
            if(!rafId) drawParticles();
        }

        function stopCanvas(){
            running = false;
            if(rafId){
                cancelAnimationFrame(rafId);
                rafId = null;
            }
        }

        // 初始化
        initParticles();
        startCanvas();

        // 窗口大小改变时重新初始化
        window.addEventListener('resize', () => {
            initParticles();
        }, {passive: true});

        // 页面不可见时暂停
        document.addEventListener('visibilitychange', () => {
            if(document.hidden){
                stopCanvas();
            } else {
                startCanvas();
            }
        });

        console.log(`✓ Canvas particles initialized (${particleCount} particles)`);
    }

    /* ============================================================
       Hero Particles - Hero区域专用粒子效果
       ============================================================ */
    function initHeroParticles(){
        const canvas = $('#heroParticles');
        if(!canvas) return;

        const ctx = canvas.getContext('2d');
        if(!ctx) return;

        let W = 0, H = 0, particles = [];
        let rafId = null, running = false;

        function initParticles(){
            const container = canvas.parentElement;
            W = container.offsetWidth;
            H = container.offsetHeight;
            canvas.width = W;
            canvas.height = H;

            particles = [];
            const count = 40;
            for(let i = 0; i < count; i++){
                particles.push({
                    x: Math.random() * W,
                    y: Math.random() * H,
                    r: Math.random() * 2 + 1,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    a: Math.random() * 0.5 + 0.2
                });
            }
        }

        function draw(){
            if(!running){
                rafId = null;
                return;
            }

            rafId = requestAnimationFrame(draw);

            ctx.clearRect(0, 0, W, H);

            for(const p of particles){
                p.x += p.vx;
                p.y += p.vy;

                if(p.x < 0 || p.x > W) p.vx *= -1;
                if(p.y < 0 || p.y > H) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,255,${p.a})`;
                ctx.fill();
            }
        }

        function start(){
            if(!isAnimAllowed()) return;
            if(running) return;
            running = true;
            if(!rafId) draw();
        }

        function stop(){
            running = false;
            if(rafId){
                cancelAnimationFrame(rafId);
                rafId = null;
            }
        }

        initParticles();
        start();

        window.addEventListener('resize', initParticles, {passive: true});
        document.addEventListener('visibilitychange', () => {
            document.hidden ? stop() : start();
        });

        console.log('✓ Hero particles initialized');
    }

    /* ============================================================
       Parallax Scroll - 视差滚动效果
       ============================================================ */
    function initParallax(){
        const elements = $$('[data-parallax]');
        if(elements.length === 0) return;

        if(!isAnimAllowed()){
            // 不允许动画时移除视差效果
            elements.forEach(el => el.style.transform = 'none');
            return;
        }

        let ticking = false;

        function updateParallax(){
            const scrollY = window.scrollY;

            elements.forEach(el => {
                const speed = parseFloat(el.dataset.parallax) || 0.5;
                const yPos = -(scrollY * speed);
                el.style.transform = `translateY(${yPos}px)`;
            });

            ticking = false;
        }

        function onScroll(){
            if(ticking) return;
            ticking = true;
            requestAnimationFrame(updateParallax);
        }

        window.addEventListener('scroll', onScroll, {passive: true});
        updateParallax();

        console.log(`✓ Parallax initialized for ${elements.length} elements`);
    }

    /* ============================================================
       Smooth Scroll - 平滑滚动到锚点
       ============================================================ */
    function initSmoothScroll(){
        const links = $$('a[href^="#"]');
        if(links.length === 0) return;

        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if(href === '#') return;

                const target = $(href);
                if(!target) return;

                e.preventDefault();

                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // 更新URL（可选）
                if(history.pushState){
                    history.pushState(null, null, href);
                }
            });
        });

        console.log(`✓ Smooth scroll initialized for ${links.length} links`);
    }

    /* ============================================================
       初始化所有特效
       ============================================================ */
    function init(){
        // 检查是否允许动画
        if(!isAnimAllowed()){
            console.log('⚠ Animations disabled (prefers-reduced-motion)');
            return;
        }

        // 初始化各个特效模块
        initSpotlightCards();
        initCanvasParticles();
        initHeroParticles();
        initParallax();
        initSmoothScroll();

        console.log('✓ AuraFX Effects initialized');
    }

    // 暴露到全局
    window.AuraFX = window.AuraFX || {};
    window.AuraFX.Effects = {
        init,
        initSpotlightCards,
        initCanvasParticles,
        initHeroParticles,
        initParallax,
        initSmoothScroll
    };

    // 自动初始化
    if(document.readyState === 'loading'){
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
