import { Response,Request,NextFunction } from "express";
import { getRecommendationsForUser, getPlaceById, getRelatedPlaces } from "../services/recommendation.service";

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

    const page = Math.max(Number(req.query.page) || 1,1);
    const limit = Math.min(Number(req.query.limit) || 6,20);

    // 🔍 Search should come from query params for GET requests
    const searchText  = (req.query.searchText as string)?.trim() || "";

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

export const getPlaceController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.id;
        const id = req.params.id as string;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const result = await getPlaceById(id, userId);
        res.status(200).json({
            success:true,
            data:result,
        });
    } catch (error) {
        next(error);
    }
}

export const getRelatedPlacesController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.id;
        const id = req.params.id as string;
        const limit = Math.max(Number(req.query.limit) || 3,10);

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const places = await getRelatedPlaces(id, userId, limit);
        res.status(200).json({ data: places });
    } catch (error) {
        next(error);
    }
}