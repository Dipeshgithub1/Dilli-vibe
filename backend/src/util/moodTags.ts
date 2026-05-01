
export type Mood = 
  | "chill"
  | "fun"
  | "romantic"
  | "explore"
  | "food"
  | "social";

export const moodToTags:Record<Mood, string[]> = {
  chill: [
    "peaceful",
    "nature",
    "quiet",
    "low-crowd",
    "outdoor",
    "relax",
  ],

  fun: [
    "music",
    "crowded",
    "nightlife",
    "party",
    "loud",
    "energy",
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
    "food",
    "cafe",
    "street-food",
    "dessert",
    "luxury",
    "budget",
  ],

  social: [
    "hangout",
    "cafe",
    "group-friendly",
    "lively",
    "interactive",
  ],
};