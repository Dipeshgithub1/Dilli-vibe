import { Request,Response,NextFunction } from "express";
import { registerUser,loginUser } from "../services/auth.service";
import { loginSchema,registerSchema } from "../util/auth.schema";

export const registerController = async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    try {
        registerSchema.parse(req.body);
    const { email, password, firstName, lastName } = req.body as {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    };

        const { user, token }  = await registerUser({
            email,
            password,
            firstName,
            lastName,
        })


        res.status(201).json({
            success: true,
            token,
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
        const { email, password } = req.body as {
       email: string;
       password: string;
       };

        const result = await loginUser(email,password);

        res.status(200).json({
         success: true,
        message: "Login successful",
        data:result
        });
        
    } catch (error) {
        next(error)
        
    }

}


export const logoutController = (req: Request, res: Response) => {
  // JWT is stateless → nothing to delete on server
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};