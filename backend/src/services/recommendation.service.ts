import { User } from "../model/user.model";
import { Experience } from "../model/experience.model";

export const getRecommendationsForUser = async(userId:string) => {

    //get user preparenece 

    const user = await User.findById(userId);

    if(!user){
        throw new Error("User not found")
    }
    if(!user.isOnboarded){
        throw new Error("User has not completed onboarding");
    }

    //Build query dynamically

    const query :any = {
        isActive: true,
    };

    if(user.preferredVibes?.length){
     query.moods = { $in: user.preferredVibes };
    }
    if (user.budgetPreference) {
    query.budgetPreference = user.budgetPreference;
  }
  if (user.companyType) {
    query.suitableFor = user.companyType;
  }

 const experiences = await Experience.find(query).limit(20);

  return experiences; 
}