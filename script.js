// ===================================================
// 文章元数据
// ===================================================
let articlesMetaCache = null;

async function loadArticlesMeta() {
    if (articlesMetaCache) return articlesMetaCache;
    const res = await fetch('posts/index.json');
    if (!res.ok) throw new Error('无法加载 posts/index.json（HTTP ' + res.status + '）');
    articlesMetaCache = await res.json();
    return articlesMetaCache;
}

// ===================================================
// 分页大小
// ===================================================
const PAGE_SIZE = 20;

// ===================================================
// HTML 转义
// ===================================================
function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// ===================================================
// 解析 Markdown
// ===================================================
function parseMarkdown(mdContent) {
    if (!window.marked) {
        return `<pre>${escapeHtml(mdContent)}</pre>`;
    }

    const codeBlocks = [];
    const placeholder = '___CODEBLOCK_' + Date.now() + '_';

    const mdSafe = mdContent.replace(/```(\w*)\r?\n([\s\S]*?)```/g, (m, lang, code) => {
        const idx = codeBlocks.length;
        codeBlocks.push({ lang: lang || 'plaintext', code: code });
        return '\n\n' + placeholder + idx + '\n\n';
    });

    let parsed = marked.parse(mdSafe, {
        mangle: false,
        headerIds: false,
        breaks: false,
        gfm: true
    });

    codeBlocks.forEach((cb, i) => {
        const codeHtml = escapeHtml(cb.code);
        const block = `<pre><code class="language-${cb.lang}">${codeHtml}</code></pre>`;
        parsed = parsed.replace(placeholder + i, block);
    });

    return parsed;
}

