// One place for the deploy base path (GitHub Pages serves the site from a sub-folder).
const rawBase = import.meta.env.BASE_URL || '/';
export const base = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;

/**
 * Build an internal URL from a site-relative path.
 * Pages are served as directories, so page links end in a slash, the same form the canonical
 * URLs and the sitemap use (GitHub Pages would otherwise answer with a redirect):
 *   href('about') -> '/base/about/'      href('adventures#cruises') -> '/base/adventures/#cruises'
 * Paths to files keep their name: href('photos/a.jpg') -> '/base/photos/a.jpg'
 */
export const href = (path = '') => {
  const [page, hash] = path.replace(/^\/+/, '').split('#');
  const isFile = /\.[a-z0-9]+$/i.test(page);
  const dir = page && !isFile && !page.endsWith('/') ? `${page}/` : page;
  return `${base}${dir}${hash ? `#${hash}` : ''}`;
};

export const stripSlash = (p: string) => p.replace(/\/+$/, '');
