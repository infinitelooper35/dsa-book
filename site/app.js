const pagesEl = document.getElementById('pages');
const contentEl = document.getElementById('content');
const manuscriptBtn = document.getElementById('loadManuscript');

async function loadText(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return res.text();
}

async function renderMarkdown(path) {
  try {
    const md = await loadText(path);
    contentEl.innerHTML = marked.parse(md);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (e) {
    contentEl.innerHTML = `<p>Could not load content: ${e.message}</p>`;
  }
}

async function init() {
  const manifest = JSON.parse(await loadText('./manifest.json'));

  manuscriptBtn.onclick = () => renderMarkdown('../MANUSCRIPT.md');

  manifest.pages.forEach((file) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#';
    a.className = 'page-link';
    a.textContent = file.replace('.md', '');
    a.onclick = (ev) => {
      ev.preventDefault();
      renderMarkdown(`../pages/${file}`);
    };
    li.appendChild(a);
    pagesEl.appendChild(li);
  });

  renderMarkdown('../MANUSCRIPT.md');
}

init();
