// One place for the deploy base path (GitHub Pages serves the site from a sub-folder).
const rawBase = import.meta.env.BASE_URL || '/';
export const base = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;

/** Build an internal URL from a site-relative path: href('about') -> '/base/about' */
export const href = (path = '') => `${base}${path.replace(/^\/+/, '')}`;

export const stripSlash = (p: string) => p.replace(/\/+$/, '');
