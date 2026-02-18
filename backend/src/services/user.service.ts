import { User } from "../model/user.model";

interface OnboardingInput {
 firstName?: string;
  lastName?: string;
  avatar?: string;
  preferredVibes?: string[];
  budgetPreference?: "low" | "medium" | "high";
  companyType?: "solo" | "friends" | "couple" | "family";
}

export const completeOnboarding = async(
    userId:string,
    data:OnboardingInput
 ) => {

    const user = await User.findByIdAndUpdate(
        userId,
        {
            ...data,
            isOnboarded:true,
        },
        {new:true}
    ).select("-password")

    if(!user){
        throw new Error("User not found")
    }
    return user;

     }
