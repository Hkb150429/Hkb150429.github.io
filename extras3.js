// ===================================================
// 1. 博客运行时长
// ===================================================
const BLOG_START_DATE = new Date('2025-06-01');

function initBlogRuntime() {
    const container = document.getElementById('blogRuntime');
    if (!container) return;

    function update() {
        const now = new Date();
        const diff = now - BLOG_START_DATE;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        const lang = localStorage.getItem('lang') || 'zh';
        const isEn = lang === 'en';
        const labels = isEn
            ? { label: '⏳ Running', d: 'd', h: 'h', m: 'm', s: 's' }
            : { label: '⏳ 本站已运行', d: '天', h: '时', m: '分', s: '秒' };

        container.innerHTML = `
            <div class="runtime-box">
                <span class="runtime-label">${labels.label}</span>
                <span class="runtime-num">${days}</span>
                <span class="runtime-unit">${labels.d}</span>
                <span class="runtime-num">${hours}</span>
                <span class="runtime-unit">${labels.h}</span>
                <span class="runtime-num">${minutes}</span>
                <span class="runtime-unit">${labels.m}</span>
                <span class="runtime-num">${seconds}</span>
                <span class="runtime-unit">${labels.s}</span>
            </div>
        `;
    }

    update();
    setInterval(update, 1000);
}

// ===================================================
// 2. 打字机效果
// ===================================================
function initTypewriter(selector, texts, speed = 120) {
    const el = document.querySelector(selector);
    if (!el) return;

    const list = Array.isArray(texts) ? texts : [texts];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function tick() {
        const current = list[textIndex];

        if (isDeleting) {
            el.textContent = current.substring(0, charIndex - 1);
            charIndex--;
        } else {
            el.textContent = current.substring(0, charIndex + 1);
            charIndex++;
        }

        let delay = speed;

        if (!isDeleting && charIndex === current.length) {
            delay = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % list.length;
            delay = 500;
        } else if (isDeleting) {
            delay = speed / 2;
        }

        setTimeout(tick, delay);
    }

    tick();
}

