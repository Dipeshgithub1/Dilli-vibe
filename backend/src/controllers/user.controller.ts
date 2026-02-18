import { Request,Response,NextFunction } from "express"
import { onboardingSchema } from "../util/auth.schema"
import { completeOnboarding } from "../services/user.service";



export const onboardingController = async(
  req: Request,
  res: Response,
  next: NextFunction,
) => {
    try {
        onboardingSchema.parse({body:req.body})
        
 // Get logged-in user ID (from JWT middleware)
 const userId = req.user?.id;
 if(!userId){
    return res.status(401).json({message: "Unauthorized"})
 }

 //call service
 const user = await completeOnboarding(userId,req.body)

 // Send response
    res.status(200).json({
      success: true,
      message: "Onboarding completed successfully",
      data: user,
       });
    } catch (error) {
        next(error);
        
    }
}

