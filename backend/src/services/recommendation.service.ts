import { User } from "../model/user.model";
import { Experience } from "../model/experience.model";
import { moodToTags } from "../util/moodTags";
import { Mood } from "../util/moodTags";

export const getRecommendationsForUser = async (
  userId: string,
  page: number = 1,
  limit: number = 6
) => {
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