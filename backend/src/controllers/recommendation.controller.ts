import { Response,Request,NextFunction } from "express";
import { getRecommendationsForUser } from "../services/recommendation.service";

export const recommendationController = async(
    req: Request,
  res: Response,
  next: NextFunction
) => {
    try {
        const userId = (req as any).user?.id
     
        if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;

    const searchText  = req.body?.searchText || "";

    const recommendations  = await getRecommendationsForUser(
      userId,
      page,
      limit,
      searchText
    )

        res.status(200).json({
      success: true,
      ...recommendations,
        })

    } catch (error) {
        next(error);
    }
}