// ===================================================
// 3. 图片画廊
// ===================================================
async function renderGallery(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
        const articles = await loadArticlesMeta();
        const images = [];

        for (const a of articles) {
            try {
                const res = await fetch(`posts/${a.id}.md`);
                if (res.ok) {
                    const text = await res.text();
                    const matches = text.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g);
                    for (const m of matches) {
                        images.push({
                            alt: m[1] || '图片',
                            src: m[2],
                            articleId: a.id,
                            articleTitle: a.title
                        });
                    }
                }
            } catch (e) {}
        }

        if (images.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="icon">🖼️</div>
                    <h3>还没有图片</h3>
                    <p>在文章里插入图片（Markdown 语法）后这里会自动显示。</p>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="gallery-grid">
                ${images.map(img => `
                    <div class="gallery-item" data-src="${img.src}">
                        <img src="${img.src}" alt="${img.alt}" loading="lazy">
                        <div class="gallery-caption">
                            <a href="article.html?id=${img.articleId}">${img.articleTitle}</a>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        container.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', () => {
                const lb = document.getElementById('lightbox');
                const lbImg = document.getElementById('lightboxImg');
                if (lb && lbImg) {
                    lbImg.src = item.dataset.src;
                    lb.classList.add('active');
                }
            });
        });
    } catch (e) {
        container.innerHTML = `<div class="empty-state"><div class="icon">⚠️</div><h3>加载失败</h3></div>`;
    }
}

// ===================================================
// 4. 多语言
// ===================================================
const I18N = {
    zh: {
        home: '首页', projects: '项目', articles: '文章', archive: '归档',
        timeline: '时间线', tags: '标签', categories: '分类', gallery: '画廊',
        stats: '统计', sponsor: '赞赏', changelog: '日志', links: '友链',
        sitemap: '地图', notFound: '404',
        welcome: '欢迎光临', blog: '的博客', backHome: '← 回首页',
        hello: '你好，我是', homeDesc: '欢迎来到我的博客，这里记录我的项目、文章、标签与分类。',
        hotArticles: '🔥 热门文章', pinnedArticles: '📌 置顶文章',
        randomBtn: '🎲 随机看一篇', tagHeatmap: '🔥 标签热力图',
        wordcloud: '☁️ 文章词云', shortlink: '🔗 短链生成',
        projectsTitle: '📦 项目', articlesTitle: '📝 文章', archiveTitle: '📅 归档',
        timelineTitle: '📆 时间线', tagsTitle: '🏷️ 标签', categoriesTitle: '📁 分类',
        galleryTitle: '🖼️ 图片画廊', statsTitle: '📈 博客统计', sponsorTitle: '☕ 赞赏',
        changelogTitle: '📋 更新日志', linksTitle: '🔗 友情链接', sitemapTitle: '🗺️ 网站地图',
        notFoundTitle: '404', notFoundDesc: '页面走丢了，来玩个小游戏吧',
        gameHint: '鼠标/手指控制挡板，接住小球', backHomeBtn: '🏠 返回首页',
        searchPlaceholder: '🔍 搜索标题、摘要、标签、正文…',
        sortNewest: '最新发布', sortOldest: '最早发布',
        sortTitleAsc: '标题 A→Z', sortTitleDesc: '标题 Z→A',
        randomShort: '🎲 随机',
        back: '← 返回', backToArticles: '← 返回文章列表',
        readMin: '分钟', words: '字', prevPost: '← 上一篇', nextPost: '下一篇 →',
        share: '分享', copyLink: '🔗 复制链接', shareWeibo: '📤 分享到微博',
        shareTwitter: '🐦 分享到 Twitter', shareEmail: '✉️ 邮件分享',
        tagCloudTitle: '标签云',
        gameStart: '点击重新开始',
        friends: '朋友们',
        applyLink: '申请友链',
        applyLinkDesc: '想要交换友链？发邮件到 you@example.com，附上您的网站名、网址、简介和头像。',
        mainPages: '主要页面',
        allPosts: '所有文章',
    },
    en: {
        home: 'Home', projects: 'Proj', articles: 'Posts', archive: 'Arch',
        timeline: 'Time', tags: 'Tags', categories: 'Cats', gallery: 'Pics',
        stats: 'Stats', sponsor: 'Tip', changelog: 'Log', links: 'Links',
        sitemap: 'Map', notFound: '404',
        welcome: 'Welcome to', blog: "'s Blog", backHome: '← Home',
        hello: "Hi, I'm", homeDesc: 'Welcome to my blog where I record my projects, articles, tags and categories.',
        hotArticles: '🔥 Hot Posts', pinnedArticles: '📌 Pinned',
        randomBtn: '🎲 Random Post', tagHeatmap: '🔥 Tag Heatmap',
        wordcloud: '☁️ Word Cloud', shortlink: '🔗 Short URL',
        projectsTitle: '📦 Projects', articlesTitle: '📝 Articles', archiveTitle: '📅 Archive',
        timelineTitle: '📆 Timeline', tagsTitle: '🏷️ Tags', categoriesTitle: '📁 Categories',
        galleryTitle: '🖼️ Gallery', statsTitle: '📈 Blog Stats', sponsorTitle: '☕ Sponsor',
        changelogTitle: '📋 Changelog', linksTitle: '🔗 Links', sitemapTitle: '🗺️ Sitemap',
        notFoundTitle: '404', notFoundDesc: 'Page lost, play a game!',
        gameHint: 'Move mouse/touch to control paddle', backHomeBtn: '🏠 Back Home',
        searchPlaceholder: '🔍 Search title, summary, tags, content…',
        sortNewest: 'Newest', sortOldest: 'Oldest',
        sortTitleAsc: 'Title A→Z', sortTitleDesc: 'Title Z→A',
        randomShort: '🎲 Random',
        back: '← Back', backToArticles: '← Back to Articles',
        readMin: 'min', words: 'words', prevPost: '← Prev', nextPost: 'Next →',
        share: 'Share', copyLink: '🔗 Copy Link', shareWeibo: '📤 Weibo',
        shareTwitter: '🐦 Twitter', shareEmail: '✉️ Email',
        tagCloudTitle: 'Tag Cloud',
        gameStart: 'Click to Restart',
        friends: 'Friends',
        applyLink: 'Apply for Link',
        applyLinkDesc: 'Want to exchange links? Email you@example.com with your site name, URL, intro and avatar.',
        mainPages: 'Main Pages',
        allPosts: 'All Posts',
    }
};

function initI18n() {
    const saved = localStorage.getItem('lang') || 'zh';
    applyLang(saved);
}

function toggleLang() {
    const current = localStorage.getItem('lang') || 'zh';
    const next = current === 'zh' ? 'en' : 'zh';
    localStorage.setItem('lang', next);
    applyLang(next);
}

function applyLang(lang) {
    const dict = I18N[lang] || I18N.zh;

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (dict[key]) el.textContent = dict[key];
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.dataset.i18nPlaceholder;
        if (dict[key]) el.placeholder = dict[key];
    });

    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
}

window.toggleLang = toggleLang;

// ===================================================
// 5. 3D 标签云
// ===================================================
async function render3DTagCloud(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
        const articles = await loadArticlesMeta();
        const tagCount = {};
        articles.forEach(a => (a.tags || []).forEach(t => { tagCount[t] = (tagCount[t] || 0) + 1; }));

        const tags = Object.entries(tagCount).map(([name, count]) => ({ name, count }));
        if (tags.length === 0) return;

        const maxCount = Math.max(...tags.map(t => t.count));
        const minCount = Math.min(...tags.map(t => t.count));

        const radius = 180;
        const cx = radius, cy = radius;
        const total = tags.length;

        const spans = tags.map((tag, i) => {
            const phi = Math.acos(-1 + (2 * i + 1) / total);
            const theta = Math.sqrt(total * Math.PI) * phi;

            const x = cx + radius * Math.cos(theta) * Math.sin(phi);
            const y = cy + radius * Math.sin(theta) * Math.sin(phi);
            const z = radius * Math.cos(phi);

            const ratio = maxCount === minCount ? 0.5 : (tag.count - minCount) / (maxCount - minCount);
            const size = 0.8 + ratio * 0.8;

            return `<a href="list.html?tag=${encodeURIComponent(tag.name)}" class="tag3d-item" style="font-size:${size}rem;" data-x="${x}" data-y="${y}" data-z="${z}">${tag.name}</a>`;
        }).join('');

        container.innerHTML = `<div class="tag3d-wrap"><div class="tag3d-sphere">${spans}</div></div>`;

        const sphere = container.querySelector('.tag3d-sphere');
        const items = container.querySelectorAll('.tag3d-item');
        let angleX = 0, angleY = 0;

        function rotate() {
            angleX += 0.003;
            angleY += 0.004;

            items.forEach(item => {
                const x = parseFloat(item.dataset.x) - cx;
                const y = parseFloat(item.dataset.y) - cy;
                const z = parseFloat(item.dataset.z);

                const x1 = x * Math.cos(angleY) - z * Math.sin(angleY);
                const z1 = x * Math.sin(angleY) + z * Math.cos(angleY);

                const y1 = y * Math.cos(angleX) - z1 * Math.sin(angleX);
                const z2 = y * Math.sin(angleX) + z1 * Math.cos(angleX);

                const scale = (z2 + radius) / (2 * radius) + 0.5;
                const opacity = (z2 + radius) / (2 * radius) * 0.7 + 0.3;

                item.style.transform = `translate(${x1}px, ${y1}px) scale(${scale})`;
                item.style.opacity = opacity;
                item.style.zIndex = Math.floor(z2 + radius);
            });

            requestAnimationFrame(rotate);
        }

        rotate();

    } catch (e) {
        container.innerHTML = `<div class="empty-state"><div class="icon">⚠️</div><h3>加载失败</h3></div>`;
    }
}

// ===================================================
// 6. 短链生成
// ===================================================
function initShortLink() {
    const container = document.getElementById('shortLinkBox');
    if (!container) return;

    container.innerHTML = `
        <div class="shortlink-box">
            <input type="text" id="shortlinkInput" placeholder="粘贴长链接…">
            <button id="shortlinkBtn" class="random-btn">生成短链</button>
        </div>
        <div id="shortlinkResult"></div>
    `;

    const input = container.querySelector('#shortlinkInput');
    const btn = container.querySelector('#shortlinkBtn');
    const result = container.querySelector('#shortlinkResult');

    btn.addEventListener('click', () => {
        const url = input.value.trim();
        if (!url) return;

        fetch(`https://is.gd/create.php?format=json&url=${encodeURIComponent(url)}`)
            .then(res => res.json())
            .then(data => {
                if (data.shorturl) {
                    result.innerHTML = `
                        <div class="shortlink-result">
                            <a href="${data.shorturl}" target="_blank" rel="noopener">${data.shorturl}</a>
                            <button class="copy-btn" onclick="copyText('${data.shorturl}')">复制</button>
                        </div>
                    `;
                } else {
                    result.innerHTML = `<p style="color:var(--text-mute);">生成失败：${data.errormessage || '未知错误'}</p>`;
                }
            })
            .catch(() => {
                result.innerHTML = `<p style="color:var(--text-mute);">网络错误，生成失败</p>`;
            });
    });
}

