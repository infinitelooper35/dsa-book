const els = {
  content: document.getElementById('content'),
  pageList: document.getElementById('pageList'),
  search: document.getElementById('searchInput'),
  stats: document.getElementById('stats'),
  sortToggle: document.getElementById('sortToggle'),
  manuscriptBtn: document.getElementById('viewManuscript'),
  readLatestBtn: document.getElementById('readLatest'),
  prevPageBtn: document.getElementById('prevPage'),
  nextPageBtn: document.getElementById('nextPage'),
  currentMeta: document.getElementById('currentMeta'),
  toc: document.getElementById('toc'),
  progress: document.getElementById('topProgress'),
  themeToggle: document.getElementById('themeToggle'),
  fontPlus: document.getElementById('fontPlus'),
  fontMinus: document.getElementById('fontMinus'),
};

const state = {
  pages: [],
  visible: [],
  activeIndex: -1,
  sortNewest: true,
  fontSize: Number(localStorage.getItem('dsa_font') || 18),
  theme: localStorage.getItem('dsa_theme') || 'dark',
  mode: 'manuscript',
};

function setTheme(theme) {
  state.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('dsa_theme', theme);
  els.themeToggle.textContent = theme === 'dark' ? '🌙 Theme' : '☀️ Theme';
}

function setFontSize(size) {
  state.fontSize = Math.max(15, Math.min(23, size));
  document.documentElement.style.setProperty('--content-size', `${state.fontSize}px`);
  localStorage.setItem('dsa_font', String(state.fontSize));
}

async function loadText(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return res.text();
}

function estimateReadMinutes(text) {
  const words = (text.match(/\S+/g) || []).length;
  return Math.max(1, Math.round(words / 220));
}

