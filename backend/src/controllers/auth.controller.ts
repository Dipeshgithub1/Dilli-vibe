import { Request,Response,NextFunction } from "express";
import { registerUser,loginUser } from "../services/auth.service";
import { loginSchema,registerSchema } from "../util/auth.schema";
import { User } from "../model/user.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


export const registerController = async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    try {
    registerSchema.parse(req.body);
    const { email, password, firstName, lastName } = req.body;

    const {user,accessToken,refreshToken} = await registerUser({
      email,
      password,
      firstName,
      lastName,
    });

    //store refresh token in cookie

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

      res.status(201).json({
            success: true,
            accessToken,
            message:"User registered successfully",
            data:user,
        })

        
    } catch (error) {
        next(error)
        
    }
}

export const loginController = async(
    req:Request,
    res:Response,
    next:NextFunction
)=> {

    try {
        loginSchema.parse(req.body);
        const { email, password } = req.body;

       const {user,accessToken,refreshToken} = await loginUser
       (
        email,
        password
       )

     res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

        res.status(200).json({
         success: true,
        message: "Login successful",
        accessToken,
        data:user
        });
        
    } catch (error) {
        next(error)
        
    }

}


export const refreshController = async(req:Request,res:Response) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        console.log("Refresh token from cookie:", refreshToken ? "present" : "missing");
        
        if(!refreshToken) return res.status(401).json({message:"No refresh token"})
        
       //verify token
       const decoded = jwt.verify(refreshToken,process.env.REFRESH_SECRET!) as any;
        
       //check if exist in DB
       const user = await User.findById(decoded.id).select("+refreshToken");
       if (!user || !user.refreshToken) {
         return res.status(401).json({ message: "Invalid refresh token" });
       }
       
        const isValid = await bcrypt.compare(
          refreshToken,
          user.refreshToken
        );

        if (!isValid) {
          return res.status(401).json({ message: "Invalid refresh token" });
        }

        const accessToken = jwt.sign(
          { id: user._id, email: user.email },
          process.env.JWT_SECRET!,
          { expiresIn: "15m" }
        );

        res.json({ accessToken });
      } catch (error) {
        console.error("Refresh error:", error);
        res.status(401).json({ message: "Invalid refresh token" });
      }
    };


export const logoutController = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    if(refreshToken){
        try {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET!) as any;
            const user = await User.findById(decoded.id).select("+refreshToken");
            if(user){
                user.refreshToken = null;
                await user.save();
            }
        } catch (error) {
            // Token invalid, nothing to clear
        }
    }

    res.clearCookie("refreshToken");
    res.status(200).json({
    success: true,
    message: "Logged out successfully",
    })
};