// ===================================================
// 7. 更多彩蛋
// ===================================================
function initMoreEggs() {
    const eggs = {
        'ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightba': '🎮 科乐美秘技！',
        'hkb': '👋 你好呀！',
        'love': '❤️ 谢谢喜欢',
        'blog': '📝 欢迎来我的博客',
    };

    let buffer = '';
    document.addEventListener('keydown', (e) => {
        buffer += e.key;
        if (buffer.length > 30) buffer = buffer.slice(-30);

        for (const [key, msg] of Object.entries(eggs)) {
            if (buffer.includes(key)) {
                showEggMsg(msg);
                buffer = '';
                break;
            }
        }
    });

    let logoClicks = 0;
    let logoTimer;
    document.querySelectorAll('.welcome-text a').forEach(el => {
        el.addEventListener('click', (e) => {
            if (e.ctrlKey || e.metaKey) return;
            logoClicks++;
            clearTimeout(logoTimer);
            logoTimer = setTimeout(() => logoClicks = 0, 1000);

            if (logoClicks === 5) {
                e.preventDefault();
                showEggMsg('🎉 连点 5 次！你是来找彩蛋的吧？');
                logoClicks = 0;
            }
        });
    });
}

function showEggMsg(msg) {
    const toast = document.createElement('div');
    toast.className = 'egg-toast';
    toast.textContent = msg;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// ===================================================
// 8. 文章词云
// ===================================================
async function renderWordCloud(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
        const articles = await loadArticlesMeta();
        const wordCount = {};

        for (const a of articles) {
            try {
                const res = await fetch(`posts/${a.id}.md`);
                if (res.ok) {
                    const text = await res.text();
                    const clean = text.replace(/```[\s\S]*?```/g, '').replace(/[#>*`\-\[\]()!]/g, '');
                    const tokens = clean.match(/[\u4e00-\u9fa5]{2,}|[a-zA-Z]{3,}/g) || [];
                    tokens.forEach(t => {
                        const lower = t.toLowerCase();
                        if (['the', 'and', 'for', 'with', 'this', 'that', 'from', 'have', 'are', 'was', 'you', '但是', '然后', '所以', '因为', '如果', '我们', '可以', '一个', '这个', '什么'].includes(lower)) return;
                        wordCount[t] = (wordCount[t] || 0) + 1;
                    });
                }
            } catch (e) {}
        }

        const words = Object.entries(wordCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 50);

        if (words.length === 0) {
            container.innerHTML = `<div class="empty-state"><div class="icon">☁️</div><h3>还没有足够的内容</h3></div>`;
            return;
        }

        const maxCount = words[0][1];
        const minCount = words[words.length - 1][1];
        const colors = ['#0284c7', '#16a34a', '#ea580c', '#9333ea', '#db2777', '#0891b2', '#ca8a04'];

        container.innerHTML = `
            <div class="wordcloud">
                ${words.map(([w, c], i) => {
                    const ratio = maxCount === minCount ? 0.5 : (c - minCount) / (maxCount - minCount);
                    const size = 0.9 + ratio * 1.8;
                    const color = colors[i % colors.length];
                    const rotate = (Math.random() - 0.5) * 20;
                    return `<span class="wordcloud-item" style="font-size:${size}rem;color:${color};transform:rotate(${rotate}deg);" title="${w}: ${c}次">${w}</span>`;
                }).join('')}
            </div>
        `;
    } catch (e) {
        container.innerHTML = `<div class="empty-state"><div class="icon">⚠️</div><h3>加载失败</h3></div>`;
    }
}

// ===================================================
// 9. 标签热力图
// ===================================================
async function renderTagHeatmap(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
        const articles = await loadArticlesMeta();
        const tagCount = {};
        articles.forEach(a => (a.tags || []).forEach(t => { tagCount[t] = (tagCount[t] || 0) + 1; }));

        const tags = Object.entries(tagCount).sort((a, b) => b[1] - a[1]);
        if (tags.length === 0) return;

        const maxCount = tags[0][1];

        container.innerHTML = `
            <div class="heatmap">
                ${tags.map(([tag, count]) => {
                    const intensity = count / maxCount;
                    const bg = `rgba(2, 132, 199, ${0.15 + intensity * 0.85})`;
                    const color = intensity > 0.5 ? '#ffffff' : 'var(--text)';
                    return `<a href="list.html?tag=${encodeURIComponent(tag)}" class="heatmap-item" style="background:${bg};color:${color};" title="${count} 篇">
                        ${tag}
                        <span class="heatmap-count">${count}</span>
                    </a>`;
                }).join('')}
            </div>
        `;
    } catch (e) {
        container.innerHTML = `<div class="empty-state"><div class="icon">⚠️</div><h3>加载失败</h3></div>`;
    }
}

// ===================================================
// 10. 日历组件
// ===================================================
async function renderCalendar(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
        const articles = await loadArticlesMeta();
        const dateMap = {};
        articles.forEach(a => {
            if (a.date) dateMap[a.date] = (dateMap[a.date] || 0) + 1;
        });

        let currentDate = new Date();
        let currentYear = currentDate.getFullYear();
        let currentMonth = currentDate.getMonth();

        function render() {
            const firstDay = new Date(currentYear, currentMonth, 1);
            const lastDay = new Date(currentYear, currentMonth + 1, 0);
            const daysInMonth = lastDay.getDate();
            const startWeekday = firstDay.getDay();

            const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

            let html = `
                <div class="calendar">
                    <div class="calendar-header">
                        <button class="calendar-nav" id="calPrev">‹</button>
                        <div class="calendar-title">${currentYear}年 ${monthNames[currentMonth]}</div>
                        <button class="calendar-nav" id="calNext">›</button>
                    </div>
                    <div class="calendar-weekdays">
                        <span>日</span><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span>
                    </div>
                    <div class="calendar-days">
            `;

            for (let i = 0; i < startWeekday; i++) {
                html += `<span class="calendar-day empty"></span>`;
            }

            for (let d = 1; d <= daysInMonth; d++) {
                const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                const count = dateMap[dateStr] || 0;
                const isToday = currentYear === new Date().getFullYear() &&
                                currentMonth === new Date().getMonth() &&
                                d === new Date().getDate();

                const cls = ['calendar-day'];
                if (count > 0) cls.push('has-post');
                if (isToday) cls.push('today');

                html += `<span class="${cls.join(' ')}" title="${count > 0 ? count + ' 篇文章' : ''}" data-date="${dateStr}">${d}${count > 0 ? '<i class="dot"></i>' : ''}</span>`;
            }

            html += `</div></div>`;
            container.innerHTML = html;

            container.querySelector('#calPrev').addEventListener('click', () => {
                currentMonth--;
                if (currentMonth < 0) { currentMonth = 11; currentYear--; }
                render();
            });

            container.querySelector('#calNext').addEventListener('click', () => {
                currentMonth++;
                if (currentMonth > 11) { currentMonth = 0; currentYear++; }
                render();
            });

            container.querySelectorAll('.calendar-day.has-post').forEach(el => {
                el.addEventListener('click', () => {
                    window.location.href = 'archive.html';
                });
            });
        }

        render();
    } catch (e) {
        container.innerHTML = `<div class="empty-state"><div class="icon">⚠️</div><h3>加载失败</h3></div>`;
    }
}