function getTeaser(md) {
  const withoutHeadings = md
    .replace(/^#.*$/gm, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`/g, '')
    .trim();
  return withoutHeadings.slice(0, 130) + (withoutHeadings.length > 130 ? '…' : '');
}

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function addHeadingIds(root) {
  root.querySelectorAll('h1, h2, h3').forEach((h) => {
    if (!h.id) h.id = slugify(h.textContent || 'section');
  });
}

function buildToc(root) {
  const headers = [...root.querySelectorAll('h1, h2, h3')];
  if (!headers.length) {
    els.toc.innerHTML = '<p class="muted">No headings found.</p>';
    return;
  }
  els.toc.innerHTML = '';
  headers.forEach((h) => {
    const a = document.createElement('a');
    a.href = `#${h.id}`;
    a.textContent = h.textContent || 'Section';
    a.style.marginLeft = h.tagName === 'H3' ? '14px' : h.tagName === 'H2' ? '7px' : '0';
    els.toc.appendChild(a);
  });
}

function updateProgressBar() {
  const scrollTop = window.scrollY;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const pct = height > 0 ? (scrollTop / height) * 100 : 0;
  els.progress.style.width = `${Math.min(100, Math.max(0, pct))}%`;
}

async function renderMarkdown(path, smooth = true) {
  try {
    const md = await loadText(path);
    els.content.innerHTML = marked.parse(md);
    addHeadingIds(els.content);
    buildToc(els.content);
    if (smooth) window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (e) {
    els.content.innerHTML = `<p>Could not load content: ${e.message}</p>`;
    els.toc.innerHTML = '<p class="muted">Unable to build TOC.</p>';
  }
}

function renderStats() {
  const count = state.pages.length;
  const totalRead = state.pages.reduce((a, p) => a + p.readMin, 0);
  const latest = [...state.pages].sort((a, b) => (a.file < b.file ? 1 : -1))[0]?.date || '—';
  els.stats.innerHTML = `
    <div class="stat"><div class="k">Pages</div><div class="v">${count}</div></div>
    <div class="stat"><div class="k">Read time</div><div class="v">${totalRead}m</div></div>
    <div class="stat"><div class="k">Latest</div><div class="v">${latest}</div></div>
    <div class="stat"><div class="k">Mode</div><div class="v">Daily</div></div>
  `;
}

function setActiveByVisibleIndex(i) {
  state.activeIndex = i;
  [...els.pageList.querySelectorAll('.page-item')].forEach((n, idx) => {
    n.classList.toggle('active', idx === i);
  });
}

function updateCurrentMeta() {
  if (state.mode === 'manuscript' || state.activeIndex < 0 || !state.visible[state.activeIndex]) {
    els.currentMeta.textContent = 'Full Manuscript';
    return;
  }
  const p = state.visible[state.activeIndex];
  els.currentMeta.textContent = `${p.title} • ${p.readMin} min`;
}

function openVisibleIndex(i) {
  if (i < 0 || i >= state.visible.length) return;
  const page = state.visible[i];
  state.mode = 'page';
  setActiveByVisibleIndex(i);
  updateCurrentMeta();
  renderMarkdown(`./pages/${page.file}`);
}

function openManuscript() {
  state.mode = 'manuscript';
  setActiveByVisibleIndex(-1);
  updateCurrentMeta();
  renderMarkdown('./MANUSCRIPT.md');
}

function openLatestPage() {
  if (!state.visible.length) return;
  openVisibleIndex(0);
}

function renderPageList() {
  const q = els.search.value.trim().toLowerCase();
  let pages = [...state.pages];
  if (state.sortNewest) pages.sort((a, b) => (a.file < b.file ? 1 : -1));
  else pages.sort((a, b) => (a.file > b.file ? 1 : -1));

  if (q) {
    pages = pages.filter((p) =>
      p.title.toLowerCase().includes(q) || p.file.toLowerCase().includes(q)
    );
  }

  state.visible = pages;
  els.pageList.innerHTML = '';

  pages.forEach((p, idx) => {
    const li = document.createElement('li');
    li.className = 'page-item';
    li.innerHTML = `
      <div class="page-title">${p.title}</div>
      <div class="page-meta">${p.date} • ${p.readMin} min read</div>
      <div class="page-teaser">${p.teaser}</div>
    `;
    li.onclick = () => openVisibleIndex(idx);
    els.pageList.appendChild(li);
  });

  if (!pages.length) {
    const li = document.createElement('li');
    li.className = 'page-item';
    li.textContent = 'No pages match your search.';
    els.pageList.appendChild(li);
  }

  state.activeIndex = -1;
  updateCurrentMeta();
}

function wireEvents() {
  els.search.addEventListener('input', renderPageList);
  els.sortToggle.addEventListener('click', () => {
    state.sortNewest = !state.sortNewest;
    els.sortToggle.textContent = state.sortNewest ? 'Newest first' : 'Oldest first';
    renderPageList();
  });

  els.manuscriptBtn.addEventListener('click', openManuscript);
  els.readLatestBtn.addEventListener('click', openLatestPage);
  els.prevPageBtn.addEventListener('click', () => openVisibleIndex(Math.max(0, state.activeIndex - 1)));
  els.nextPageBtn.addEventListener('click', () => openVisibleIndex(Math.min(state.visible.length - 1, state.activeIndex + 1)));

  els.themeToggle.addEventListener('click', () => setTheme(state.theme === 'dark' ? 'light' : 'dark'));
  els.fontPlus.addEventListener('click', () => setFontSize(state.fontSize + 1));
  els.fontMinus.addEventListener('click', () => setFontSize(state.fontSize - 1));

  window.addEventListener('scroll', updateProgressBar, { passive: true });
  updateProgressBar();

  window.addEventListener('keydown', (e) => {
    if (e.key === '/') {
      e.preventDefault();
      els.search.focus();
      return;
    }
    if (e.key.toLowerCase() === 'm') {
      openManuscript();
      return;
    }
    if (e.key.toLowerCase() === 't') {
      els.themeToggle.click();
      return;
    }
    if (!state.visible.length) return;
    if (e.key.toLowerCase() === 'j' || e.key.toLowerCase() === 'n') {
      const next = Math.min(state.visible.length - 1, (state.activeIndex < 0 ? 0 : state.activeIndex + 1));
      openVisibleIndex(next);
    }
    if (e.key.toLowerCase() === 'k' || e.key.toLowerCase() === 'p') {
      const prev = Math.max(0, (state.activeIndex <= 0 ? 0 : state.activeIndex - 1));
      openVisibleIndex(prev);
    }
  });
}

async function hydratePages() {
  const manifest = JSON.parse(await loadText('./manifest.json'));
  const fileList = manifest.pages || [];

  const loaded = await Promise.all(
    fileList.map(async (file) => {
      const md = await loadText(`./pages/${file}`);
      const firstHeading = (md.match(/^#\s+(.+)$/m) || [null, file.replace('.md', '')])[1];
      return {
        file,
        date: file.replace('.md', ''),
        title: firstHeading,
        readMin: estimateReadMinutes(md),
        teaser: getTeaser(md),
      };
    })
  );

  state.pages = loaded;
}

async function init() {
  setTheme(state.theme);
  setFontSize(state.fontSize);
  wireEvents();
  await hydratePages();
  renderStats();
  renderPageList();
  openLatestPage();
}

init();
