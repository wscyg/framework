    (function(){
        const $=(s,r=document)=>r.querySelector(s);
        const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));

        /* ============================================================
           State: prefers-reduced-motion + user animation toggle
           ============================================================ */
        const mqlReduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
        let userAnimEnabled = true;

        function isAnimAllowed(){
            const reduce = !!(mqlReduce && mqlReduce.matches);
            return userAnimEnabled && !reduce;
        }

        /* ============================================================
           Theme init: saved > prefers-color-scheme > default
           ============================================================ */
        const themeBtn = $('#themeBtn'), themeLabel = $('#themeLabel');
        function getPreferredTheme(){
            const saved = localStorage.getItem('aurafx-theme');
            if(saved) return saved;
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            return prefersDark ? 'dark' : 'light';
        }
        function setTheme(t){
            document.documentElement.setAttribute('data-theme', t);
            localStorage.setItem('aurafx-theme', t);
            if(themeLabel) themeLabel.textContent = t[0].toUpperCase()+t.slice(1);
        }
        setTheme(getPreferredTheme());
        themeBtn?.addEventListener('click', ()=>{
            const cur = document.documentElement.getAttribute('data-theme') || 'light';
            setTheme(cur === 'light' ? 'dark' : 'light');
            toast({tone:'info', title:'Theme', desc:`Switched to ${document.documentElement.getAttribute('data-theme')}.`});
        });

        /* ============================================================
           Cursor mode: system/custom (saved)
           ============================================================ */
        const cursorBtn = $('#cursorBtn'), cursorLabel = $('#cursorLabel');
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
        cursorBtn?.addEventListener('click', ()=>{
            const cur = document.documentElement.getAttribute('data-cursor') || 'system';
            setCursorMode(cur === 'system' ? 'custom' : 'system');
            toast({tone:'info', title:'Cursor', desc:`Mode: ${document.documentElement.getAttribute('data-cursor')}.`});
        });

        /* ============================================================
           Custom cursor tracking (only visible when mode=custom)
           ============================================================ */
        const curEl = $('#cursor');
        let cx=innerWidth/2, cy=innerHeight/2, tx=cx, ty=cy;
        document.addEventListener('mousemove', (e)=>{ tx=e.clientX; ty=e.clientY; });
        function animCur(){
            cx += (tx - cx) * .18;
            cy += (ty - cy) * .18;
            if(curEl){
                curEl.style.left = cx+'px';
                curEl.style.top  = cy+'px';
            }
            requestAnimationFrame(animCur);
        }
        animCur();
        $$('.ix,button,a,input,textarea,select').forEach(el=>{
            el.addEventListener('mouseenter',()=>document.body.classList.add('hov'));
            el.addEventListener('mouseleave',()=>document.body.classList.remove('hov'));
        });

        /* ============================================================
           Scroll progress + nav shadow
           ============================================================ */
        const prog = $('#prog'), nav = $('#nav');
        function onScroll(){
            const h = Math.max(1, document.documentElement.scrollHeight - innerHeight); // guard
            if(prog) prog.style.width = (scrollY / h * 100) + '%';
            if(nav) nav.classList.toggle('scrolled', scrollY > 40);
        }
        addEventListener('scroll', onScroll, {passive:true});
        onScroll();

        /* ============================================================
           Reveal
           ============================================================ */
        const rObs = new IntersectionObserver(entries=>{
            entries.forEach(e=>{
                if(e.isIntersecting) e.target.classList.add('vis');
            });
        }, {threshold:.12});
        $$('.rv,.rv-r,.rv-l,.rv-s,.stg').forEach(e=>rObs.observe(e));

        /* ============================================================
           Counters (once)
           ============================================================ */
        const cObs = new IntersectionObserver(es=>{
            es.forEach(e=>{
                if(!e.isIntersecting) return;
                e.target.querySelectorAll('.counter').forEach(c=>{
                    const t = +c.dataset.v;
                    let n = 0;
                    const step = Math.max(1, Math.floor(t/30));
                    const iv = setInterval(()=>{
                        n += step;
                        if(n >= t){ n = t; clearInterval(iv); }
                        c.textContent = n;
                    }, 40);
                });
                cObs.unobserve(e.target);
            });
        }, {threshold:.5});
        const stats = $('#stats'); if(stats) cObs.observe(stats);

        /* ============================================================
           Spotlight cards
           ============================================================ */
        $$('.card-spot').forEach(c=>{
            c.addEventListener('mousemove', e=>{
                const r = c.getBoundingClientRect();
                c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
                c.style.setProperty('--my', (e.clientY - r.top) + 'px');
            });
        });

        /* ============================================================
           Canvas particles (perf-aware)
           - throttled frame: render every 2 frames
           - pauses on tab hidden
           - respects reduced motion + user toggle
           ============================================================ */
        const cv = $('#flow-canvas');
        const c2 = cv?.getContext('2d');
        let W=0,H=0,ps=[], rafId=null, frame=0, running=false;

        function initParticles(){
            if(!cv || !c2) return;
            W = innerWidth; H = innerHeight;
            cv.width = W; cv.height = H;
            ps = [];
            const count = 58;
            for(let i=0;i<count;i++){
                ps.push({
                    x: Math.random()*W,
                    y: Math.random()*H,
                    r: Math.random()*1.8 + .5,
                    vx:(Math.random()-.5)*.32,
                    vy:(Math.random()-.5)*.32,
                    a: Math.random()*.35 + .08
                });
            }
        }

        function drawParticles(){
            if(!cv || !c2) return;
            if(!running){ rafId = null; return; }
            rafId = requestAnimationFrame(drawParticles);

            // throttle: draw only every 2 frames
            frame = (frame + 1) % 2;
            if(frame !== 0) return;

            c2.clearRect(0,0,W,H);
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            const rgb = isDark ? '139,92,246' : '37,99,235';

            // move + draw points
            for(const p of ps){
                p.x += p.vx; p.y += p.vy;
                if(p.x<0||p.x>W) p.vx *= -1;
                if(p.y<0||p.y>H) p.vy *= -1;
                c2.beginPath();
                c2.arc(p.x,p.y,p.r,0,Math.PI*2);
                c2.fillStyle = `rgba(${rgb},${p.a})`;
                c2.fill();
            }

            // light linking (O(n^2) but small n)
            for(let i=0;i<ps.length;i++){
                for(let j=i+1;j<ps.length;j++){
                    const dx=ps[i].x-ps[j].x, dy=ps[i].y-ps[j].y;
                    const d = Math.sqrt(dx*dx+dy*dy);
                    if(d < 110){
                        c2.beginPath();
                        c2.moveTo(ps[i].x, ps[i].y);
                        c2.lineTo(ps[j].x, ps[j].y);
                        c2.strokeStyle = `rgba(${rgb},${.06*(1-d/110)})`;
                        c2.stroke();
                    }
                }
            }
        }

        function startCanvas(){
            if(!cv || !c2) return;
            if(!isAnimAllowed()){ running = false; return; }
            if(running) return;
            running = true;
            if(!rafId) drawParticles();
        }

        function stopCanvas(){
            running = false;
            if(rafId){ cancelAnimationFrame(rafId); rafId=null; }
        }

        addEventListener('resize', ()=>{
            initParticles();
        }, {passive:true});

        document.addEventListener('visibilitychange', ()=>{
            if(document.hidden) stopCanvas();
            else startCanvas();
        });

        initParticles();
        startCanvas();

        /* ============================================================
           Toast
           ============================================================ */
        const toastRoot = $('#toastRoot');
        function esc(s){
            return String(s??'').replace(/[&<>"']/g, c=>({
                '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
            }[c]));
        }
        function toast({tone='info', title='Notice', desc='', timeout=2600}){
            if(!toastRoot) return;
            const el = document.createElement('div');
            el.className = 'toast';
            el.setAttribute('data-tone', tone);
            el.innerHTML = `
      <div class="ic">${tone==='ok'?'✓':tone==='warn'?'!':tone==='bad'?'×':'i'}</div>
      <div>
        <div class="t">${esc(title)}</div>
        <div class="d">${esc(desc)}</div>
      </div>
      <button class="close" type="button" aria-label="Close toast">✕</button>
    `;
            toastRoot.appendChild(el);
            const kill = ()=>el.remove();
            el.querySelector('.close').addEventListener('click', kill);
            if(timeout>0) setTimeout(kill, timeout);
        }

        /* ============================================================
           Modal: focus trap + restore focus + scroll lock
           ============================================================ */
        let lastFocus = null;

        function getFocusable(root){
            if(!root) return [];
            const sel = [
                'a[href]',
                'button:not([disabled])',
                'input:not([disabled])',
                'select:not([disabled])',
                'textarea:not([disabled])',
                '[tabindex]:not([tabindex="-1"])'
            ].join(',');
            return $$(sel, root).filter(el=>{
                const style = getComputedStyle(el);
                return style.visibility !== 'hidden' && style.display !== 'none';
            });
        }

        function openModal(target){
            const m = typeof target === 'string' ? $(target) : target;
            if(!m) return;
            lastFocus = document.activeElement;
            m.setAttribute('data-state','open');
            document.body.style.overflow = 'hidden';

            const focusables = getFocusable(m);
            const first = focusables[0] || m.querySelector('.panel');
            setTimeout(()=> first?.focus?.(), 0);

            m._trapHandler = (e)=>{
                if(e.key !== 'Tab') return;
                const items = getFocusable(m);
                if(items.length === 0) return;
                const firstEl = items[0];
                const lastEl  = items[items.length-1];

                if(e.shiftKey && document.activeElement === firstEl){
                    e.preventDefault();
                    lastEl.focus();
                }else if(!e.shiftKey && document.activeElement === lastEl){
                    e.preventDefault();
                    firstEl.focus();
                }
            };
            document.addEventListener('keydown', m._trapHandler, true);
        }

        function closeModal(m){
            if(!m) return;
            m.setAttribute('data-state','closed');
            document.body.style.overflow = '';
            if(m._trapHandler){
                document.removeEventListener('keydown', m._trapHandler, true);
                m._trapHandler = null;
            }
            setTimeout(()=> lastFocus?.focus?.(), 0);
        }

        /* ============================================================
           Menu: open/close + keyboard nav
           - ArrowDown/ArrowUp moves active option
           - Enter selects
           - Esc closes
           ============================================================ */
        function setMenuState(menu, open){
            const panel = menu?.querySelector('[data-af="menu-panel"]');
            const btn = menu?.querySelector('[data-af="menu-toggle"]');
            if(!panel || !btn) return;

            panel.setAttribute('data-state', open ? 'open' : 'closed');
            btn.setAttribute('aria-expanded', open ? 'true' : 'false');

            // reset active
            const items = $$('.menu-item', panel);
            items.forEach(i=>i.removeAttribute('data-active'));

            if(open){
                // focus first option
                const first = items[0];
                if(first){
                    first.setAttribute('data-active','true');
                    first.tabIndex = 0;
                    items.slice(1).forEach(x=>x.tabIndex = -1);
                    first.focus();
                }
            }
        }

        function moveMenuActive(panel, dir){
            const items = $$('.menu-item', panel);
            if(items.length === 0) return;
            let idx = items.findIndex(i=>i.getAttribute('data-active') === 'true');
            if(idx < 0) idx = 0;
            items[idx].removeAttribute('data-active');

            idx = (idx + dir + items.length) % items.length;
            items.forEach(i=>i.tabIndex = -1);
            items[idx].setAttribute('data-active','true');
            items[idx].tabIndex = 0;
            items[idx].focus();
        }

        /* ============================================================
           Tabs: set + keyboard nav
           ============================================================ */
        function setTab(key){
            $$('#ctabs [role="tab"]').forEach(t=>{
                const sel = t.dataset.tab === key;
                t.setAttribute('aria-selected', sel ? 'true' : 'false');
                t.tabIndex = sel ? 0 : -1;
            });
            ['pt','np','fm'].forEach(k=>{
                const p = $('#tab-'+k);
                if(p) p.setAttribute('data-state', k===key ? 'open' : 'closed');
            });
        }

        function tabsKeyNav(e){
            const tabs = $$('#ctabs [role="tab"]');
            if(tabs.length === 0) return;
            const cur = document.activeElement;
            const idx = tabs.indexOf(cur);
            if(idx < 0) return;

            let next = idx;
            if(e.key === 'ArrowRight') next = (idx+1)%tabs.length;
            if(e.key === 'ArrowLeft')  next = (idx-1+tabs.length)%tabs.length;
            if(e.key === 'Home') next = 0;
            if(e.key === 'End') next = tabs.length-1;

            if(next !== idx){
                e.preventDefault();
                tabs[next].focus();
                setTab(tabs[next].dataset.tab);
            }
        }
        $('#ctabs')?.addEventListener('keydown', (e)=>{
            if(['ArrowRight','ArrowLeft','Home','End'].includes(e.key)) tabsKeyNav(e);
        });

        /* ============================================================
           Accordion: dynamic height transitions
           ============================================================ */
        function openAcc(acc){
            const body = acc.querySelector('.acc-body');
            if(!body) return;
            body.style.height = body.scrollHeight + 'px';
            acc.setAttribute('data-state','open');
            const head = acc.querySelector('.acc-h');
            head?.setAttribute('aria-expanded','true');
        }

        function closeAcc(acc){
            const body = acc.querySelector('.acc-body');
            if(!body) return;
            body.style.height = body.scrollHeight + 'px';
            requestAnimationFrame(()=>{ body.style.height = '0px'; });
            acc.setAttribute('data-state','closed');
            const head = acc.querySelector('.acc-h');
            head?.setAttribute('aria-expanded','false');
        }

        // Initialize open accordions to correct height after layout
        function syncAccHeights(){
            $$('[data-af="acc"]').forEach(acc=>{
                const body = acc.querySelector('.acc-body');
                if(!body) return;
                if(acc.getAttribute('data-state') === 'open'){
                    body.style.height = body.scrollHeight + 'px';
                }else{
                    body.style.height = '0px';
                }
            });
        }
        addEventListener('resize', syncAccHeights, {passive:true});
        setTimeout(syncAccHeights, 0);

        /* ============================================================
           Action registry (core upgrade)
           ============================================================ */
        const actions = {
            'toast': (el)=>{
                toast({
                    tone: el.getAttribute('data-tone') || 'info',
                    title: el.getAttribute('data-title') || 'Notice',
                    desc: el.getAttribute('data-desc') || ''
                });
            },

            'modal-open': (el)=>{
                openModal(el.getAttribute('data-target'));
            },

            'modal-close': (el)=>{
                closeModal(el.closest('[data-af="modal"]'));
            },

            'menu-toggle': (el)=>{
                const menu = el.closest('.menu');
                const panel = menu?.querySelector('[data-af="menu-panel"]');
                const open = panel?.getAttribute('data-state') === 'open';
                setMenuState(menu, !open);
            },

            'tab': (el)=>{
                const key = el.getAttribute('data-tab');
                if(key) setTab(key);
            },

            'acc': (el)=>{
                const acc = el.closest('[data-af="acc"]');
                if(!acc) return;
                const open = acc.getAttribute('data-state') === 'open';
                if(open) closeAcc(acc);
                else openAcc(acc);
            },

            'pulse': ()=>{
                const d = $('#sig-dot');
                if(!d) return;
                d.style.opacity = 1;

                const path = [
                    {x:60,y:280},{x:120,y:225},{x:148,y:210},{x:148,y:158},{x:148,y:128},
                    {x:148,y:98},{x:148,y:83},{x:250,y:60},{x:318,y:42},{x:318,y:8}
                ];
                let s=0;
                const iv = setInterval(()=>{
                    if(s >= path.length){ clearInterval(iv); d.style.opacity = 0; return; }
                    d.setAttribute('cx', path[s].x);
                    d.setAttribute('cy', path[s].y);
                    s++;
                }, 110);
            },

            'demo-loading': ()=>{
                $('#skeletonZone').style.display = '';
                $('#tableZone').style.display = 'none';
                $('#emptyZone').style.display = 'none';
                toast({tone:'info', title:'Loading', desc:'Skeleton shown.'});
            },

            'demo-empty': ()=>{
                $('#emptyZone').style.display = '';
                $('#tableZone').style.display = 'none';
                $('#skeletonZone').style.display = 'none';
                toast({tone:'warn', title:'Empty', desc:'Empty state shown.'});
            },

            'demo-table': ()=>{
                $('#tableZone').style.display = '';
                $('#skeletonZone').style.display = 'none';
                $('#emptyZone').style.display = 'none';
                toast({tone:'ok', title:'Ready', desc:'Table shown.'});
            },

            'chip-close': (el)=>{
                el.closest('[data-af-chip]')?.remove?.();
                // fallback for v6 chip markup
                el.closest('.flex')?.remove?.();
                toast({tone:'info', title:'Chip removed', desc:'(demo)'});
            },

            'anim-toggle': (el)=>{
                userAnimEnabled = !!el.checked;
                if(userAnimEnabled) startCanvas(); else stopCanvas();
                toast({tone:'info', title:'Animations', desc: userAnimEnabled ? 'Enabled' : 'Disabled'});
            },

            'theme-toggle': ()=>{
                // handled via direct button listener above (kept for protocol completeness)
            },

            'cursor-toggle': ()=>{
                // handled via direct button listener above (kept for protocol completeness)
            }
        };

        function dispatchAction(target){
            const el = target.closest?.('[data-af]');
            if(!el) return false;
            const type = el.getAttribute('data-af');
            const fn = actions[type];
            if(typeof fn === 'function'){ fn(el); return true; }
            return false;
        }

        /* ============================================================
           Click delegation
           ============================================================ */
        document.addEventListener('click', (e)=>{
            const acted = dispatchAction(e.target);
            if(acted) return;

            // menu item click also closes its menu (but keeps action effect)
            const mi = e.target.closest('.menu-item');
            if(mi){
                const menu = mi.closest('.menu');
                if(menu) setMenuState(menu, false);
            }
        });

        /* ============================================================
           Menu keyboard delegation
           ============================================================ */
        document.addEventListener('keydown', (e)=>{
            // ESC: close modal first, then menus
            if(e.key === 'Escape'){
                const openM = $$('[data-af="modal"][data-state="open"]').pop();
                if(openM){ closeModal(openM); return; }
                $$('.menu-panel[data-state="open"]').forEach(p=>{
                    const menu = p.closest('.menu');
                    if(menu) setMenuState(menu, false);
                });
                return;
            }

            // Menu nav when focus is within a menu panel
            const panel = e.target.closest?.('.menu-panel[data-state="open"]');
            if(panel){
                if(e.key === 'ArrowDown'){ e.preventDefault(); moveMenuActive(panel, +1); }
                if(e.key === 'ArrowUp'){   e.preventDefault(); moveMenuActive(panel, -1); }
                if(e.key === 'Enter' || e.key === ' '){
                    e.preventDefault();
                    const active = panel.querySelector('.menu-item[data-active="true"]') || panel.querySelector('.menu-item');
                    if(active){
                        // perform action
                        dispatchAction(active);
                        // close menu
                        const menu = panel.closest('.menu');
                        if(menu) setMenuState(menu, false);
                    }
                }
            }

            // Accordion keyboard: Enter/Space on header
            const accHead = e.target.closest?.('.acc-h');
            if(accHead && (e.key === 'Enter' || e.key === ' ')){
                e.preventDefault();
                actions['acc'](accHead);
            }
        });

        /* ============================================================
           Click outside closes menus
           ============================================================ */
        document.addEventListener('pointerdown', (e)=>{
            $$('.menu-panel[data-state="open"]').forEach(p=>{
                const menu = p.closest('.menu');
                if(menu && !menu.contains(e.target)){
                    setMenuState(menu, false);
                }
            });
        });

        /* ============================================================
           Code line info
           ============================================================ */
        const cInfo = [
            {t:'Function Signature',d:'Defines attention(q,k,v) with Q/K/V matrices.'},
            {t:'Dimension',d:'Extract d_k — key dimension used for scaling.'},
            {t:'Raw Scores',d:'Dot product Q×Kᵀ gives similarity logits.'},
            {t:'Scaling',d:'Divide by √d_k to prevent softmax saturation.'},
            {t:'Softmax',d:'Convert logits to probability distribution over keys.'},
            {t:'Output',d:'Weighted sum of V gives context-enriched vectors.'}
        ];
        $$('#codeblock .cline').forEach(l=>{
            l.addEventListener('mouseenter', ()=>{
                $$('#codeblock .cline').forEach(x=>x.removeAttribute('data-state'));
                l.setAttribute('data-state','active');
                const i = +l.dataset.i;
                $('#lp-t').textContent = cInfo[i]?.t || 'Line';
                $('#lp-d').textContent = cInfo[i]?.d || '';
            });
        });

        /* ============================================================
           Lab
           ============================================================ */
        const sent = "The animal didn't cross the street because it was too tired".split(' ');
        const ta = $('#tok-area'), sw = $('#sel-w'), hg = $('#hgrid'), ab = $('#attn-bars');
        const n = sent.length;

        hg.style.gridTemplateColumns = `repeat(${n},1fr)`;
        for(let i=0;i<n*n;i++){
            const c=document.createElement('div');
            c.className='hcell';
            c.style.cssText='width:22px;height:22px;background:rgba(148,163,184,.14)';
            hg.appendChild(c);
        }

        function fakeA(qi){
            const w=[];
            for(let j=0;j<n;j++){
                if(sent[qi]==='it' && sent[j]==='animal') w.push(.60);
                else if(sent[qi]==='tired' && sent[j]==='animal') w.push(.35);
                else if(j===qi) w.push(.25+Math.random()*.15);
                else w.push(Math.random()*.12);
            }
            const s=w.reduce((a,b)=>a+b,0);
            return w.map(v=>v/s);
        }

        sent.forEach((w,i)=>{
            const s=document.createElement('span');
            s.className='token ix';
            s.textContent=w;
            s.addEventListener('click', ()=>selTok(i));
            ta.appendChild(s);
        });

        function selTok(i){
            sw.textContent = sent[i];
            $$('.token').forEach((t,j)=>t.setAttribute('data-state', j===i ? 'active' : ''));
            const cells = $$('.hcell', hg);
            const attn = fakeA(i);

            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            const tone = isDark ? '139,92,246' : '37,99,235';

            for(let r=0;r<n;r++){
                const ra = r===i ? attn : Array.from({length:n}, ()=>Math.random()*.08);
                for(let c=0;c<n;c++){
                    const v = ra[c];
                    cells[r*n+c].style.background = `rgba(${tone},${Math.min(v*2.6,.92)})`;
                }
            }

            ab.innerHTML='';
            attn.forEach((v,j)=>{
                const row=document.createElement('div');
                row.style.cssText='display:flex;align-items:center;gap:8px;margin-bottom:6px';

                const lbl=document.createElement('span');
                lbl.style.cssText='font-family:var(--font-mono);font-size:10px;width:60px;text-align:right;color:var(--muted)';
                lbl.textContent=sent[j];

                const bar=document.createElement('div');
                bar.className='pbar';
                bar.style.cssText='flex:1;height:8px';

                const fill=document.createElement('div');
                fill.className='fill';
                fill.style.width=(v*100)+'%';
                fill.style.background = (j===i)
                    ? 'linear-gradient(90deg,var(--bad),var(--brand2))'
                    : 'linear-gradient(90deg,var(--brand),var(--brand2))';

                bar.appendChild(fill);

                const val=document.createElement('span');
                val.style.cssText='font-family:var(--font-mono);font-size:10px;width:40px;color:var(--ink)';
                val.textContent=(v*100).toFixed(1)+'%';

                row.appendChild(lbl); row.appendChild(bar); row.appendChild(val);
                ab.appendChild(row);
            });
        }

        /* ============================================================
           KaTeX init (simple + safe)
           ============================================================ */
        function tryRenderMath(){
            if(typeof renderMathInElement !== 'function') return;
            try{
                renderMathInElement(document.body, {
                    delimiters: [
                        {left:'$$', right:'$$', display:true},
                        {left:'$', right:'$', display:false}
                    ]
                });
            }catch(_){}
        }
        // If KaTeX scripts are deferred, run when ready
        window.addEventListener('load', tryRenderMath, {once:true});

        /* ============================================================
           Global shortcuts (optional)
           ============================================================ */
        document.addEventListener('keydown', (e)=>{
            const meta = e.metaKey || e.ctrlKey;
            if(!meta) return;
            if(e.key.toLowerCase() === 'm'){ e.preventDefault(); openModal('#modal-doc'); }
            if(e.key.toLowerCase() === 'i'){ e.preventDefault(); toast({tone:'info', title:'AuraFX', desc:'v6 registry + a11y + keyboard UX.'}); }
            if(e.key.toLowerCase() === 'e'){ e.preventDefault(); toast({tone:'ok', title:'Export', desc:'Tokens exported (demo).'}); }
        });
    })();
