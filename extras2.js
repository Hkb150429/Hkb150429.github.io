// ===================================================
// 主题色切换
// ===================================================
const THEME_COLORS = {
    blue:   { accent: '#0284c7', soft: '#e0f2fe' },
    green:  { accent: '#16a34a', soft: '#dcfce7' },
    purple: { accent: '#9333ea', soft: '#f3e8ff' },
    orange: { accent: '#ea580c', soft: '#ffedd5' },
    pink:   { accent: '#db2777', soft: '#fce7f3' }
};

function initThemeColorPicker() {
    const nav = document.querySelector('.nav-tabs');
    if (!nav) return;

    const saved = localStorage.getItem('themeColor') || 'blue';
    applyThemeColor(saved);

    // 已有手写的 .theme-color-picker 就用它，否则自动生成
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
            </div>
        `;
        nav.appendChild(picker);
    } else {
        // 已有手写结构：按 localStorage 重置 active
        picker.querySelectorAll('.theme-color-dot').forEach(dot => {
            dot.classList.toggle('active', dot.dataset.color === saved);
        });
    }

    const btn = picker.querySelector('.theme-color-btn');
    const menu = picker.querySelector('.theme-color-menu');

    if (!btn || !menu) return;

    // 先移除旧的监听（避免重复绑定）
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);

    newBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.classList.toggle('show');
    });

    // 点其他地方关闭菜单
    if (!window.__themeMenuCloseBound) {
        document.addEventListener('click', () => {
            document.querySelectorAll('.theme-color-menu').forEach(m => m.classList.remove('show'));
        });
        window.__themeMenuCloseBound = true;
    }

    // 颜色点点击
    menu.querySelectorAll('.theme-color-dot').forEach(dot => {
        dot.addEventListener('click', (e) => {
            e.stopPropagation();
            const color = dot.dataset.color;
            applyThemeColor(color);
            localStorage.setItem('themeColor', color);
            menu.querySelectorAll('.theme-color-dot').forEach(d => d.classList.remove('active'));
            dot.classList.add('active');
            menu.classList.remove('show');
        });
    });
}

function applyThemeColor(name) {
    const c = THEME_COLORS[name] || THEME_COLORS.blue;
    document.documentElement.style.setProperty('--accent', c.accent);
    document.documentElement.style.setProperty('--accent-soft', c.soft);
}

// ===================================================
// 沉浸阅读模式
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
        document.body.classList.toggle('immersive');
        btn.textContent = document.body.classList.contains('immersive') ? '✖' : '📖';
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.body.classList.contains('immersive')) {
            document.body.classList.remove('immersive');
            btn.textContent = '📖';
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

        const div = document.createElement('div');
        div.className = 'related-articles';
        div.innerHTML = `
            <div class="related-title">🎲 相关文章</div>
            <ul class="related-list">
                ${related.map(a => `<li><a href="article.html?id=${a.id}">${a.title}</a></li>`).join('')}
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
        const tagCount = {};
        articles.forEach(a => (a.tags || []).forEach(t => { tagCount[t] = (tagCount[t] || 0) + 1; }));

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
// 彩蛋：Ctrl + Shift + B
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

// 暴露
window.initThemeColorPicker = initThemeColorPicker;
window.initImmersiveMode = initImmersiveMode;
window.initReadingPosition = initReadingPosition;
window.renderRelatedArticles = renderRelatedArticles;
window.renderTagCloud = renderTagCloud;
window.initEasterEgg = initEasterEgg;