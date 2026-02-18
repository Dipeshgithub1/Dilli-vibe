import { Response,Request,NextFunction } from "express";
import { getRecommendationsForUser } from "../services/recommendation.service";

export const recommendationController = async(
    req: Request,
  res: Response,
  next: NextFunction
) => {
    try {
        const userId = req.user?.id
     
        if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const recommendations  = await getRecommendationsForUser(userId)

        res.status(200).json({
      success: true,
      data: recommendations,
        })

    } catch (error) {
        next(error);
    }
}