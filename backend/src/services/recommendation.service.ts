import { User } from "../model/user.model";
import { Experience } from "../model/experience.model";
import { moodToTags } from "../util/moodTags";
import { Mood } from "../util/moodTags";
import { getMoodTags, getPlaceExplanation } from "./gemini.service";

export const getRecommendationsForUser = async (
  userId: string,
  page: number = 1,
  limit: number = 6,
  SearchText?:string
) => {
  console.log("🎯 getRecommendationsForUser called:", { userId, SearchText });
  
  const user = await User.findById(userId);
  
  if (!user) {
    throw new Error("User not found");
  }
  if (!user.isOnboarded) {
    throw new Error("User has not completed onboarding");
  }

  let userTags: string[] = [];

  if (user.preferredVibes?.length) {
    user.preferredVibes.forEach((mood: Mood) => {
      userTags.push(...moodToTags[mood]);
    });
  }
  if(SearchText){
    const aiTags = await getMoodTags(SearchText);
    userTags.push(...aiTags)
  }

  userTags = [...new Set(userTags)];

  const matchStage: any = { isActive: true };
  if (userTags.length) {
    matchStage.tags = { $in: userTags };
  }

  const experiences = await Experience.aggregate([
    { $match: matchStage },
    {
      $addFields: {
        tagMatchCount: {
          $size: {
            $setIntersection: ["$tags", userTags.length ? userTags : []],
          },
        },
      },
    },
    {
      $addFields: {
        score: {
          $add: [
            { $multiply: ["$tagMatchCount", 3] },
            { $ifNull: ["$rating", 0] },
            { $ifNull: ["$popularityScore", 0] },
            { $cond: [{ $eq: ["$budgetPreference", user.budgetPreference] }, 2, 0] },
            {
              $cond: [
                {
                  $and: [
                    { $ifNull: [user.companyType, false] },
                    { $in: [user.companyType, "$suitableFor"] },
                  ],
                },
                2,
                0,
              ],
            },
          ],
        },
      },
    },
    { $sort: { score: -1, rating: -1 } },
    { $skip: (page - 1) * limit },
    { $limit: limit },
  ]);

  const total = await Experience.countDocuments(matchStage);

  return {
    data: experiences,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

export const getPlaceById = async (placeId: string, userId: string) => {
  const place = await Experience.findById(placeId);
  
  if (!place) {
    throw new Error("Place not found");
  }

  const user = await User.findById(userId);
  const explanation = await getPlaceExplanation(place, user);
  
  return {
    data: place,
    explanation: explanation.explanation,
    bestTime: explanation.bestTime,
  };
};

export const getRelatedPlaces = async (
  placeId: string,
  userId: string,
  limit: number = 3
) => {
  const place = await Experience.findById(placeId);
  
  if (!place) {
    throw new Error("Place not found");
  }

  const user = await User.findById(userId);
  let userTags: string[] = [];

  if (user?.preferredVibes?.length) {
    user.preferredVibes.forEach((mood: Mood) => {
      userTags.push(...moodToTags[mood]);
    });
  }

  const placeTags = place.tags || [];
  const matchingTags = [...new Set([...placeTags, ...userTags])];

  const related = await Experience.find({
    _id: { $ne: placeId },
    isActive: true,
    tags: { $in: matchingTags },
  })
    .limit(limit)
    .sort({ rating: -1 })
    .lean();

  return related;
};