// ===================================================
// 主题色切换（预设 + 自定义）
// ===================================================
const THEME_COLORS = {
    blue:   { accent: '#0284c7', soft: '#e0f2fe', dark: '#0369a1', darker: '#075985' },
    green:  { accent: '#16a34a', soft: '#dcfce7', dark: '#15803d', darker: '#166534' },
    purple: { accent: '#9333ea', soft: '#f3e8ff', dark: '#7e22ce', darker: '#6b21a8' },
    orange: { accent: '#ea580c', soft: '#ffedd5', dark: '#c2410c', darker: '#9a3412' },
    pink:   { accent: '#db2777', soft: '#fce7f3', dark: '#be185d', darker: '#9d174d' }
};

function initThemeColorPicker() {
    const nav = document.querySelector('.nav-tabs');
    if (!nav) return;

    const saved = localStorage.getItem('themeColor') || 'blue';
    if (saved === 'custom') {
        const custom = localStorage.getItem('themeColorCustom') || '#0284c7';
        applyCustomThemeColor(custom);
    } else {
        applyThemeColor(saved);
    }

    let picker = document.querySelector('.theme-color-picker');

    if (!picker) {
        picker = document.createElement('div');
        picker.className = 'theme-color-picker';
        picker.innerHTML = `
            <button class="theme-color-btn" id="themeColorBtn" title="切换主题色">🎨</button>
            <div class="theme-color-menu" id="themeColorMenu">
                ${Object.entries(THEME_COLORS).map(([name, c]) => `
                    <div class="theme-color-dot ${name === saved ? 'active' : ''}"
                         data-color="${name}"
                         style="background:${c.accent}"
                         title="${name}"></div>
                `).join('')}
                <div class="theme-color-custom">
                    <input type="color" id="themeColorCustom" value="${localStorage.getItem('themeColorCustom') || '#0284c7'}" title="自定义颜色">
                    <label for="themeColorCustom">自定义</label>
                </div>
            </div>
        `;
        nav.appendChild(picker);
    } else {
        picker.querySelectorAll('.theme-color-dot').forEach(dot => {
            dot.classList.toggle('active', dot.dataset.color === saved);
        });
    }

    const btn = picker.querySelector('.theme-color-btn');
    const menu = picker.querySelector('.theme-color-menu');
    if (!btn || !menu) return;

    // 🎨 按钮：切换菜单
    btn.onclick = function(e) {
        e.stopPropagation();
        menu.classList.toggle('show');
    };

    // 菜单：事件委托
    menu.onclick = function(e) {
        const dot = e.target.closest('.theme-color-dot');
        if (dot) {
            e.stopPropagation();
            const color = dot.dataset.color;
            if (!color) return;
            applyThemeColor(color);
            localStorage.setItem('themeColor', color);
            menu.querySelectorAll('.theme-color-dot').forEach(d => d.classList.remove('active'));
            dot.classList.add('active');
            menu.classList.remove('show');
            return;
        }
        e.stopPropagation();
    };

    // 自定义颜色
    const customInput = picker.querySelector('#themeColorCustom');
    if (customInput) {
        customInput.oninput = function(e) {
            const color = e.target.value;
            applyCustomThemeColor(color);
            localStorage.setItem('themeColor', 'custom');
            localStorage.setItem('themeColorCustom', color);
            menu.querySelectorAll('.theme-color-dot').forEach(d => d.classList.remove('active'));
        };
    }

    // 点其他地方关闭（只绑一次）
    if (!window.__themeMenuCloseBound) {
        document.onclick = function() {
            document.querySelectorAll('.theme-color-menu').forEach(m => m.classList.remove('show'));
        };
        window.__themeMenuCloseBound = true;
    }
}

function applyThemeColor(name) {
    const c = THEME_COLORS[name] || THEME_COLORS.blue;
    const root = document.documentElement;
    root.style.setProperty('--accent', c.accent);
    root.style.setProperty('--accent-soft', c.soft);
    root.style.setProperty('--welcome-bg-light', c.soft);
    root.style.setProperty('--nav-bg-light', c.dark);
    root.style.setProperty('--welcome-bg-dark', c.dark);
    root.style.setProperty('--nav-bg-dark', c.darker);
}

