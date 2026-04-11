import { Response,Request,NextFunction } from "express";
import { getRecommendationsForUser, getPlaceById, getRelatedPlaces } from "../services/recommendation.service";

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

export const getPlaceController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = (req as any).user?.id;
        const id = req.params.id as string;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const result = await getPlaceById(id, userId);
        res.status(200).json(result);
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
        const userId = (req as any).user?.id;
        const id = req.params.id as string;
        const limit = Number(req.query.limit) || 3;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const places = await getRelatedPlaces(id, userId, limit);
        res.status(200).json({ data: places });
    } catch (error) {
        next(error);
    }
}