// ===================================================
// 11. 更多小游戏（404 页）
// ===================================================
function initGameSwitcher() {
    const wrap = document.querySelector('.game-wrap');
    if (!wrap) return;

    if (wrap.querySelector('.game-switcher')) return;

    const switcher = document.createElement('div');
    switcher.className = 'game-switcher';
    switcher.innerHTML = `
        <button class="game-tab active" data-game="pong">🏓 接球</button>
        <button class="game-tab" data-game="snake">🐍 贪吃蛇</button>
        <button class="game-tab" data-game="2048">🔢 2048</button>
        <button class="game-tab" data-game="brick">🧱 打砖块</button>
    `;
    wrap.insertBefore(switcher, wrap.firstChild);

    switcher.querySelectorAll('.game-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            switcher.querySelectorAll('.game-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const game = tab.dataset.game;
            document.querySelectorAll('.game-wrap canvas').forEach(c => c.remove());

            const canvas = document.createElement('canvas');
            canvas.id = 'gameCanvas';
            wrap.appendChild(canvas);

            if (game === 'pong') init404Game();
            else if (game === 'snake') initSnakeGame();
            else if (game === '2048') init2048Game();
            else if (game === 'brick') initBrickGame();
        });
    });
}

function initSnakeGame() {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    const CELL = 20;
    const COLS = 20;
    const ROWS = 20;

    let snake = [{x: 10, y: 10}];
    let dir = {x: 1, y: 0};
    let nextDir = {x: 1, y: 0};
    let food = {x: 15, y: 10};
    let score = 0;
    let gameOver = false;

    function randomFood() {
        while (true) {
            const f = {
                x: Math.floor(Math.random() * COLS),
                y: Math.floor(Math.random() * ROWS)
            };
            if (!snake.some(s => s.x === f.x && s.y === f.y)) {
                food = f;
                return;
            }
        }
    }

    function draw() {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(food.x * CELL + CELL/2, food.y * CELL + CELL/2, CELL/2 - 2, 0, Math.PI * 2);
        ctx.fill();

        snake.forEach((s, i) => {
            ctx.fillStyle = i === 0 ? '#38bdf8' : '#0ea5e9';
            ctx.fillRect(s.x * CELL + 1, s.y * CELL + 1, CELL - 2, CELL - 2);
        });

        ctx.fillStyle = '#fff';
        ctx.font = '16px sans-serif';
        ctx.fillText('Score: ' + score, 10, 24);

        if (gameOver) {
            ctx.fillStyle = 'rgba(0,0,0,0.7)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 24px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Game Over', canvas.width/2, canvas.height/2);
            ctx.font = '14px sans-serif';
            ctx.fillText('Click to Restart', canvas.width/2, canvas.height/2 + 30);
            ctx.textAlign = 'left';
        }
    }

    function update() {
        if (gameOver) return;
        dir = nextDir;
        const head = {x: snake[0].x + dir.x, y: snake[0].y + dir.y};

        if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
            gameOver = true;
            return;
        }
        if (snake.some(s => s.x === head.x && s.y === head.y)) {
            gameOver = true;
            return;
        }

        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            score++;
            randomFood();
        } else {
            snake.pop();
        }
    }

    function loop() {
        update();
        draw();
    }

    if (canvas.__snakeInterval) clearInterval(canvas.__snakeInterval);
    canvas.__snakeInterval = setInterval(loop, 120);

    const keyHandler = (e) => {
        if (gameOver) return;
        const map = {
            'ArrowUp': {x: 0, y: -1},
            'ArrowDown': {x: 0, y: 1},
            'ArrowLeft': {x: -1, y: 0},
            'ArrowRight': {x: 1, y: 0},
            'w': {x: 0, y: -1},
            's': {x: 0, y: 1},
            'a': {x: -1, y: 0},
            'd': {x: 1, y: 0}
        };
        const nd = map[e.key];
        if (nd) {
            if (nd.x === -dir.x && nd.y === -dir.y) return;
            nextDir = nd;
            e.preventDefault();
        }
    };
    document.addEventListener('keydown', keyHandler);

    canvas.onclick = () => {
        if (gameOver) {
            snake = [{x: 10, y: 10}];
            dir = {x: 1, y: 0};
            nextDir = {x: 1, y: 0};
            score = 0;
            gameOver = false;
            randomFood();
        }
    };
}