function applyCustomThemeColor(hex) {
    const root = document.documentElement;
    root.style.setProperty('--accent', hex);
    root.style.setProperty('--accent-soft', hexToLight(hex));
    root.style.setProperty('--welcome-bg-light', hexToLight(hex));
    root.style.setProperty('--nav-bg-light', hexToDark(hex));
    root.style.setProperty('--welcome-bg-dark', hexToDark(hex));
    root.style.setProperty('--nav-bg-dark', hexToDarker(hex));
}

function hexToLight(hex) { return mixHex(hex, '#ffffff', 0.8); }
function hexToDark(hex)  { return mixHex(hex, '#000000', 0.25); }
function hexToDarker(hex){ return mixHex(hex, '#000000', 0.45); }

function mixHex(hex1, hex2, ratio) {
    const c1 = hexToRgb(hex1);
    const c2 = hexToRgb(hex2);
    const r = Math.round(c1.r * (1 - ratio) + c2.r * ratio);
    const g = Math.round(c1.g * (1 - ratio) + c2.g * ratio);
    const b = Math.round(c1.b * (1 - ratio) + c2.b * ratio);
    return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

function hexToRgb(hex) {
    const h = hex.replace('#', '');
    return {
        r: parseInt(h.slice(0, 2), 16),
        g: parseInt(h.slice(2, 4), 16),
        b: parseInt(h.slice(4, 6), 16)
    };
}

// ===================================================
// 沉浸阅读模式（含全屏）
// ===================================================
function initImmersiveMode() {
    const articleDetail = document.getElementById('articleDetail');
    if (!articleDetail) return;
    if (document.querySelector('.immersive-btn')) return;

    const btn = document.createElement('button');
    btn.className = 'immersive-btn show';
    btn.title = '沉浸阅读模式';
    btn.textContent = '📖';
    document.body.appendChild(btn);

    btn.addEventListener('click', () => {
        const isImmersive = document.body.classList.toggle('immersive');
        btn.textContent = isImmersive ? '✖' : '📖';

        if (isImmersive) {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen().catch(() => {});
            }
        } else {
            if (document.fullscreenElement) {
                document.exitFullscreen().catch(() => {});
            }
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.body.classList.contains('immersive')) {
            document.body.classList.remove('immersive');
            btn.textContent = '📖';
            if (document.fullscreenElement) {
                document.exitFullscreen().catch(() => {});
            }
        }
    });
}

// ===================================================
// 阅读进度记忆
// ===================================================
function initReadingPosition() {
    const articleDetail = document.getElementById('articleDetail');
    if (!articleDetail) return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) return;

    const key = 'reading-pos-' + id;
    const saved = parseInt(localStorage.getItem(key) || '0', 10);
    if (saved > 100) {
        setTimeout(() => window.scrollTo({ top: saved, behavior: 'smooth' }), 500);
    }

    let t;
    window.addEventListener('scroll', () => {
        clearTimeout(t);
        t = setTimeout(() => localStorage.setItem(key, window.scrollY), 300);
    });
}

