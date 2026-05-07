import { User } from "../model/user.model";
import { Experience } from "../model/experience.model";
import { moodToTags, Mood } from "../util/moodTags";
import {
  getMoodTags,
  getPlaceExplanation,
} from "./gemini.service";

const SCORE_WEIGHTS = {
  tagMatch: 5,
  rating: 2,
  popularity: 0.05,
  budgetMatch: 3,
  companyMatch: 3,
  randomBoost: 1,
};

const aiSearchCache = new Map<
  string,
  {
    tags: string[];
    expires: number;
  }
>();

const CACHE_TTL = 1000 * 60 * 30; // 30 mins

// -------------------------
// GET RECOMMENDATIONS
// -------------------------

export const getRecommendationsForUser = async (
  userId: string,
  page: number = 1,
  limit: number = 6,
  searchText?: string
) => {
  console.log("🎯 getRecommendationsForUser:", {
    userId,
    searchText,
  });

  // pagination safety
  page = Math.max(page, 1);
  limit = Math.min(Math.max(limit, 1), 20);

  // find user
  const user = await User.findById(userId).lean();

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.isOnboarded) {
    throw new Error("User onboarding incomplete");
  }

  // -------------------------
  // BUILD USER TAGS
  // -------------------------

  let userTags: string[] = [];

  // onboarding moods
  if (user.preferredVibes?.length) {
    user.preferredVibes.forEach((mood: Mood) => {
      userTags.push(...moodToTags[mood]);
    });
  }

  // AI search tags
  const cleanedSearch = searchText
    ?.trim()
    .slice(0, 100)
    .toLowerCase();

  if (cleanedSearch) {
    const cached = aiSearchCache.get(cleanedSearch);

    // use cache
    if (cached && cached.expires > Date.now()) {
      userTags.push(...cached.tags);
    } else {
      const aiTags = await getMoodTags(cleanedSearch);

      aiSearchCache.set(cleanedSearch, {
        tags: aiTags,
        expires: Date.now() + CACHE_TTL,
      });

      userTags.push(...aiTags);
    }
  }

  // remove duplicates
  userTags = [...new Set(userTags)];

  // -------------------------
  // MATCH STAGE
  // -------------------------

  const matchStage: any = {
    isActive: true,
  };

  if (userTags.length) {
    matchStage.tags = {
      $in: userTags,
    };
  }

  // -------------------------
  // AGGREGATION
  // -------------------------

  const experiences = await Experience.aggregate([
    {
      $match: matchStage,
    },

    // matching tags
    {
      $addFields: {
        matchedTags: {
          $setIntersection: [
            "$tags",
            userTags.length ? userTags : [],
          ],
        },
      },
    },

    {
      $addFields: {
        tagMatchCount: {
          $size: "$matchedTags",
        },
      },
    },

    // recommendation score
    {
      $addFields: {
        score: {
          $add: [
            // tag matching
            {
              $multiply: [
                "$tagMatchCount",
                SCORE_WEIGHTS.tagMatch,
              ],
            },

            // rating
            {
              $multiply: [
                {
                  $ifNull: ["$rating", 0],
                },
                SCORE_WEIGHTS.rating,
              ],
            },

            // popularity normalization
            {
              $multiply: [
                {
                  $ifNull: [
                    "$popularityScore",
                    0,
                  ],
                },
                SCORE_WEIGHTS.popularity,
              ],
            },

            // budget match
            {
              $cond: [
                {
                  $eq: [
                    "$budgetPreference",
                    user.budgetPreference,
                  ],
                },
                SCORE_WEIGHTS.budgetMatch,
                0,
              ],
            },

            // company match
            {
              $cond: [
                {
                  $and: [
                    {
                      $ifNull: [
                        user.companyType,
                        false,
                      ],
                    },
                    {
                      $in: [
                        user.companyType,
                        "$suitableFor",
                      ],
                    },
                  ],
                },
                SCORE_WEIGHTS.companyMatch,
                0,
              ],
            },

            // freshness / exploration
            {
              $multiply: [
                {
                  $rand: {},
                },
                SCORE_WEIGHTS.randomBoost,
              ],
            },
          ],
        },
      },
    },

    {
      $sort: {
        score: -1,
        rating: -1,
      },
    },

    {
      $skip: (page - 1) * limit,
    },

    {
      $limit: limit,
    },

    // cleaner response
    {
      $project: {
        matchedTags: 0,
      },
    },
  ]);

  // total count
  const total = await Experience.countDocuments(
    matchStage
  );

  // recommendation reason
  const enrichedResults = experiences.map(
    (place: any) => ({
      ...place,

      recommendationReason:
        place.tagMatchCount > 2
          ? "Strong match for your vibe"
          : place.tagMatchCount > 0
          ? "Matches some of your preferences"
          : "Trending place you may enjoy",
    })
  );

  return {
    data: enrichedResults,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

// -------------------------
// PLACE DETAILS
// -------------------------

export const getPlaceById = async (
  placeId: string,
  userId: string
) => {
  const place = await Experience.findById(
    placeId
  ).lean();

  if (!place) {
    throw new Error("Place not found");
  }

  const user = await User.findById(userId).lean();

  const explanation =
    await getPlaceExplanation(place, user);

  return {
    data: place,
    explanation:
      explanation?.explanation ||
      "Great place matching your vibe.",
    bestTime:
      explanation?.bestTime || "Evening",
  };
};

// -------------------------
// RELATED PLACES
// -------------------------

export const getRelatedPlaces = async (
  placeId: string,
  userId: string,
  limit: number = 3
) => {
  limit = Math.min(Math.max(limit, 1), 10);

  const place = await Experience.findById(
    placeId
  ).lean();

  if (!place) {
    throw new Error("Place not found");
  }

  const user = await User.findById(userId).lean();

  let userTags: string[] = [];

  if (user?.preferredVibes?.length) {
    user.preferredVibes.forEach(
      (mood: Mood) => {
        userTags.push(...moodToTags[mood]);
      }
    );
  }

  const matchingTags = [
    ...new Set([
      ...(place.tags || []),
      ...userTags,
    ]),
  ];

  const related = await Experience.aggregate([
    {
      $match: {
        _id: {
          $ne: place._id,
        },

        isActive: true,

        tags: {
          $in: matchingTags,
        },
      },
    },

    {
      $addFields: {
        tagMatchCount: {
          $size: {
            $setIntersection: [
              "$tags",
              matchingTags,
            ],
          },
        },
      },
    },

    {
      $addFields: {
        relatedScore: {
          $add: [
            {
              $multiply: [
                "$tagMatchCount",
                5,
              ],
            },

            {
              $multiply: [
                {
                  $ifNull: ["$rating", 0],
                },
                2,
              ],
            },

            {
              $cond: [
                {
                  $eq: [
                    "$area",
                    place.area,
                  ],
                },
                3,
                0,
              ],
            },
          ],
        },
      },
    },

    {
      $sort: {
        relatedScore: -1,
      },
    },

    {
      $limit: limit,
    },
  ]);

  return related;
};