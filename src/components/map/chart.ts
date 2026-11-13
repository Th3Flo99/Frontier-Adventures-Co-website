// Build-time cartography for the expedition chart.
// Runs only in the Astro frontmatter: d3-geo, topojson-client and world-atlas never reach the
// browser. What comes out is a handful of compact SVG path strings and a projection function.
//
// The chart is drawn on Mercator's projection, the projection of nautical charts: meridians
// and parallels are straight, so the graticule costs almost nothing and a great-circle course
// shows as the familiar arc bowing towards the pole.
// @ts-ignore: no type declarations installed for these build-only packages
import { geoMercator, geoPath, geoInterpolate } from 'd3-geo';
// @ts-ignore
import { feature, mesh } from 'topojson-client';
import type { Box } from './frame';

/** Chart width in SVG user units. Everything else follows from it. */
export const W = 1000;
/** Central meridian. Puts the seam at 169°W, in the Bering Strait, so no continent is cut. */
const LON0 = 11;
/** Latitudes drawn (the sheet, close to 5:4 so a phone can show the full width), and latitudes
 * shown when the whole chart is framed on a wide screen. */
const SHEET = { north: 85, south: -73 };
const WORLD = { north: 80.5, south: -58 };

const RAD = Math.PI / 180;
const SCALE = W / (2 * Math.PI);
const merc = (lat: number) => Math.log(Math.tan(Math.PI / 4 + (lat * RAD) / 2));
const r1 = (n: number) => Math.round(n * 10) / 10;

export const lonToX = (lon: number) => {
  const d = ((((lon - LON0 + 180) % 360) + 360) % 360) - 180;
  return W / 2 + (d / 360) * W;
};
export const latToY = (lat: number) => (merc(SHEET.north) - merc(lat)) * SCALE;
export const project = (lon: number, lat: number): [number, number] => [r1(lonToX(lon)), r1(latToY(lat))];

/** Height of the drawn sheet, and the box that holds it. */
export const H = r1(latToY(SHEET.south));
export const sheetBox: Box = { x: 0, y: 0, w: W, h: H };
/** The whole-chart view on wide screens: the full width, trimmed of the emptiest polar water. */
export const worldBox: Box = (() => {
  const y = r1(latToY(WORLD.north));
  return { x: 0, y, w: W, h: r1(latToY(WORLD.south) - y) };
})();

type Pt = [number, number];

// Coastlines are drawn at three grades. The chart zooms furthest into western Europe, so that
// is drawn finest; the North Atlantic comes next; the rest of the world, which is only ever seen
// whole, is kept coarse. This is what keeps the page light.
const zone = (west: number, north: number, east: number, south: number) => {
  const [x0, y0, x1, y1] = [lonToX(west), latToY(north), lonToX(east), latToY(south)];
  return (p: Pt) => p[0] >= x0 && p[0] <= x1 && p[1] >= y0 && p[1] <= y1;
};
const inEurope = zone(-16, 62, 24, 36);
const inAtlantic = zone(-102, 68, 46, 6);
const inBorders = zone(-26, 66, 34, 34);
const grade = (p: Pt) => (inEurope(p) ? 0 : inAtlantic(p) ? 1 : 2);
/** Simplification tolerance and smallest island kept, per grade, in chart units. */
const TOL = [0.09, 0.25, 0.8];
const MIN_AREA = [0.1, 0.6, 3];
// Mercator stretches the far north and south, and every fjord with it. Outside the zoomed
// waters the tolerance grows by the same stretch, so Greenland does not outweigh Europe.
const stretch = (p: Pt) => Math.min(Math.cosh(merc(SHEET.north) - p[1] / SCALE), 3.2);
const tolerance = (p: Pt) => {
  const g = grade(p);
  return g === 2 ? TOL[2] * stretch(p) : TOL[g];
};
const minArea = (p: Pt) => {
  const g = grade(p);
  return g === 2 ? MIN_AREA[2] * stretch(p) ** 2 : MIN_AREA[g];
};

/** Ramer-Douglas-Peucker with a tolerance that depends on where the point lies. */
function simplify(points: Pt[]): Pt[] {
  const n = points.length;
  if (n < 3) return points;
  const keep = new Uint8Array(n);
  keep[0] = keep[n - 1] = 1;
  const stack: [number, number][] = [[0, n - 1]];
  while (stack.length) {
    const [a, b] = stack.pop()!;
    if (b - a < 2) continue;
    const [ax, ay] = points[a];
    const [bx, by] = points[b];
    const dx = bx - ax;
    const dy = by - ay;
    const len = Math.hypot(dx, dy) || 1e-9;
    let worst = 0;
    let index = -1;
    for (let i = a + 1; i < b; i++) {
      const p = points[i];
      const dist = Math.abs((p[0] - ax) * dy - (p[1] - ay) * dx) / len;
      const ratio = dist / tolerance(p);
      if (ratio > worst) {
        worst = ratio;
        index = i;
      }
    }
    if (worst > 1) {
      keep[index] = 1;
      stack.push([a, index], [index, b]);
    }
  }
  return points.filter((_, i) => keep[i]);
}

const ringArea = (ring: Pt[]) => {
  let a = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) a += ring[j][0] * ring[i][1] - ring[i][0] * ring[j][1];
  return Math.abs(a) / 2;
};

/** Shortest decimal for a tenth-of-a-unit number: 0.5 -> .5, -0.5 -> -.5 */
const num = (n: number) => {
  const s = String(r1(n));
  return s.startsWith('0.') ? s.slice(1) : s.startsWith('-0.') ? `-${s.slice(2)}` : s;
};
const join = (values: number[]) => {
  let out = '';
  for (const v of values) {
    const s = num(v);
    out += out && !s.startsWith('-') ? ` ${s}` : s;
  }
  return out;
};