// ===================================================
// 相关文章推荐
// ===================================================
async function renderRelatedArticles(article, container) {
    try {
        const articles = await loadArticlesMeta();
        const tags = article.tags || [];
        const lang = localStorage.getItem('lang') || 'zh';
        const isEn = lang === 'en';

        let related = articles.filter(a => {
            if (a.id === article.id) return false;
            return (a.tags || []).some(t => tags.includes(t));
        });

        if (related.length < 3) {
            const catRelated = articles.filter(a => {
                if (a.id === article.id) return false;
                if (related.find(r => r.id === a.id)) return false;
                return a.category === article.category;
            });
            related = related.concat(catRelated);
        }

        related = related.slice(0, 3);
        if (related.length === 0) return;

        const title = isEn ? '🎲 Related Posts' : '🎲 相关文章';

        const div = document.createElement('div');
        div.className = 'related-articles';
        div.innerHTML = `
            <div class="related-title">${title}</div>
            <ul class="related-list">
                ${related.map(a => {
                    const t = (isEn && a.titleEn) ? a.titleEn : a.title;
                    return `<li><a href="article.html?id=${a.id}">${t}</a></li>`;
                }).join('')}
            </ul>
        `;

        const shareBar = container.querySelector('.share-bar');
        if (shareBar) {
            shareBar.parentNode.insertBefore(div, shareBar);
        } else {
            const detail = container.querySelector('.article-detail');
            if (detail) detail.appendChild(div);
        }
    } catch (e) {}
}

// ===================================================
// 标签云
// ===================================================
async function renderTagCloud(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
        const articles = await loadArticlesMeta();
        const lang = localStorage.getItem('lang') || 'zh';
        const isEn = lang === 'en';

        const tagCount = {};
        articles.forEach(a => {
            const tags = (isEn && a.tagsEn) ? a.tagsEn : (a.tags || []);
            tags.forEach(t => { tagCount[t] = (tagCount[t] || 0) + 1; });
        });

        const tags = Object.entries(tagCount).sort((a, b) => b[1] - a[1]);
        if (tags.length === 0) return;

        const maxCount = tags[0][1];
        const minCount = tags[tags.length - 1][1];
        const maxSize = 2.0, minSize = 0.9;

        container.innerHTML = `<div class="tag-cloud">` + tags.map(([tag, count]) => {
            const ratio = maxCount === minCount ? 0.5 : (count - minCount) / (maxCount - minCount);
            const size = minSize + ratio * (maxSize - minSize);
            return `<a href="list.html?tag=${encodeURIComponent(tag)}" class="tag-cloud-item" style="font-size:${size}rem;">${tag}<sup style="font-size:0.6em;color:var(--text-faint);margin-left:0.2rem;">${count}</sup></a>`;
        }).join('') + `</div>`;
    } catch (e) {}
}

// ===================================================
// 彩蛋
// ===================================================
function initEasterEgg() {
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'B') {
            e.preventDefault();
            showEgg();
        }
    });
}

