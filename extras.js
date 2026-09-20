// ===================================================
// 归档页
// ===================================================
async function renderArchive(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    try {
        const articles = await loadArticlesMeta();

        if (articles.length === 0) {
            container.innerHTML = emptyHtml('📭', '还没有文章', '在 posts/index.json 里添加第一条吧。');
            return;
        }

        const groups = {};
        articles.forEach(a => {
            const date = a.date || '';
            const year = date.slice(0, 4) || '未知';
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

                html += `<div class="archive-month">${year}年${month}月 · ${list.length} 篇</div>`;
                html += `<ul class="archive-list">`;
                list.forEach(a => {
                    const day = (a.date || '').slice(8, 10) || '--';
                    html += `
                        <li class="archive-item">
                            <span class="archive-date">${day}日</span>
                            <a href="article.html?id=${a.id}" class="archive-link">${a.title}</a>
                            <span class="archive-tag">${a.category || ''}</span>
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

        container.innerHTML = sorted.map((a, i) => `
            <li>
                <span class="num ${i < 3 ? 'top' : ''}">${i + 1}</span>
                <a href="article.html?id=${a.id}">${a.title}</a>
            </li>
        `).join('');

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
            container.innerHTML = `<li style="color:var(--text-faint);font-size:0.85rem;">还没有置顶文章</li>`;
            return;
        }

        container.innerHTML = pinned.map(a => `
            <li>
                <a href="article.html?id=${a.id}">📌 ${a.title}</a>
            </li>
        `).join('');

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

    container.innerHTML = `
        <button class="share-btn" id="shareCopy">🔗 复制链接</button>
        <a class="share-btn" href="https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}" target="_blank" rel="noopener">📤 分享到微博</a>
        <a class="share-btn" href="https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}" target="_blank" rel="noopener">🐦 分享到 Twitter</a>
        <a class="share-btn" href="mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}">✉️ 邮件分享</a>
    `;

    const copyBtn = container.querySelector('#shareCopy');
    copyBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(url);
            copyBtn.textContent = '✅ 已复制';
            copyBtn.classList.add('copied');
            setTimeout(() => {
                copyBtn.textContent = '🔗 复制链接';
                copyBtn.classList.remove('copied');
            }, 1500);
        } catch (e) {
            copyBtn.textContent = '❌ 失败';
            setTimeout(() => copyBtn.textContent = '🔗 复制链接', 1500);
        }
    });
}