
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
    "loud",
    "nightlife",
    "party",
    "energy",
  ],

  romantic: [
    "aesthetic",
    "cozy",
    "couple-friendly",
    "quiet",
    "candlelight",
  ],

  explore: [
    "historic",
    "walking",
    "photography",
    "monument",
    "culture",
  ],

  food: [
    "food",
    "cafe",
    "street-food",
    "restaurant",
    "dessert",
  ],

  social: [
    "group-friendly",
    "lively",
    "hangout",
    "cafe",
    "interactive",
  ],
};