function showEgg() {
    const toast = document.createElement('div');
    toast.className = 'egg-toast';
    toast.textContent = '🎉 恭喜发现彩蛋！你是个细心的人 ~';
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// ===================================================
// 博客统计（首页）
// ===================================================
async function initBlogStats() {
    const container = document.getElementById('blogStats');
    if (!container) return;

    try {
        const articles = await loadArticlesMeta();
        const tagSet = new Set();
        let totalWords = 0;

        for (const a of articles) {
            (a.tags || []).forEach(t => tagSet.add(t));
            try {
                const res = await fetch(`posts/${a.id}.md`);
                if (res.ok) {
                    const text = await res.text();
                    const plain = text.replace(/```[\s\S]*?```/g, '').replace(/[#>*`\-\[\]()]/g, '');
                    totalWords += plain.replace(/\s/g, '').length;
                }
            } catch (e) {}
        }

        const lang = localStorage.getItem('lang') || 'zh';
        const isEn = lang === 'en';

        const labels = isEn ? {
            posts: 'Posts', tags: 'Tags', words: 'Words'
        } : {
            posts: '篇文章', tags: '个标签', words: '字'
        };

        container.innerHTML = `
            <div class="stats-card">
                <div class="stat-item"><span class="stat-num">${articles.length}</span><span class="stat-label">${labels.posts}</span></div>
                <div class="stat-item"><span class="stat-num">${tagSet.size}</span><span class="stat-label">${labels.tags}</span></div>
                <div class="stat-item"><span class="stat-num">${totalWords.toLocaleString()}</span><span class="stat-label">${labels.words}</span></div>
            </div>
        `;
    } catch (e) {}
}

// ===================================================
// 每日一句
// ===================================================
const QUOTES = [
    { text: "生活不止眼前的苟且，还有诗和远方。", author: "高晓松" },
    { text: "纸上得来终觉浅，绝知此事要躬行。", author: "陆游" },
    { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
    { text: "山重水复疑无路，柳暗花明又一村。", author: "陆游" },
    { text: "路漫漫其修远兮，吾将上下而求索。", author: "屈原" },
    { text: "合抱之木，生于毫末；九层之台，起于累土。", author: "老子" },
    { text: "不积跬步，无以至千里。", author: "荀子" },
    { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
    { text: "学而不思则罔，思而不学则殆。", author: "孔子" },
    { text: "代码写得好，bug 就少。", author: "佚名" }
];

function initDailyQuote() {
    const container = document.getElementById('dailyQuote');
    if (!container) return;

    const day = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
    const q = QUOTES[day % QUOTES.length];

    container.innerHTML = `
        <div class="quote-box">
            <div class="quote-text">"${q.text}"</div>
            <div class="quote-author">—— ${q.author}</div>
        </div>
    `;
}

// ===================================================
// 时钟
// ===================================================
function initClock() {
    const container = document.getElementById('clockBox');
    if (!container) return;

    function update() {
        const now = new Date();
        const lang = localStorage.getItem('lang') || 'zh';
        const isEn = lang === 'en';

        const date = now.toLocaleDateString(isEn ? 'en-US' : 'zh-CN', {
            year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
        });
        const time = now.toLocaleTimeString(isEn ? 'en-US' : 'zh-CN', {
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        });
        container.innerHTML = `
            <div class="clock-box">
                <div class="clock-time">${time}</div>
                <div class="clock-date">${date}</div>
            </div>
        `;
    }

    update();
    setInterval(update, 1000);
}

// ===================================================
// 天气
// ===================================================
async function initWeather() {
    const container = document.getElementById('weatherBox');
    if (!container) return;

    try {
        const res = await fetch('https://wttr.in/Guangzhou?format=j1');
        const data = await res.json();
        const current = data.current_condition[0];
        const temp = current.temp_C;
        const desc = current.weatherDesc[0].value;
        const humidity = current.humidity;
        const wind = current.windspeedKmph;

        const lang = localStorage.getItem('lang') || 'zh';
        const isEn = lang === 'en';

        const descMap = {
            'Sunny': '晴', 'Clear': '晴', 'Partly cloudy': '多云',
            'Cloudy': '阴', 'Overcast': '阴', 'Mist': '雾',
            'Patchy rain possible': '可能有雨', 'Light rain': '小雨',
            'Moderate rain': '中雨', 'Heavy rain': '大雨',
            'Light snow': '小雪', 'Moderate snow': '中雪', 'Heavy snow': '大雪'
        };
        const descZh = descMap[desc] || desc;
        const displayDesc = isEn ? desc : descZh;
        const city = isEn ? 'Guangzhou' : '广州';
        const humidityLabel = isEn ? 'Humidity' : '湿度';
        const windLabel = isEn ? 'Wind' : '风';

        container.innerHTML = `
            <div class="weather-box">
                <div class="weather-city">📍 ${city}</div>
                <div class="weather-temp">${temp}°C</div>
                <div class="weather-desc">${displayDesc}</div>
                <div class="weather-detail">${humidityLabel} ${humidity}% · ${windLabel} ${wind}km/h</div>
            </div>
        `;
    } catch (e) {
        container.innerHTML = '';
    }
}

// ===================================================
// 时间线
// ===================================================
async function renderTimeline(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
        const articles = await loadArticlesMeta();
        const lang = localStorage.getItem('lang') || 'zh';
        const isEn = lang === 'en';

        if (articles.length === 0) {
            container.innerHTML = `<div class="empty-state"><div class="icon">📭</div><h3>${isEn ? 'No posts yet' : '还没有文章'}</h3></div>`;
            return;
        }

        const sorted = articles.slice().sort((a, b) => (b.date || '').localeCompare(a.date || ''));

        container.innerHTML = `
            <div class="timeline">
                ${sorted.map(a => {
                    const title = (isEn && a.titleEn) ? a.titleEn : a.title;
                    const summary = (isEn && a.summaryEn) ? a.summaryEn : (a.summary || '');
                    const category = (isEn && a.categoryEn) ? a.categoryEn : a.category;
                    const tags = (isEn && a.tagsEn) ? a.tagsEn : (a.tags || []);
                    return `
                        <div class="timeline-item">
                            <div class="timeline-dot"></div>
                            <div class="timeline-date">${a.date}</div>
                            <div class="timeline-content">
                                <a href="article.html?id=${a.id}" class="timeline-title">${title}</a>
                                <p class="timeline-summary">${summary}</p>
                                <div class="timeline-tags">
                                    <span class="card-tag">${category}</span>
                                    ${tags.map(t => `<span class="card-tag">${t}</span>`).join('')}
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    } catch (e) {
        container.innerHTML = `<div class="empty-state"><div class="icon">⚠️</div><h3>加载失败</h3><p>${e.message}</p></div>`;
    }
}

// ===================================================
// 博客统计页
// ===================================================
async function renderStatsPage(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
        const articles = await loadArticlesMeta();
        const lang = localStorage.getItem('lang') || 'zh';
        const isEn = lang === 'en';

        const tagCount = {};
        const catCount = {};
        let totalWords = 0;
        const perArticle = [];

        for (const a of articles) {
            const tags = (isEn && a.tagsEn) ? a.tagsEn : (a.tags || []);
            tags.forEach(t => tagCount[t] = (tagCount[t] || 0) + 1);
            const cat = (isEn && a.categoryEn) ? a.categoryEn : a.category;
            if (cat) catCount[cat] = (catCount[cat] || 0) + 1;

            let words = 0;
            try {
                const res = await fetch(`posts/${a.id}.md`);
                if (res.ok) {
                    const text = await res.text();
                    const plain = text.replace(/```[\s\S]*?```/g, '').replace(/[#>*`\-\[\]()]/g, '');
                    words = plain.replace(/\s/g, '').length;
                    totalWords += words;
                }
            } catch (e) {}
            perArticle.push({
                title: (isEn && a.titleEn) ? a.titleEn : a.title,
                id: a.id,
                words
            });
        }

        const topTags = Object.entries(tagCount).sort((a, b) => b[1] - a[1]).slice(0, 10);
        const topCats = Object.entries(catCount).sort((a, b) => b[1] - a[1]);
        const topArticles = perArticle.slice().sort((a, b) => b.words - a.words).slice(0, 5);

        const tr = isEn ? {
            articles: 'Articles', tags: 'Tags', categories: 'Categories', words: 'Words',
            hotTags: '🔥 Hot Tags', catDist: '📁 Categories', longest: '📝 Longest Posts',
            word: 'words'
        } : {
            articles: '篇文章', tags: '个标签', categories: '个分类', words: '总字数',
            hotTags: '🔥 热门标签', catDist: '📁 分类分布', longest: '📝 最长文章',
            word: '字'
        };

        container.innerHTML = `
            <div class="stats-page">
                <div class="stats-grid">
                    <div class="stat-card"><div class="stat-big">${articles.length}</div><div class="stat-label">${tr.articles}</div></div>
                    <div class="stat-card"><div class="stat-big">${Object.keys(tagCount).length}</div><div class="stat-label">${tr.tags}</div></div>
                    <div class="stat-card"><div class="stat-big">${Object.keys(catCount).length}</div><div class="stat-label">${tr.categories}</div></div>
                    <div class="stat-card"><div class="stat-big">${totalWords.toLocaleString()}</div><div class="stat-label">${tr.words}</div></div>
                </div>

                <h3 class="stats-section-title">${tr.hotTags}</h3>
                <div class="stats-tags">
                    ${topTags.map(([tag, n]) => `<span class="stats-tag">${tag} <b>${n}</b></span>`).join('')}
                </div>

                <h3 class="stats-section-title">${tr.catDist}</h3>
                <div class="stats-tags">
                    ${topCats.map(([c, n]) => `<span class="stats-tag">${c} <b>${n}</b></span>`).join('')}
                </div>

                <h3 class="stats-section-title">${tr.longest}</h3>
                <ul class="stats-list">
                    ${topArticles.map(a => `<li><a href="article.html?id=${a.id}">${a.title}</a> <span>${a.words} ${tr.word}</span></li>`).join('')}
                </ul>
            </div>
        `;
    } catch (e) {
        container.innerHTML = `<div class="empty-state"><div class="icon">⚠️</div><h3>加载失败</h3><p>${e.message}</p></div>`;
    }
}

// ===================================================
// 404 小游戏
// ===================================================
function init404Game() {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const W = canvas.width = 400;
    const H = canvas.height = 300;

    let paddle = { x: W / 2 - 40, y: H - 20, w: 80, h: 10 };
    let ball = { x: W / 2, y: H / 2, r: 8, dx: 3, dy: -3 };
    let score = 0;
    let gameOver = false;

    document.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        paddle.x = Math.max(0, Math.min(W - paddle.w, mx - paddle.w / 2));
    });

    document.addEventListener('touchmove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mx = e.touches[0].clientX - rect.left;
        paddle.x = Math.max(0, Math.min(W - paddle.w, mx - paddle.w / 2));
    });

    function draw() {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, W, H);

        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);

        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
        ctx.fillStyle = '#fbbf24';
        ctx.fill();

        ctx.fillStyle = '#fff';
        ctx.font = '16px sans-serif';
        const lang = localStorage.getItem('lang') || 'zh';
        const isEn = lang === 'en';
        const scoreLabel = isEn ? 'Score: ' : '得分: ';
        ctx.fillText(scoreLabel + score, 10, 24);

        if (gameOver) {
            ctx.fillStyle = 'rgba(0,0,0,0.7)';
            ctx.fillRect(0, 0, W, H);
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 24px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(isEn ? 'Game Over' : '游戏结束', W / 2, H / 2 - 10);
            ctx.font = '14px sans-serif';
            ctx.fillText(isEn ? 'Click to Restart' : '点击重新开始', W / 2, H / 2 + 20);
            ctx.textAlign = 'left';
        }
    }

    function update() {
        if (gameOver) return;

        ball.x += ball.dx;
        ball.y += ball.dy;

        if (ball.x - ball.r < 0 || ball.x + ball.r > W) ball.dx = -ball.dx;
        if (ball.y - ball.r < 0) ball.dy = -ball.dy;

        if (ball.y + ball.r > paddle.y &&
            ball.x > paddle.x &&
            ball.x < paddle.x + paddle.w &&
            ball.dy > 0) {
            ball.dy = -ball.dy;
            score++;
        }

        if (ball.y + ball.r > H) gameOver = true;
    }

    function loop() {
        update();
        draw();
        requestAnimationFrame(loop);
    }

    canvas.addEventListener('click', () => {
        if (gameOver) {
            ball = { x: W / 2, y: H / 2, r: 8, dx: 3, dy: -3 };
            score = 0;
            gameOver = false;
        }
    });

    loop();
}

// ===================================================
// 全文搜索
// ===================================================
const fullTextCache = {};

async function searchFullText(keyword) {
    const articles = await loadArticlesMeta();
    const kw = keyword.toLowerCase();
    const results = [];

    for (const a of articles) {
        let text = fullTextCache[a.id];
        if (!text) {
            try {
                const res = await fetch(`posts/${a.id}.md`);
                if (res.ok) {
                    text = (await res.text()).toLowerCase();
                    fullTextCache[a.id] = text;
                }
            } catch (e) {}
        }
        if (text && text.includes(kw)) results.push(a);
    }
    return results;
}