import { Request,Response,NextFunction } from "express";
import { User } from "../model/user.model";



export const meController  = async(
    req:Request,
    res:Response,
    next:NextFunction,
) => {
    try {
        const userid = req.user?.id;

        if(!userid){
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await User.findById(userid).select("-password");

        if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
        
    } catch (error) {
        next(error);
    }
}