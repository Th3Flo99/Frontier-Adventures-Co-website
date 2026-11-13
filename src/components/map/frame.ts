// Framing maths for the expedition chart, shared by the build (ExpeditionMap.astro frontmatter)
// and the browser (the component script). No dependencies, so it costs the visitor a few
// hundred bytes. All boxes are in chart units (the SVG user space, 1000 units wide).

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Room, in screen pixels, kept clear around a framed box for pins, tags and their lettering. */
export interface Pads {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export const round = (n: number, digits = 2) => {
  const f = 10 ** digits;
  return Math.round(n * f) / f;
};

/**
 * The viewBox that shows `box` inside a viewport of `cw` x `ch` pixels, leaving `pads` pixels
 * free around it, never zooming in further than `minW` chart units across, and never leaving
 * the drawn chart (`bounds`). The result always has the viewport's aspect ratio.
 */
export function fitFrame(box: Box, cw: number, ch: number, bounds: Box, pads: Pads, minW = 0): Box {
  const innerW = Math.max(cw - pads.left - pads.right, cw * 0.3);
  const innerH = Math.max(ch - pads.top - pads.bottom, ch * 0.3);
  // Pixels per chart unit
  let s = Math.min(innerW / Math.max(box.w, 0.001), innerH / Math.max(box.h, 0.001));
  if (minW > 0) s = Math.min(s, cw / minW);
  // Never show anything beyond the drawn chart
  s = Math.max(s, cw / bounds.w, ch / bounds.h);

  const w = cw / s;
  const h = ch / s;
  // Centre the box in the space left between the pads
  let x = box.x + box.w / 2 - (pads.left + innerW / 2) / s;
  let y = box.y + box.h / 2 - (pads.top + innerH / 2) / s;
  x = Math.min(Math.max(x, bounds.x), bounds.x + bounds.w - w);
  y = Math.min(Math.max(y, bounds.y), bounds.y + bounds.h - h);
  return { x: round(x), y: round(y), w: round(w), h: round(h) };
}

export const toViewBox = (b: Box) => `${round(b.x)} ${round(b.y)} ${round(b.w)} ${round(b.h)}`;

export const parseBox = (value: string | null | undefined): Box | null => {
  const n = (value ?? '').trim().split(/[\s,]+/).map(Number);
  return n.length === 4 && n.every(Number.isFinite) ? { x: n[0], y: n[1], w: n[2], h: n[3] } : null;
};
