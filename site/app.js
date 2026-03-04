const els = {
  coverView: document.getElementById('coverView'),
  bookView: document.getElementById('bookView'),
  library: document.getElementById('libraryPanel'),
  content: document.getElementById('content'),
  pageList: document.getElementById('pageList'),
  search: document.getElementById('searchInput'),
  pageMeta: document.getElementById('pageMeta'),
  pageNumber: document.getElementById('pageNumber'),
  coverStats: document.getElementById('coverStats'),
  homeBtn: document.getElementById('homeBtn'),
  libraryBtn: document.getElementById('libraryBtn'),
  themeBtn: document.getElementById('themeBtn'),
  startLatestBtn: document.getElementById('startLatestBtn'),
  startManuscriptBtn: document.getElementById('startManuscriptBtn'),
  prevBtn: document.getElementById('prevBtn'),
  nextBtn: document.getElementById('nextBtn'),
  manuscriptBtn: document.getElementById('manuscriptBtn'),
};

const state = {
  pages: [],
  filtered: [],
  currentIndex: -1,
  mode: 'cover', // cover | page | manuscript
  theme: localStorage.getItem('book_theme') || 'dark',
  libraryOpen: localStorage.getItem('book_library_open') !== '0',
};

function setTheme(theme) {
  state.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('book_theme', theme);
  els.themeBtn.textContent = theme === 'dark' ? '🌙 Theme' : '☀️ Theme';
}

function setLibraryOpen(open) {
  state.libraryOpen = open;
  els.library.classList.toggle('hidden', !open);
  localStorage.setItem('book_library_open', open ? '1' : '0');
}

async function loadText(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return res.text();
}

function words(text) { return (text.match(/\S+/g) || []).length; }
function readMin(text) { return Math.max(1, Math.round(words(text) / 230)); }
function extractTitle(md, fallback) {
  return (md.match(/^#\s+(.+)$/m) || [null, fallback])[1];
}

function renderCoverStats() {
  const total = state.pages.length;
  const mins = state.pages.reduce((a, p) => a + p.read, 0);
  const latest = state.pages[state.pages.length - 1]?.date || '—';
  els.coverStats.innerHTML = `
    <div class="cover-stat"><div class="k">Pages</div><div class="v">${total}</div></div>
    <div class="cover-stat"><div class="k">Read Time</div><div class="v">${mins}m</div></div>
    <div class="cover-stat"><div class="k">Latest</div><div class="v">${latest}</div></div>
  `;
}

function showCover() {
  state.mode = 'cover';
  els.coverView.classList.remove('hidden');
  els.bookView.classList.add('hidden');
}

function showBook() {
  els.coverView.classList.add('hidden');
  els.bookView.classList.remove('hidden');
}

function setLoading(message = 'Loading page…') {
  els.content.innerHTML = `<p>${message}</p>`;
}

function updateButtons() {
  const atStart = state.currentIndex <= 0;
  const atEnd = state.currentIndex >= state.filtered.length - 1;
  els.prevBtn.disabled = state.mode !== 'page' || atStart;
  els.nextBtn.disabled = state.mode !== 'page' || atEnd;
}

function updateMeta() {
  if (state.mode === 'manuscript') {
    els.pageMeta.textContent = 'Full Manuscript';
    els.pageNumber.textContent = 'Manuscript';
    updateButtons();
    return;
  }
  const p = state.filtered[state.currentIndex];
  if (!p) {
    els.pageMeta.textContent = 'No page selected';
    els.pageNumber.textContent = '—';
    updateButtons();
    return;
  }
  els.pageMeta.textContent = `${p.title} • ${p.read} min read`;
  els.pageNumber.textContent = `Page ${state.currentIndex + 1} / ${state.filtered.length}`;
  updateButtons();
}

function animateFlip() {
  els.content.classList.remove('flipping');
  void els.content.offsetWidth;
  els.content.classList.add('flipping');
}

async function renderMarkdown(md) {
  els.content.innerHTML = marked.parse(md);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function openManuscript() {
  showBook();
  state.mode = 'manuscript';
  setLoading('Loading manuscript…');
  const md = await loadText('./MANUSCRIPT.md');
  animateFlip();
  await renderMarkdown(md);
  updateMeta();
  [...els.pageList.querySelectorAll('li')].forEach(li => li.classList.remove('active'));
}

async function openPage(index) {
  if (index < 0 || index >= state.filtered.length) return;
  showBook();
  state.mode = 'page';
  state.currentIndex = index;
  const p = state.filtered[index];
  setLoading('Loading chapter…');
  animateFlip();
  await renderMarkdown(p.md);
  updateMeta();
  [...els.pageList.querySelectorAll('li')].forEach((li, i) => li.classList.toggle('active', i === index));

  // mobile usability: auto-close library after selection
  if (window.innerWidth < 980) setLibraryOpen(false);
}

function renderPageList() {
  const q = els.search.value.trim().toLowerCase();
  state.filtered = state.pages.filter(p => p.title.toLowerCase().includes(q) || p.date.includes(q));
  els.pageList.innerHTML = '';

  if (!state.filtered.length) {
    const li = document.createElement('li');
    li.innerHTML = `<div class="page-title">No matching pages</div><div class="page-meta">Try another keyword/date.</div>`;
    li.style.opacity = '.8';
    els.pageList.appendChild(li);
    return;
  }

  state.filtered.forEach((p, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<div class="page-title">${p.title}</div><div class="page-meta">${p.date} • ${p.read} min</div>`;
    li.onclick = () => openPage(i);
    els.pageList.appendChild(li);
  });
}

async function hydratePages() {
  const manifest = JSON.parse(await loadText('./manifest.json'));
  const files = (manifest.pages || []).sort(); // oldest first (book order)
  const data = [];
  for (const file of files) {
    const md = await loadText(`./pages/${file}`);
    data.push({
      file,
      date: file.replace('.md', ''),
      title: extractTitle(md, file.replace('.md', '')),
      read: readMin(md),
      md,
    });
  }
  state.pages = data;
}

function wireEvents() {
  els.homeBtn.onclick = showCover;
  els.libraryBtn.onclick = () => setLibraryOpen(!state.libraryOpen);
  els.themeBtn.onclick = () => setTheme(state.theme === 'dark' ? 'light' : 'dark');
  els.startLatestBtn.onclick = () => openPage(0);
  els.startManuscriptBtn.onclick = () => openManuscript();
  els.prevBtn.onclick = () => openPage(Math.max(0, state.currentIndex - 1));
  els.nextBtn.onclick = () => openPage(Math.min(state.filtered.length - 1, state.currentIndex + 1));
  els.manuscriptBtn.onclick = () => openManuscript();
  els.search.oninput = renderPageList;

  window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'c') {
      showCover();
      return;
    }
    if (state.mode === 'cover') return;
    if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'j') openPage(Math.min(state.filtered.length - 1, state.currentIndex + 1));
    if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'k') openPage(Math.max(0, state.currentIndex - 1));
    if (e.key.toLowerCase() === 'm') openManuscript();
    if (e.key === '/') {
      e.preventDefault();
      setLibraryOpen(true);
      els.search.focus();
    }
  });
}

async function init() {
  setTheme(state.theme);
  wireEvents();
  setLibraryOpen(state.libraryOpen);
  await hydratePages();
  renderCoverStats();
  renderPageList();
  updateMeta();
  showCover();
}

init();
