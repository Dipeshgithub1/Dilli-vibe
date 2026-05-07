import { User } from "../model/user.model";
import { OnboardingInput } from "../util/auth.schema";

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
