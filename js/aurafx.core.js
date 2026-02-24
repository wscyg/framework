/**
 * AuraFX Core v1.0.0 - 安全优化版
 * 核心原则：找不到DOM就跳过，永不报错
 */
(function(){
    'use strict';

    // 安全的DOM查询辅助函数
    const $ = (s, r=document) => r.querySelector(s);
    const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

    /* ============================================================
       动画控制：尊重用户偏好
       ============================================================ */
    const mqlReduce = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    let userAnimEnabled = true;

    function isAnimAllowed(){
        const reduce = !!(mqlReduce && mqlReduce.matches);
        return userAnimEnabled && !reduce;
    }

    /* ============================================================
       主题切换（可选功能）
       ============================================================ */
    function initTheme(){
        const themeBtn = $('#themeBtn');
        const themeLabel = $('#themeLabel');

        if(!themeBtn) return; // 页面不需要主题切换，跳过

        function getPreferredTheme(){
            const saved = localStorage.getItem('aurafx-theme');
            if(saved) return saved;
            const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
            return prefersDark ? 'dark' : 'light';
        }

        function setTheme(t){
            document.documentElement.setAttribute('data-theme', t);
            localStorage.setItem('aurafx-theme', t);
            if(themeLabel) themeLabel.textContent = t[0].toUpperCase() + t.slice(1);
        }

        setTheme(getPreferredTheme());

        themeBtn.addEventListener('click', ()=>{
            const cur = document.documentElement.getAttribute('data-theme') || 'light';
            setTheme(cur === 'light' ? 'dark' : 'light');
            if(window.toast){
                toast({tone:'info', title:'Theme', desc:`Switched to ${document.documentElement.getAttribute('data-theme')}.`});
            }
        });
    }

    /* ============================================================
       自定义光标（可选功能）
       ============================================================ */
    function initCustomCursor(){
        const cursorBtn = $('#cursorBtn');
        const cursorLabel = $('#cursorLabel');
        const curEl = $('#cursor');

        // 如果页面没有光标元素，跳过
        if(!curEl) return;

        function getCursorMode(){
            const saved = localStorage.getItem('aurafx-cursor');
            return saved || 'system';
        }

        function setCursorMode(mode){
            document.documentElement.setAttribute('data-cursor', mode);
            localStorage.setItem('aurafx-cursor', mode);
            if(cursorLabel) cursorLabel.textContent = mode === 'custom' ? 'Cursor: FX' : 'Cursor: System';
        }

        setCursorMode(getCursorMode());

        if(cursorBtn){
            cursorBtn.addEventListener('click', ()=>{
                const cur = document.documentElement.getAttribute('data-cursor') || 'system';
                setCursorMode(cur === 'system' ? 'custom' : 'system');
                if(window.toast){
                    toast({tone:'info', title:'Cursor', desc:`Mode: ${document.documentElement.getAttribute('data-cursor')}.`});
                }
            });
        }

        // 光标跟踪动画
        let cx = innerWidth/2, cy = innerHeight/2, tx = cx, ty = cy;
        let rafId = null;

        document.addEventListener('mousemove', (e)=>{
            tx = e.clientX;
            ty = e.clientY;
        });

        function animCur(){
            cx += (tx - cx) * 0.18;
            cy += (ty - cy) * 0.18;
            curEl.style.left = cx + 'px';
            curEl.style.top  = cy + 'px';
            rafId = requestAnimationFrame(animCur);
        }

        // 只有在允许动画时才启动
        if(isAnimAllowed()){
            animCur();
        }

        // 页面不可见时暂停
        document.addEventListener('visibilitychange', ()=>{
            if(document.hidden && rafId){
                cancelAnimationFrame(rafId);
                rafId = null;
            } else if(!document.hidden && !rafId && isAnimAllowed()){
                animCur();
            }
        });

        // hover效果
        $$('.ix,button,a,input,textarea,select').forEach(el=>{
            el.addEventListener('mouseenter', ()=>document.body.classList.add('hov'));
            el.addEventListener('mouseleave', ()=>document.body.classList.remove('hov'));
        });
    }

    /* ============================================================
       滚动进度条 + 导航栏阴影（可选功能）
       ============================================================ */
    function initScrollProgress(){
        const prog = $('#prog') || $('#progressBar'); // 兼容两种ID
        const nav = $('#nav') || $('.top-nav'); // 兼容两种选择器

        if(!prog && !nav) return; // 都不存在就跳过

        let ticking = false;

        function onScroll(){
            if(ticking) return;
            ticking = true;

            requestAnimationFrame(()=>{
                const h = Math.max(1, document.documentElement.scrollHeight - innerHeight);
                if(prog) prog.style.width = (scrollY / h * 100) + '%';
                if(nav) nav.classList.toggle('scrolled', scrollY > 40);
                ticking = false;
            });
        }

        addEventListener('scroll', onScroll, {passive:true});
        onScroll();
    }

    /* ============================================================
       滚动显示动画（可选功能）
       ============================================================ */
    function initReveal(){
        const revealElements = $$('.rv,.rv-r,.rv-l,.rv-s,.stg');
        if(revealElements.length === 0) return; // 没有需要reveal的元素

        if(!isAnimAllowed()) {
            // 如果不允许动画，直接显示所有元素
            revealElements.forEach(el => el.classList.add('vis'));
            return;
        }

        const rObs = new IntersectionObserver(entries=>{
            entries.forEach(e=>{
                if(e.isIntersecting) e.target.classList.add('vis');
            });
        }, {threshold:0.12});

        revealElements.forEach(e => rObs.observe(e));
    }

    /* ============================================================
       计数器动画（可选功能）
       ============================================================ */
    function initCounters(){
        const counterContainers = $$('[data-af="counter"]');
        if(counterContainers.length === 0) return;

        if(!isAnimAllowed()) {
            // 不允许动画时直接显示最终值
            counterContainers.forEach(container=>{
                container.querySelectorAll('.counter').forEach(c=>{
                    c.textContent = c.dataset.v || '0';
                });
            });
            return;
        }

        const cObs = new IntersectionObserver(es=>{
            es.forEach(e=>{
                if(!e.isIntersecting) return;
                e.target.querySelectorAll('.counter').forEach(c=>{
                    const target = +c.dataset.v || 0;
                    let current = 0;
                    const duration = 1500;
                    const step = target / (duration / 16);

                    function count(){
                        current += step;
                        if(current >= target){
                            c.textContent = Math.round(target);
                        } else {
                            c.textContent = Math.round(current);
                            requestAnimationFrame(count);
                        }
                    }
                    count();
                });
                cObs.unobserve(e.target);
            });
        }, {threshold:0.5});

        counterContainers.forEach(c => cObs.observe(c));
    }

    /* ============================================================
       Toast通知系统
       ============================================================ */
    let toastRoot = null;

    window.toast = function({tone='info', title='', desc='', dur=3000}){
        if(!toastRoot){
            toastRoot = document.createElement('div');
            toastRoot.id = 'toastRoot';
            toastRoot.setAttribute('role', 'status');
            toastRoot.setAttribute('aria-live', 'polite');
            toastRoot.style.cssText = 'position:fixed;top:1rem;right:1rem;z-index:9999;display:flex;flex-direction:column;gap:.5rem;';
            document.body.appendChild(toastRoot);
        }

        const t = document.createElement('div');
        t.className = `toast toast-${tone}`;
        t.setAttribute('role', tone === 'error' ? 'alert' : 'status');
        t.innerHTML = `
            <div class="toast-title">${title}</div>
            <div class="toast-desc">${desc}</div>
        `;
        toastRoot.appendChild(t);

        setTimeout(()=>t.classList.add('show'), 10);
        setTimeout(()=>{
            t.classList.remove('show');
            setTimeout(()=>t.remove(), 300);
        }, dur);
    };

    /* ============================================================
       Modal对话框系统
       ============================================================ */
    window.modal = function(id){
        const m = $(`#${id}`);
        if(!m) {
            console.warn(`Modal #${id} not found`);
            return;
        }

        m.setAttribute('role', 'dialog');
        m.setAttribute('aria-modal', 'true');
        m.classList.add('show');
        document.body.style.overflow = 'hidden';

        // Focus trap
        const focusables = $$('button,a,input,textarea,select,[tabindex]:not([tabindex="-1"])', m);
        const first = focusables[0] || m;
        const last = focusables[focusables.length - 1] || m;

        first.focus();

        function trapFocus(e){
            if(e.key !== 'Tab') return;
            if(e.shiftKey && document.activeElement === first){
                e.preventDefault();
                last.focus();
            } else if(!e.shiftKey && document.activeElement === last){
                e.preventDefault();
                first.focus();
            }
        }

        function kill(){
            m.classList.remove('show');
            document.body.style.overflow = '';
            m.removeEventListener('keydown', trapFocus);
            document.removeEventListener('keydown', escHandler);
        }

        function escHandler(e){
            if(e.key === 'Escape') kill();
        }

        const closeBtn = m.querySelector('.close');
        if(closeBtn) closeBtn.addEventListener('click', kill, {once:true});

        m.addEventListener('keydown', trapFocus);
        document.addEventListener('keydown', escHandler);

        // 点击遮罩关闭
        m.addEventListener('click', (e)=>{
            if(e.target === m) kill();
        });
    };

    /* ============================================================
       Tabs标签页系统
       ============================================================ */
    function initTabs(){
        $$('[data-af="tabs"]').forEach(tabs=>{
            const btns = $$('[data-af="tab-btn"]', tabs);
            const panels = $$('[data-af="tab-panel"]', tabs);

            btns.forEach((btn, i)=>{
                btn.addEventListener('click', ()=>{
                    btns.forEach(b => b.classList.remove('active'));
                    panels.forEach(p => p.classList.remove('active'));
                    btn.classList.add('active');
                    if(panels[i]) panels[i].classList.add('active');
                });
            });
        });
    }

    /* ============================================================
       Accordion手风琴系统
       ============================================================ */
    function initAccordion(){
        $$('[data-af="accordion"]').forEach(acc=>{
            const items = $$('[data-af="acc-item"]', acc);

            items.forEach(item=>{
                const head = item.querySelector('.acc-h') || item.querySelector('[data-af="acc-head"]');
                const body = item.querySelector('.acc-body') || item.querySelector('[data-af="acc-body"]');

                if(!head || !body) return;

                head.addEventListener('click', ()=>{
                    const isOpen = item.classList.contains('open');

                    // 如果是单选模式，关闭其他项
                    if(acc.dataset.mode === 'single'){
                        items.forEach(i => i.classList.remove('open'));
                    }

                    item.classList.toggle('open', !isOpen);
                });
            });
        });
    }

    /* ============================================================
       初始化：按需启动各个模块
       ============================================================ */
    function init(){
        // 核心功能
        initTheme();
        initScrollProgress();

        // 视觉效果（尊重动画偏好）
        if(isAnimAllowed()){
            initCustomCursor();
            initReveal();
            initCounters();
        }

        // 交互组件
        initTabs();
        initAccordion();

        console.log('✓ AuraFX Core initialized');
    }

    /* ============================================================
       暴露API到全局
       ============================================================ */
    window.AuraFX = {
        version: '1.0.0',
        init,
        toast: window.toast,
        modal: window.modal,
        isAnimAllowed,
        // 模块初始化函数
        initTheme,
        initScrollProgress,
        initCustomCursor,
        initReveal,
        initCounters,
        initTabs,
        initAccordion
    };

    // DOM加载完成后初始化
    if(document.readyState === 'loading'){
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
