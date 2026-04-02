import { User } from "../model/user.model";
import { Experience } from "../model/experience.model";
import { moodToTags } from "../util/moodTags";
import { Mood } from "../util/moodTags";

export const getRecommendationsForUser = async(
    userId:string,
    page:number = 1,
    limit:number = 6

) => {

    //get user preparenece 

    const user = await User.findById(userId);

    if(!user){
        throw new Error("User not found")
    }
    if(!user.isOnboarded){
        throw new Error("User has not completed onboarding");
    }

    // mood convert in tags
    let UserTags : string[] = [];

    //Build query dynamically

    // const query :any = {
    //     isActive: true,
    // };

    let userTags: string[] = [];

if (user.preferredVibes?.length) {
  user.preferredVibes.forEach((mood: Mood) => {
    userTags.push(...moodToTags[mood]);
  });
}

  
  // 🔹 remove duplicates
  UserTags = [...new Set(UserTags)];

  // 🔹 3. Fetch relevant experiences (optimized)
  const experiences = await Experience.find({
    isActive: true,
    ...(UserTags.length && { tags: { $in: UserTags } }) // 🔥 optimization
  }).lean();

  // 🔹 4. Score experiences
  const scored = experiences.map((exp: any) => {
    let score = 0;

    // ✅ tag match (main logic)
    const matchCount = UserTags.filter(tag =>
      exp.tags.includes(tag)
    ).length;

    score += matchCount * 3;

    // ✅ rating boost
    score += exp.rating || 0;

    // ✅ popularity boost
    score += exp.popularityScore || 0;

    // ✅ budget match
    if (user.budgetPreference === exp.budgetPreference) {
      score += 2;
    }

    // ✅ suitableFor match
    if (
      user.companyType &&
      exp.suitableFor.includes(user.companyType)
    ) {
      score += 2;
    }

    return {
      ...exp,
      score,
    };
  });

  // 🔹 5. Sort by score
  scored.sort((a, b) => b.score - a.score);

  // 🔹 6. Pagination AFTER ranking
  const start = (page - 1) * limit;
  const paginated = scored.slice(start, start + limit);

  return {
    data: paginated,
    total: scored.length,
    page,
    totalPages: Math.ceil(scored.length / limit),
  };
};