// ===================================================
// 翻译辅助
// ===================================================
function t(key) {
    const lang = localStorage.getItem('lang') || 'zh';
    const dict = (window.I18N && window.I18N[lang]) ? window.I18N[lang] : {};
    return dict[key] || key;
}

// ===================================================
// 归档页
// ===================================================
async function renderArchive(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
        const articles = await loadArticlesMeta();
        const isEn = (localStorage.getItem('lang') || 'zh') === 'en';

        if (articles.length === 0) {
            container.innerHTML = emptyHtml('📭', isEn ? 'No posts yet' : '还没有文章', '');
            return;
        }

        const groups = {};
        articles.forEach(a => {
            const date = a.date || '';
            const year = date.slice(0, 4) || (isEn ? 'Unknown' : '未知');
            const month = date.slice(5, 7) || '00';
            if (!groups[year]) groups[year] = {};
            if (!groups[year][month]) groups[year][month] = [];
            groups[year][month].push(a);
        });

        const years = Object.keys(groups).sort().reverse();

        let html = '';
        years.forEach(year => {
            html += `<div class="archive-group">`;
            html += `<div class="archive-year">${year}</div>`;

            const months = Object.keys(groups[year]).sort().reverse();
            months.forEach(month => {
                const list = groups[year][month]
                    .sort((a, b) => (b.date || '').localeCompare(a.date || ''));

                const monthLabel = isEn ? `${year}-${month}` : `${year}年${month}月`;
                const unitLabel = isEn ? 'posts' : '篇';
                html += `<div class="archive-month">${monthLabel} · ${list.length} ${unitLabel}</div>`;
                html += `<ul class="archive-list">`;
                list.forEach(a => {
                    const day = (a.date || '').slice(8, 10) || '--';
                    const dayLabel = isEn ? day : day + '日';
                    const title = isEn ? (a.titleEn || a.title) : a.title;
                    const category = isEn ? (a.categoryEn || a.category) : a.category;
                    html += `
                        <li class="archive-item">
                            <span class="archive-date">${dayLabel}</span>
                            <a href="article.html?id=${a.id}" class="archive-link">${title}</a>
                            <span class="archive-tag">${category || ''}</span>
                        </li>
                    `;
                });
                html += `</ul>`;
            });

            html += `</div>`;
        });

        container.innerHTML = html;

    } catch (e) {
        container.innerHTML = errorHtml(e.message);
    }
}

// ===================================================
// 热门文章
// ===================================================
async function renderHotArticles(containerId, limit = 5) {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
        const articles = await loadArticlesMeta();
        if (articles.length === 0) return;

        const sorted = articles.slice().sort((a, b) => {
            const aScore = (a.views || 0) * 100 + (a.tags || []).length * 10;
            const bScore = (b.views || 0) * 100 + (b.tags || []).length * 10;
            return bScore - aScore;
        }).slice(0, limit);

        const lang = localStorage.getItem('lang') || 'zh';
        const isEn = lang === 'en';

        container.innerHTML = sorted.map((a, i) => {
            const title = (isEn && a.titleEn) ? a.titleEn : a.title;
            return `
                <li>
                    <span class="num ${i < 3 ? 'top' : ''}">${i + 1}</span>
                    <a href="article.html?id=${a.id}">${title}</a>
                </li>
            `;
        }).join('');

    } catch (e) {
        container.innerHTML = `<li style="color:var(--text-faint);font-size:0.85rem;">加载失败</li>`;
    }
}

// ===================================================
// 置顶文章
// ===================================================
async function renderPinnedArticles(containerId, limit = 5) {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
        const articles = await loadArticlesMeta();
        const pinned = articles.filter(a => a.pinned === true).slice(0, limit);

        if (pinned.length === 0) {
            container.innerHTML = `<li style="color:var(--text-faint);font-size:0.85rem;">${(localStorage.getItem('lang') || 'zh') === 'en' ? 'No pinned posts' : '还没有置顶文章'}</li>`;
            return;
        }

        const lang = localStorage.getItem('lang') || 'zh';
        const isEn = lang === 'en';

        container.innerHTML = pinned.map(a => {
            const title = (isEn && a.titleEn) ? a.titleEn : a.title;
            return `<li><a href="article.html?id=${a.id}">📌 ${title}</a></li>`;
        }).join('');

    } catch (e) {
        container.innerHTML = `<li style="color:var(--text-faint);font-size:0.85rem;">加载失败</li>`;
    }
}

// ===================================================
// 随机一篇文章
// ===================================================
async function goRandomArticle() {
    try {
        const articles = await loadArticlesMeta();
        if (articles.length === 0) {
            alert('还没有文章');
            return;
        }
        const random = articles[Math.floor(Math.random() * articles.length)];
        window.location.href = 'article.html?id=' + random.id;
    } catch (e) {
        alert('加载失败：' + e.message);
    }
}

// ===================================================
// 分享按钮
// ===================================================
function initShareBar(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const url = window.location.href;
    const title = document.title;
    const lang = localStorage.getItem('lang') || 'zh';
    const isEn = lang === 'en';

    const labels = isEn ? {
        copy: '🔗 Copy Link', weibo: '📤 Weibo', twitter: '🐦 Twitter', email: '✉️ Email'
    } : {
        copy: '🔗 复制链接', weibo: '📤 分享到微博', twitter: '🐦 分享到 Twitter', email: '✉️ 邮件分享'
    };

    container.innerHTML = `
        <button class="share-btn" id="shareCopy">${labels.copy}</button>
        <a class="share-btn" href="https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}" target="_blank" rel="noopener">${labels.weibo}</a>
        <a class="share-btn" href="https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}" target="_blank" rel="noopener">${labels.twitter}</a>
        <a class="share-btn" href="mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}">${labels.email}</a>
    `;

    const copyBtn = container.querySelector('#shareCopy');
    copyBtn.addEventListener('click', async () => {
        const ok = await copyText(url);
        if (ok) {
            copyBtn.textContent = isEn ? '✅ Copied' : '✅ 已复制';
            copyBtn.classList.add('copied');
            setTimeout(() => {
                copyBtn.textContent = labels.copy;
                copyBtn.classList.remove('copied');
            }, 1500);
        } else {
            copyBtn.textContent = isEn ? '❌ Failed' : '❌ 失败';
            setTimeout(() => copyBtn.textContent = labels.copy, 1500);
        }
    });
}