// ===================================================
// 渲染文章列表（搜索 + 全文搜索 + 排序 + 分页）
// ===================================================
async function renderArticleList(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
        const articles = await loadArticlesMeta();
        if (articles.length === 0) {
            container.innerHTML = emptyHtml('📭', '还没有文章', '在 posts/index.json 里添加第一条吧。');
            return;
        }

        const paginationEl = document.getElementById('pagination');
        const searchInput = document.getElementById('searchInput');
        const sortSelect = document.getElementById('sortSelect');

        let currentPage = 1;
        let keyword = '';
        let sortMode = 'date-desc';
        let fullTextResults = null;   // 全文搜索结果缓存

        function applyFilterSort() {
            let list = articles.slice();

            if (keyword) {
                // 如果全文搜索结果存在，优先用它
                if (fullTextResults !== null) {
                    list = fullTextResults.slice();
                } else {
                    const kw = keyword.toLowerCase();
                    list = list.filter(a => {
                        const hay = [
                            a.title,
                            a.summary,
                            a.category,
                            ...(a.tags || [])
                        ].join(' ').toLowerCase();
                        return hay.includes(kw);
                    });
                }
            }

            list.sort((a, b) => {
                if (sortMode === 'date-desc') return (b.date || '').localeCompare(a.date || '');
                if (sortMode === 'date-asc')  return (a.date || '').localeCompare(b.date || '');
                if (sortMode === 'title-asc') return (a.title || '').localeCompare(b.title || '', 'zh');
                if (sortMode === 'title-desc') return (b.title || '').localeCompare(a.title || '', 'zh');
                return 0;
            });

            return list;
        }

        function renderPage() {
            const list = applyFilterSort();

            if (list.length === 0) {
                container.innerHTML = emptyHtml('🔍', '没有找到文章', '换个关键词试试？');
                if (paginationEl) paginationEl.innerHTML = '';
                return;
            }

            const totalPages = Math.ceil(list.length / PAGE_SIZE);
            if (currentPage > totalPages) currentPage = totalPages;

            const start = (currentPage - 1) * PAGE_SIZE;
            const pageList = list.slice(start, start + PAGE_SIZE);

            container.innerHTML = pageList.map(a => cardHtml(a, keyword)).join('');

            pageList.forEach(async (a) => {
                const stats = await getArticleStats(a.id);
                const el = container.querySelector(`[data-stats-id="${a.id}"]`);
                if (el && stats) {
                    el.innerHTML = `
                        <span>📊 ${stats.words} 字</span>
                        <span>⏱️ 约 ${stats.min} 分钟</span>
                    `;
                }
            });

            animateCards(container);
            renderPagination(paginationEl, currentPage, totalPages, (p) => {
                currentPage = p;
                renderPage();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        renderPage();

        if (searchInput) {
            let t;
            searchInput.addEventListener('input', () => {
                clearTimeout(t);
                t = setTimeout(async () => {
                    keyword = searchInput.value.trim();
                    fullTextResults = null;
                    currentPage = 1;

                    // 先按本地搜索结果渲染
                    renderPage();

                    // 如果本地搜索无结果且关键词非空，异步做全文搜索
                    if (keyword && container.querySelector('.empty-state')) {
                        if (typeof searchFullText === 'function') {
                            const results = await searchFullText(keyword);
                            if (results.length > 0 && keyword === searchInput.value.trim()) {
                                fullTextResults = results;
                                renderPage();
                            }
                        }
                    }
                }, 300);
            });
        }

        if (sortSelect) {
            sortSelect.addEventListener('change', () => {
                sortMode = sortSelect.value;
                currentPage = 1;
                renderPage();
            });
        }

    } catch (e) {
        container.innerHTML = errorHtml(e.message);
    }
}

// ===================================================
// 获取文章字数 / 阅读时间
// ===================================================
async function getArticleStats(id) {
    try {
        const res = await fetch(`posts/${id}.md`);
        if (!res.ok) return null;
        const text = await res.text();
        const plain = text.replace(/```[\s\S]*?```/g, '').replace(/[#>*`\-\[\]()]/g, '');
        const words = plain.replace(/\s/g, '').length;
        const min = Math.max(1, Math.round(words / 300));
        return { words, min };
    } catch (e) {
        return null;
    }
}

// ===================================================
// 分页渲染
// ===================================================
function renderPagination(container, current, total, onChange) {
    if (!container) return;
    if (total <= 1) {
        container.innerHTML = '';
        return;
    }

    const buttons = [];
    buttons.push(`<button ${current === 1 ? 'disabled' : ''} data-page="${current - 1}">‹</button>`);

    const range = 2;
    for (let i = 1; i <= total; i++) {
        if (
            i === 1 ||
            i === total ||
            (i >= current - range && i <= current + range)
        ) {
            buttons.push(`<button class="${i === current ? 'active' : ''}" data-page="${i}">${i}</button>`);
        } else if (
            i === current - range - 1 ||
            i === current + range + 1
        ) {
            buttons.push(`<span style="padding:0.5rem 0.3rem;color:var(--text-faint);">…</span>`);
        }
    }

    buttons.push(`<button ${current === total ? 'disabled' : ''} data-page="${current + 1}">›</button>`);
    container.innerHTML = buttons.join('');

    container.querySelectorAll('button[data-page]').forEach(btn => {
        btn.addEventListener('click', () => {
            const p = parseInt(btn.dataset.page, 10);
            if (p >= 1 && p <= total) onChange(p);
        });
    });
}

// ===================================================
// 标签 / 分类
// ===================================================
async function renderTagList(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
        const articles = await loadArticlesMeta();

        const tagCount = {};
        articles.forEach(a => {
            (a.tags || []).forEach(t => {
                tagCount[t] = (tagCount[t] || 0) + 1;
            });
        });

        const tags = Object.keys(tagCount).sort();

        if (tags.length === 0) {
            container.innerHTML = emptyHtml('🏷️', '还没有标签', '在文章里添加 tags 后这里会自动显示。');
            return;
        }

        container.innerHTML = tags.map(t => `
            <a href="list.html?tag=${encodeURIComponent(t)}" class="card tag-card">
                <div class="card-icon">🏷️</div>
                <h3 class="card-title">${t}</h3>
                <span class="tag-count">${tagCount[t]} 篇内容</span>
            </a>
        `).join('');

        animateCards(container);

    } catch (e) {
        container.innerHTML = errorHtml(e.message);
    }
}

async function renderCategoryList(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
        const articles = await loadArticlesMeta();

        const catCount = {};
        articles.forEach(a => {
            if (a.category) {
                catCount[a.category] = (catCount[a.category] || 0) + 1;
            }
        });

        const cats = Object.keys(catCount).sort();

        if (cats.length === 0) {
            container.innerHTML = emptyHtml('📁', '还没有分类', '在文章里添加 category 后这里会自动显示。');
            return;
        }

        container.innerHTML = cats.map(c => `
            <a href="list.html?category=${encodeURIComponent(c)}" class="card">
                <div class="card-icon">📁</div>
                <h3 class="card-title">${c}</h3>
                <p class="card-description">该分类下的所有文章。</p>
                <div class="card-meta">
                    <span class="card-tag">${catCount[c]} 篇文章</span>
                </div>
            </a>
        `).join('');

        animateCards(container);

    } catch (e) {
        container.innerHTML = errorHtml(e.message);
    }
}

// ===================================================
// 按标签 / 分类筛选
// ===================================================
async function renderFilteredList(titleId, containerId) {
    const titleEl = document.getElementById(titleId);
    const container = document.getElementById(containerId);
    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const tag = params.get('tag');
    const category = params.get('category');

    try {
        const articles = await loadArticlesMeta();

        let filtered = articles;
        let titleText = '全部文章';

        if (tag) {
            filtered = articles.filter(a => (a.tags || []).includes(tag));
            titleText = `🏷️ 标签：${tag}`;
        } else if (category) {
            filtered = articles.filter(a => a.category === category);
            titleText = `📁 分类：${category}`;
        }

        if (titleEl) titleEl.textContent = titleText;
        document.title = titleText + ' · 我的博客';

        if (filtered.length === 0) {
            container.innerHTML = emptyHtml('🔍', '没有找到文章', `该${tag ? '标签' : '分类'}下暂时没有文章。`);
            return;
        }

        container.innerHTML = filtered.map(a => cardHtml(a, '')).join('');
        animateCards(container);

    } catch (e) {
        container.innerHTML = errorHtml(e.message);
    }
}

// ===================================================
// 渲染文章详情
// ===================================================
async function renderArticleDetail(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    let id = parseInt(params.get('id'), 10);

    try {
        const articles = await loadArticlesMeta();

        if (!id || isNaN(id)) {
            if (articles.length === 0) {
                container.innerHTML = emptyHtml('📭', '还没有文章', '在 posts/index.json 里添加第一条吧。')
                    + `<a href="articles.html" class="back-link">← 返回文章列表</a>`;
                return;
            }
            id = articles[0].id;
            window.history.replaceState(null, '', window.location.pathname + '?id=' + id);
        }

        const idx = articles.findIndex(a => a.id === id);

        if (idx === -1) {
            container.innerHTML = emptyHtml('🔍', '找不到这篇文章', `id=${id} 不在文章列表里。`)
                + `<a href="articles.html" class="back-link">← 返回文章列表</a>`;
            return;
        }

        const article = articles[idx];

        const prev = idx > 0 ? articles[idx - 1] : null;
        const next = idx < articles.length - 1 ? articles[idx + 1] : null;

        document.title = article.title + ' · 我的博客';

        let mdContent = '';
        try {
            const mdRes = await fetch(`posts/${article.id}.md`);
            if (mdRes.ok) {
                mdContent = await mdRes.text();
            } else {
                mdContent = '（正文文件 `posts/' + article.id + '.md` 没找到）';
            }
        } catch (err) {
            mdContent = '（正文文件读取失败）';
        }

        const htmlContent = parseMarkdown(mdContent);

        const tagsHtml = (article.tags || [])
            .map(t => `<a href="list.html?tag=${encodeURIComponent(t)}" class="card-tag">${t}</a>`)
            .join('');

        const plainText = mdContent.replace(/```[\s\S]*?```/g, '').replace(/[#>*`\-\[\]()]/g, '');
        const wordCount = plainText.replace(/\s/g, '').length;
        const readMin = Math.max(1, Math.round(wordCount / 300));

        const pinnedBadge = article.pinned ? '<span class="pinned-badge">📌 置顶</span>' : '';

        container.innerHTML = `
            <div class="article-layout">
                <div class="article-main">
                    <article class="article-detail">
                        <h1 class="article-title">${pinnedBadge}${article.title}</h1>
                        <div class="article-meta">
                            <span>${article.date}</span>
                            <span>·</span>
                            <span>约 ${readMin} 分钟</span>
                            <span>·</span>
                            <span>${wordCount} 字</span>
                            <span>·</span>
                            <a href="list.html?category=${encodeURIComponent(article.category)}" class="card-tag">${article.category}</a>
                            ${tagsHtml}
                        </div>
                        <div class="article-content" id="articleBody">
                            ${htmlContent}
                        </div>
                        <div class="share-bar" id="shareBar"></div>
                        <div class="article-nav">
                            ${prev ? `
                                <a href="article.html?id=${prev.id}">
                                    <div class="nav-label">← 上一篇</div>
                                    <div class="nav-title">${prev.title}</div>
                                </a>
                            ` : '<span style="flex:1"></span>'}
                            ${next ? `
                                <a href="article.html?id=${next.id}" class="nav-next">
                                    <div class="nav-label">下一篇 →</div>
                                    <div class="nav-title">${next.title}</div>
                                </a>
                            ` : '<span style="flex:1"></span>'}
                        </div>
                    </article>
                </div>
                <aside class="article-aside" id="tocMount"></aside>
            </div>
        `;

        // 目录
        generateTOC(container);

        // 分享栏
        if (typeof initShareBar === 'function') {
            initShareBar('shareBar');
        }

        // 代码高亮（手动，避免空格转义）
        container.querySelectorAll('pre code').forEach(block => {
            if (!window.hljs) return;
            const raw = block.textContent;
            const langMatch = block.className.match(/language-(\w+)/);
            const lang = langMatch ? langMatch[1] : 'plaintext';

            try {
                const result = hljs.highlight(raw, { language: lang, ignoreIllegals: true });
                block.innerHTML = result.value;
            } catch (e) {
                block.textContent = raw;
            }
        });

        // 复制按钮
        container.querySelectorAll('pre').forEach(pre => {
            const btn = document.createElement('button');
            btn.className = 'copy-btn';
            btn.textContent = '复制';
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const code = pre.querySelector('code');
                const text = code ? code.innerText : pre.innerText;
                const ok = await copyText(text);
                if (ok) {
                    btn.textContent = '已复制';
                    btn.classList.add('copied');
                    setTimeout(() => {
                        btn.textContent = '复制';
                        btn.classList.remove('copied');
                    }, 1500);
                } else {
                    btn.textContent = '失败';
                    setTimeout(() => btn.textContent = '复制', 1500);
                }
            });
            pre.appendChild(btn);
        });

        // 图片灯箱
        container.querySelectorAll('.article-content img').forEach(img => {
            img.addEventListener('click', () => {
                const lb = document.getElementById('lightbox');
                const lbImg = document.getElementById('lightboxImg');
                if (lb && lbImg) {
                    lbImg.src = img.src;
                    lb.classList.add('active');
                }
            });
        });

        // LaTeX
        if (window.renderMathInElement) {
            renderMathInElement(container, {
                delimiters: [
                    { left: '$$', right: '$$', display: true },
                    { left: '$',  right: '$',  display: false },
                    { left: '\\[', right: '\\]', display: true },
                    { left: '\\(', right: '\\)', display: false }
                ],
                throwOnError: false
            });
        }

        // 新功能
        if (typeof initImmersiveMode === 'function') initImmersiveMode();
        if (typeof initReadingPosition === 'function') initReadingPosition();
        if (typeof renderRelatedArticles === 'function') renderRelatedArticles(article, container);

    } catch (e) {
        container.innerHTML = errorHtml(e.message);
    }
}

// ===================================================
// 生成目录
// ===================================================
function generateTOC(container) {
    const mount = container.querySelector('#tocMount');
    const body = container.querySelector('#articleBody');
    const titleEl = container.querySelector('.article-title');
    if (!mount || !body) return;

    const items = [];

    if (titleEl) {
        titleEl.id = 'heading-title';
        items.push({ id: 'heading-title', text: titleEl.textContent, level: 1 });
    }

    const headings = body.querySelectorAll('h2, h3');
    headings.forEach((h, i) => {
        const id = 'heading-' + i;
        h.id = id;
        items.push({
            id,
            text: h.textContent,
            level: h.tagName === 'H2' ? 2 : 3
        });
    });

    if (items.length < 1) {
        mount.innerHTML = '';
        return;
    }

    const ul = items.map(it => {
        let cls = '';
        if (it.level === 1) cls = 'toc-h1';
        if (it.level === 3) cls = 'toc-h3';
        return `<li class="${cls}"><a href="#${it.id}">${it.text}</a></li>`;
    }).join('');

    mount.innerHTML = `
        <div class="article-toc">
            <div class="article-toc-title">📑 目录</div>
            <ul>${ul}</ul>
        </div>
    `;

    mount.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', (e) => {
            e.preventDefault();
            const id = a.getAttribute('href').slice(1);
            const target = document.getElementById(id);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                history.replaceState(null, '', '#' + id);
            }
        });
    });

    const links = mount.querySelectorAll('a');
    const allHeadings = container.querySelectorAll('#heading-title, #articleBody h2, #articleBody h3');

    function updateActive() {
        let current = null;
        allHeadings.forEach((h, i) => {
            const rect = h.getBoundingClientRect();
            if (rect.top <= 120) current = links[i];
        });
        links.forEach(l => l.classList.remove('toc-active'));
        if (current) current.classList.add('toc-active');
    }

    window.addEventListener('scroll', updateActive, { passive: true });
    updateActive();
}

