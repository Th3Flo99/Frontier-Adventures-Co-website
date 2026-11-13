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
    description: 'What life on board is really like, from the buffet to the adults-only restaurant.',
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
  photo?: { src: string; alt: string };
}

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

const foodEntries: Entry[] = foodData.map((f) => {
  const destination = destinationById(f.destination);
  const score = average(f.scores);
  const cats: CategoryId[] = ['food'];
  if (destination?.kind === 'cruise') cats.push('cruises');
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