/** One polyline as a compact path: absolute start, then relative steps between rounded points. */
function toPath(points: Pt[], closed: boolean): string {
  const pts = points.map(([x, y]) => [r1(x), r1(y)] as Pt);
  const deltas: number[] = [];
  let [px, py] = pts[0];
  let count = 0;
  for (let i = 1; i < pts.length; i++) {
    const dx = r1(pts[i][0] - px);
    const dy = r1(pts[i][1] - py);
    if (dx === 0 && dy === 0) continue;
    deltas.push(dx, dy);
    [px, py] = pts[i];
    count++;
  }
  if (count < (closed ? 2 : 1)) return '';
  return `M${join(pts[0])}l${join(deltas)}${closed ? 'z' : ''}`;
}

/** Collects what d3 would draw, as plain point lists, so we can simplify before writing a path. */
function collector() {
  const lines: { points: Pt[]; closed: boolean }[] = [];
  let current: { points: Pt[]; closed: boolean } | null = null;
  return {
    lines,
    context: {
      moveTo(x: number, y: number) {
        current = { points: [[x, y]], closed: false };
        lines.push(current);
      },
      lineTo(x: number, y: number) {
        current?.points.push([x, y]);
      },
      closePath() {
        if (current) current.closed = true;
      },
      arc() {},
    },
  };
}

export interface Place {
  lon: number;
  lat: number;
}

export interface Route {
  /** Path of the great-circle course from the home port */
  d: string;
  /** Box around the home port, the destination and the whole course between them */
  box: Box;
}

export function buildChart(world: any, home: Place, places: Place[]) {
  const projection = geoMercator()
    .rotate([-LON0, 0])
    .scale(SCALE)
    .translate([W / 2, merc(SHEET.north) * SCALE])
    // The bottom edge sits well below the sheet, so the line that closes Antarctica is never seen
    .clipExtent([[-1, -1], [W + 1, H + 80]])
    .precision(0.2);

  // ----- Land -----
  const land = collector();
  geoPath(projection, land.context)(feature(world, world.objects.land));
  const landPath = land.lines
    .filter((l) => l.closed && l.points.length > 3)
    .map((l) => {
      const area = ringArea(l.points);
      // Slivers of islands cut by the seam of the chart are dropped with the smallest islets
      const onSeam = l.points.some((p) => p[0] < 0.6 || p[0] > W - 0.6);
      if (area < minArea(l.points[0]) || (onSeam && area < 40)) return '';
      // A closed ring is simplified as two open halves so its start point is not special
      let far = 0;
      let farDist = 0;
      l.points.forEach((p, i) => {
        const d = Math.hypot(p[0] - l.points[0][0], p[1] - l.points[0][1]);
        if (d > farDist) {
          farDist = d;
          far = i;
        }
      });
      const first = simplify(l.points.slice(0, far + 1));
      const second = simplify(l.points.slice(far));
      return toPath([...first, ...second.slice(1)], true);
    })
    .join('');

  // ----- Country borders, only where the chart zooms in far enough for them to matter -----
  const borders = collector();
  geoPath(projection, borders.context)(mesh(world, world.objects.countries, (a: unknown, b: unknown) => a !== b));
  const borderPath = borders.lines
    .filter((l) => l.points.length > 1 && l.points.every(inBorders))
    .map((l) => toPath(simplify(l.points), false))
    .join('');

  // ----- Graticule: straight lines on Mercator -----
  const meridians: number[] = [];
  for (let lon = -180; lon < 180; lon += 15) meridians.push(r1(lonToX(lon)));
  const parallels: number[] = [];
  for (let lat = -60; lat <= 75; lat += 15) if (lat !== 0) parallels.push(r1(latToY(lat)));
  const graticule =
    meridians.filter((x) => x > 1 && x < W - 1).map((x) => `M${num(x)} 0V${num(H)}`).join('') +
    parallels.map((y) => `M0 ${num(y)}H${W}`).join('');

  // ----- Great-circle courses from the home port -----
  const [hx, hy] = project(home.lon, home.lat);
  const routes: Route[] = places.map((place) => {
    const along = geoInterpolate([home.lon, home.lat], [place.lon, place.lat]);
    const steps = 40;
    const pts: Pt[] = [];
    for (let i = 0; i <= steps; i++) {
      const [lon, lat] = along(i / steps);
      pts.push(project(lon, lat));
    }
    const xs = pts.map((p) => p[0]);
    const ys = pts.map((p) => p[1]);
    const x = Math.min(...xs);
    const y = Math.min(...ys);
    return {
      d: `M${pts.map((p) => `${num(p[0])} ${num(p[1])}`).join('L')}`,
      box: { x: r1(x), y: r1(y), w: r1(Math.max(...xs) - x), h: r1(Math.max(...ys) - y) },
    };
  });

  return {
    landPath,
    borderPath,
    graticule,
    routes,
    home: { x: hx, y: hy },
    points: places.map((p) => {
      const [x, y] = project(p.lon, p.lat);
      return { x, y };
    }),
  };
}

/** Smallest box around several boxes. */
export const unionBox = (boxes: Box[]): Box => {
  const x = Math.min(...boxes.map((b) => b.x));
  const y = Math.min(...boxes.map((b) => b.y));
  const x2 = Math.max(...boxes.map((b) => b.x + b.w));
  const y2 = Math.max(...boxes.map((b) => b.y + b.h));
  return { x: r1(x), y: r1(y), w: r1(x2 - x), h: r1(y2 - y) };
};