// ===================================================
// 项目
// ===================================================
let projectsCache = null;

async function loadProjects() {
    if (projectsCache) return projectsCache;
    const res = await fetch('projects.json');
    if (!res.ok) throw new Error('无法加载 projects.json（HTTP ' + res.status + '）');
    projectsCache = await res.json();
    return projectsCache;
}

async function renderProjectList(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
        const projects = await loadProjects();

        if (projects.length === 0) {
            container.innerHTML = emptyHtml('📦', '还没有项目', '在 projects.json 里添加第一个吧。');
            return;
        }

        container.innerHTML = projects.map(p => {
            const inner = `
                <div class="card-icon">📦</div>
                <h3 class="card-title">${p.title}</h3>
                <div class="card-meta">
                    <span>${p.date}</span>
                    ${(p.tags || []).map(t => `<span class="card-tag">${t}</span>`).join('')}
                </div>
                <p class="card-description">${p.summary}</p>
            `;
            if (p.link) {
                return `<a href="${p.link}" class="card article-card">${inner}</a>`;
            }
            return `<div class="card">${inner}</div>`;
        }).join('');

        animateCards(container);

    } catch (e) {
        container.innerHTML = errorHtml(e.message);
    }
}

// ===================================================
// 工具函数
// ===================================================
function cardHtml(a, keyword) {
    function highlight(text) {
        if (!keyword || !text) return text;
        const safe = String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        const re = new RegExp('(' + keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
        return safe.replace(re, '<mark>$1</mark>');
    }

    const pinnedBadge = a.pinned ? '<span class="pinned-badge">📌</span>' : '';

    return `
        <a href="article.html?id=${a.id}" class="card article-card">
            <h3 class="card-title">${pinnedBadge}${highlight(a.title)}</h3>
            <div class="card-meta">
                <span>${a.date}</span>
                <span class="card-tag">${highlight(a.category)}</span>
            </div>
            <p class="card-description">${highlight(a.summary)}</p>
            <div class="card-stats" data-stats-id="${a.id}"></div>
        </a>
    `;
}

function emptyHtml(icon, title, desc) {
    return `
        <div class="empty-state">
            <div class="icon">${icon}</div>
            <h3>${title}</h3>
            <p>${desc}</p>
        </div>
    `;
}

function errorHtml(msg) {
    return `
        <div class="empty-state">
            <div class="icon">⚠️</div>
            <h3>加载失败</h3>
            <p>${msg}</p>
        </div>
    `;
}

// ===================================================
// 卡片入场动画
// ===================================================
function animateCards(container) {
    if (!container) return;
    const cards = container.querySelectorAll('.card');
    if (!('IntersectionObserver' in window)) {
        cards.forEach(c => c.classList.add('visible'));
        return;
    }
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05 });

    cards.forEach((c, i) => {
        c.style.transitionDelay = (i % 20) * 0.03 + 's';
        io.observe(c);
    });
}

// ===================================================
// 回到顶部
// ===================================================
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===================================================
// 阅读进度条
// ===================================================
function initProgressBar() {
    const bar = document.getElementById('progressBar');
    if (!bar) return;

    window.addEventListener('scroll', () => {
        const h = document.documentElement;
        const scrollTop = h.scrollTop || document.body.scrollTop;
        const scrollHeight = h.scrollHeight - h.clientHeight;
        const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        bar.style.width = pct + '%';
    });
}

// ===================================================
// 主题切换
// ===================================================
function initThemeToggle() {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;

    function updateIcon() {
        const isDark = document.documentElement.classList.contains('dark');
        btn.textContent = isDark ? '☀️' : '🌙';
    }

    updateIcon();

    btn.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        const isDark = document.documentElement.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateIcon();
    });
}

// ===================================================
// 通用复制函数
// ===================================================
async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (e) {}
    }
    try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.top = '-9999px';
        textarea.style.left = '-9999px';
        textarea.setAttribute('readonly', '');
        document.body.appendChild(textarea);
        textarea.select();
        textarea.setSelectionRange(0, textarea.value.length);
        const ok = document.execCommand('copy');
        document.body.removeChild(textarea);
        return ok;
    } catch (e) {
        return false;
    }
}