function init2048Game() {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    const SIZE = 4;
    const CELL = 90;
    const GAP = 10;
    const OFFSET = (400 - SIZE * CELL - (SIZE - 1) * GAP) / 2;

    let grid = [];
    let score = 0;
    let gameOver = false;

    function init() {
        grid = Array(SIZE).fill().map(() => Array(SIZE).fill(0));
        score = 0;
        gameOver = false;
        addTile();
        addTile();
    }

    function addTile() {
        const empty = [];
        for (let i = 0; i < SIZE; i++)
            for (let j = 0; j < SIZE; j++)
                if (grid[i][j] === 0) empty.push({i, j});
        if (empty.length === 0) return;
        const {i, j} = empty[Math.floor(Math.random() * empty.length)];
        grid[i][j] = Math.random() < 0.9 ? 2 : 4;
    }

    function draw() {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, 400, 400);

        for (let i = 0; i < SIZE; i++) {
            for (let j = 0; j < SIZE; j++) {
                const x = OFFSET + j * (CELL + GAP);
                const y = OFFSET + i * (CELL + GAP);
                const v = grid[i][j];

                ctx.fillStyle = v === 0 ? '#1e293b' : tileColor(v);
                ctx.fillRect(x, y, CELL, CELL);

                if (v > 0) {
                    ctx.fillStyle = v <= 4 ? '#0f172a' : '#ffffff';
                    ctx.font = `bold ${v >= 1024 ? 24 : v >= 128 ? 32 : 40}px sans-serif`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(v, x + CELL/2, y + CELL/2);
                }
            }
        }

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 18px sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText('Score: ' + score, 10, 10);

        if (gameOver) {
            ctx.fillStyle = 'rgba(0,0,0,0.7)';
            ctx.fillRect(0, 0, 400, 400);
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 28px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('Game Over', 200, 190);
            ctx.font = '16px sans-serif';
            ctx.fillText('Click to Restart', 200, 230);
        }
    }

    function tileColor(v) {
        const colors = {
            2: '#eee4da', 4: '#ede0c8', 8: '#f2b179', 16: '#f59563',
            32: '#f67c5f', 64: '#f65e3b', 128: '#edcf72', 256: '#edcc61',
            512: '#edc850', 1024: '#edc53f', 2048: '#edc22e'
        };
        return colors[v] || '#3c3a32';
    }

    function move(dir) {
        let moved = false;
        const rotate = (g) => g[0].map((_, i) => g.map(row => row[i]).reverse());

        let g = grid.map(r => [...r]);

        for (let r = 0; r < dir; r++) g = rotate(g);

        for (let i = 0; i < SIZE; i++) {
            let row = g[i].filter(v => v !== 0);
            for (let j = 0; j < row.length - 1; j++) {
                if (row[j] === row[j+1]) {
                    row[j] *= 2;
                    score += row[j];
                    row.splice(j+1, 1);
                }
            }
            while (row.length < SIZE) row.push(0);
            if (row.join(',') !== g[i].join(',')) moved = true;
            g[i] = row;
        }

        for (let r = 0; r < (4 - dir) % 4; r++) g = rotate(g);

        if (moved) {
            grid = g;
            addTile();
            if (!canMove()) gameOver = true;
        }
    }

    function canMove() {
        for (let i = 0; i < SIZE; i++) {
            for (let j = 0; j < SIZE; j++) {
                if (grid[i][j] === 0) return true;
                if (i < SIZE-1 && grid[i][j] === grid[i+1][j]) return true;
                if (j < SIZE-1 && grid[i][j] === grid[i][j+1]) return true;
            }
        }
        return false;
    }

    const keyHandler = (e) => {
        if (gameOver) return;
        // 旋转方向映射：rotate 是逆时针
        // 0 次 = 向左，1 次 = 向下，2 次 = 向右，3 次 = 向上
        const map = {
            'ArrowLeft': 0, 'ArrowDown': 1, 'ArrowRight': 2, 'ArrowUp': 3,
            'a': 0, 's': 1, 'd': 2, 'w': 3
        };
        if (map[e.key] !== undefined) {
            move(map[e.key]);
            draw();
            e.preventDefault();
        }
    };
    document.addEventListener('keydown', keyHandler);

    canvas.onclick = () => {
        if (gameOver) {
            init();
            draw();
        }
    };

    init();
    draw();
}

