// One unified view of everything we have published, built from the JSON content files.
// Pages and the expedition map read from here, so a new review or food entry shows up
// everywhere at once. Nothing is invented: an entry exists only if it is in the data.
import foodData from '../data/food.json';
import reviewData from '../data/reviews.json';
import destinationData from '../data/destinations.json';
import { href } from './paths';

export type CategoryId = 'theme-parks' | 'cruises' | 'food' | 'journals';

export interface Category {
  id: CategoryId;
  title: string;
  kicker: string;
  description: string;
}

export const categories: Category[] = [
  {
    id: 'theme-parks',
    title: 'Theme Parks',
    kicker: 'Parks, hotels and attractions',
    description: 'Park days, hotel stays and honest verdicts from the resorts we have visited.',
  },
  {
    id: 'cruises',
    title: 'Cruise Adventures',
    kicker: 'Ships, dining and days at sea',
    description: 'What life on board is really like: the ships, the dining and the days at sea.',
  },
  {
    id: 'food',
    title: 'Food & Discoveries',
    kicker: 'Snacks, restaurants and recommendations',
    description: 'Everything worth eating along the way, each entry scored out of five.',
  },
  {
    id: 'journals',
    title: 'Travel Journals',
    kicker: 'Trip reports and stories',
    description: 'Longer stories and practical guides from our trips.',
  },
];

export interface Destination {
  id: string;
  name: string;
  kind: 'park' | 'cruise';
  region: string;
  lat: number;
  lon: number;
  approximate: boolean;
  blurb: string;
  /** focus: CSS object-position for the 16:9 crop on the chart, e.g. "50% 30%" */
  photo?: { src: string; alt: string; focus?: string };
  /** Where the brass tag hangs on the chart, for destinations close to others (screen pixels) */
  tag?: { dx?: number; dy?: number; label?: 'below' | 'left' | 'right' };
  /** For a cruise: the ship, dates, ports in order and the track it actually sailed */
  voyage?: Voyage;
}

export interface Voyage {
  ship: string;
  line: string;
  /** YYYY-MM-DD */
  start: string;
  end: string;
  nights: number;
  nauticalMiles?: number;
  /** Every port in order, the home port of the cruise first and last */
  ports: string[];
  /** Ports of call, in order */
  calls: { name: string; country: string; lon: number; lat: number; label?: 'left' | 'right' | 'above' | 'below' | 'above-left' }[];
  /** The sailed track as [longitude, latitude] pairs */
  track: [number, number][];
}

/** "17–24 May 2025", "28 Feb – 3 Mar 2026", across years in full. In UTC so no timezone shifts a day. */
export const voyageDates = (start: string, end: string) => {
  const a = new Date(`${start}T00:00:00Z`);
  const b = new Date(`${end}T00:00:00Z`);
  const f = (d: Date, o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', ...o }).format(d);
  if (a.getUTCFullYear() !== b.getUTCFullYear()) return `${f(a, { day: 'numeric', month: 'long', year: 'numeric' })} – ${f(b, { day: 'numeric', month: 'long', year: 'numeric' })}`;
  if (a.getUTCMonth() !== b.getUTCMonth()) return `${f(a, { day: 'numeric', month: 'long' })} – ${f(b, { day: 'numeric', month: 'long', year: 'numeric' })}`;
  return `${a.getUTCDate()}–${f(b, { day: 'numeric', month: 'long', year: 'numeric' })}`;
};

export const home = destinationData.home;
export const destinations = destinationData.destinations as Destination[];
export const destinationById = (id?: string | null) => destinations.find((d) => d.id === id);

export interface Entry {
  id: string;
  kind: 'review' | 'food';
  /** Label for the kind of entry, e.g. "Hotel review", "Snack" */
  label: string;
  title: string;
  summary: string;
  categories: CategoryId[];
  destination?: Destination;
  /** Where the entry was eaten or stayed, as written in the data */
  place?: string;
  /** Internal link to the full entry */
  url: string;
  /** Score out of 5 (review rating, or the crew average for food) */
  score: number;
  scoreLabel: string;
  date?: string;
  trip?: string;
  /** Remote or local image, if the entry has one */
  image?: string;
}

const average = (scores: Record<string, number>) => {
  const values = Object.values(scores);
  return values.reduce((a, b) => a + b, 0) / values.length;
};

const reviewEntries: Entry[] = reviewData.map((r) => {
  const destination = destinationById((r as { destination?: string }).destination);
  const category = ((r as { category?: CategoryId }).category ?? 'theme-parks') as CategoryId;
  return {
    id: r.id,
    kind: 'review',
    label: `${r.platform} review`,
    title: r.title,
    summary: r.summary ?? '',
    categories: [category],
    destination,
    place: destination?.name,
    url: href(`reviews#${r.id}`),
    score: r.rating,
    scoreLabel: `${r.rating} out of 5 stars`,
    date: r.date,
  };
});

/** One entry in src/data/food.json (see the README for the fields) */
export interface FoodItem {
  id: string;
  name: string;
  location: string;
  type: 'snack' | 'restaurant' | string;
  trip?: string;
  review: string;
  /** Score from 1 to 5 per crew member who tasted it, e.g. { "Megan": 5 } */
  scores: Record<string, number>;
  /** A photo of our own in public/ (remote images are never shown) */
  image?: string;
  destination?: string | null;
}
/** The food ledger as typed data. It can be empty: every page has an honest empty state. */
export const foodItems = foodData as FoodItem[];
/** Who has put a score in the ledger, in order of first appearance */
export const foodScorers = [...new Set(foodItems.flatMap((f) => Object.keys(f.scores)))];

const foodEntries: Entry[] = foodItems.map((f) => {
  const destination = destinationById(f.destination);
  const score = average(f.scores);
  const cats: CategoryId[] = ['food'];
  // A cruise entry not yet tied to one sailing still belongs in the cruise chapter
  if (destination?.kind === 'cruise' || (!destination && /cruise/i.test(f.location))) cats.push('cruises');
  if (destination?.kind === 'park') cats.push('theme-parks');
  return {
    id: f.id,
    kind: 'food',
    label: f.type === 'restaurant' ? 'Restaurant' : 'Snack',
    title: f.name,
    summary: f.review,
    categories: cats,
    destination,
    place: f.location,
    url: href(`food#${f.id}`),
    score,
    scoreLabel: `Crew average ${score.toFixed(1)} out of 5`,
    trip: f.trip,
    image: f.image,
  };
});

export const entries: Entry[] = [...reviewEntries, ...foodEntries];
export const reviews = reviewEntries;
export const food = foodEntries;

export const entriesByCategory = (id: CategoryId) => entries.filter((e) => e.categories.includes(id));
export const entriesByDestination = (id: string) => entries.filter((e) => e.destination?.id === id);
