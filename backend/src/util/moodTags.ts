import { moods } from "./auth.schema";

export type Mood = (typeof moods)[number];

export const TAGS = [
  "peaceful",
  "nature",
  "quiet",
  "outdoor",
  "relax",

  "music",
  "nightlife",
  "party",
  "energy",

  "aesthetic",
  "cozy",
  "romantic",
  "couple-friendly",
  "candlelight",

  "historic",
  "photography",
  "culture",
  "shopping",
  "walking",
  "monument",

  "cafe",
  "street-food",
  "dessert",
  "luxury",
  "budget",

  "hangout",
  "group-friendly",
  "lively",
  "interactive",
] as const;

export type Tag = typeof TAGS[number];

export const moodToTags: Record<Mood, Tag[]> = {
  chill: [
    "peaceful",
    "nature",
    "quiet",
    "outdoor",
    "relax",
  ],

  fun: [
    "music",
    "nightlife",
    "party",
    "energy",
    "lively",
  ],

  romantic: [
    "aesthetic",
    "cozy",
    "romantic",
    "quiet",
    "couple-friendly",
    "candlelight",
  ],

  explore: [
    "historic",
    "photography",
    "culture",
    "shopping",
    "walking",
    "monument",
  ],

  food: [
    "cafe",
    "street-food",
    "dessert",
    "luxury",
    "budget",
  ],

  social: [
    "hangout",
    "group-friendly",
    "interactive",
    "lively",
    "cafe",
  ],
};