function initBrickGame() {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');

    const paddle = {w: 80, h: 10, x: 160, y: 380};
    const ball = {x: 200, y: 350, r: 8, dx: 3, dy: -3};
    const bricks = [];
    const COLS = 8;
    const ROWS = 4;
    const BW = 44;
    const BH = 18;
    const OFFSET_X = 10;
    const OFFSET_Y = 40;

    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLS; j++) {
            bricks.push({
                x: OFFSET_X + j * (BW + 2),
                y: OFFSET_Y + i * (BH + 4),
                w: BW,
                h: BH,
                alive: true,
                color: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6'][i]
            });
        }
    }

    let score = 0;
    let gameOver = false;

    document.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        paddle.x = Math.max(0, Math.min(400 - paddle.w, mx - paddle.w / 2));
    });

    document.addEventListener('touchmove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mx = e.touches[0].clientX - rect.left;
        paddle.x = Math.max(0, Math.min(400 - paddle.w, mx - paddle.w / 2));
    });

    function draw() {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, 400, 400);

        bricks.forEach(b => {
            if (b.alive) {
                ctx.fillStyle = b.color;
                ctx.fillRect(b.x, b.y, b.w, b.h);
            }
        });

        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);

        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
        ctx.fillStyle = '#fbbf24';
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.font = '16px sans-serif';
        ctx.fillText('Score: ' + score, 10, 24);

        if (gameOver) {
            ctx.fillStyle = 'rgba(0,0,0,0.7)';
            ctx.fillRect(0, 0, 400, 400);
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 24px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Game Over', 200, 190);
            ctx.font = '14px sans-serif';
            ctx.fillText('Click to Restart', 200, 220);
            ctx.textAlign = 'left';
        }
    }

    function update() {
        if (gameOver) return;

        ball.x += ball.dx;
        ball.y += ball.dy;

        if (ball.x - ball.r < 0 || ball.x + ball.r > 400) ball.dx = -ball.dx;
        if (ball.y - ball.r < 0) ball.dy = -ball.dy;

        if (ball.y + ball.r > paddle.y &&
            ball.x > paddle.x &&
            ball.x < paddle.x + paddle.w &&
            ball.dy > 0) {
            ball.dy = -ball.dy;
        }

        bricks.forEach(b => {
            if (!b.alive) return;
            if (ball.x + ball.r > b.x &&
                ball.x - ball.r < b.x + b.w &&
                ball.y + ball.r > b.y &&
                ball.y - ball.r < b.y + b.h) {
                b.alive = false;
                ball.dy = -ball.dy;
                score++;
            }
        });

        if (ball.y - ball.r > 400) gameOver = true;
        if (bricks.every(b => !b.alive)) gameOver = true;
    }

    function loop() {
        update();
        draw();
        requestAnimationFrame(loop);
    }

    canvas.onclick = () => {
        if (gameOver) {
            bricks.forEach(b => b.alive = true);
            ball.x = 200;
            ball.y = 350;
            ball.dx = 3;
            ball.dy = -3;
            score = 0;
            gameOver = false;
        }
    };

    loop();
}

// 暴露
window.initBlogRuntime = initBlogRuntime;
window.initTypewriter = initTypewriter;
window.renderGallery = renderGallery;
window.initI18n = initI18n;
window.applyLang = applyLang;
window.render3DTagCloud = render3DTagCloud;
window.initShortLink = initShortLink;
window.initMoreEggs = initMoreEggs;
window.renderWordCloud = renderWordCloud;
window.renderTagHeatmap = renderTagHeatmap;
window.renderCalendar = renderCalendar;
window.initGameSwitcher = initGameSwitcher;
window.initSnakeGame = initSnakeGame;
window.init2048Game = init2048Game;
window.initBrickGame = initBrickGame;