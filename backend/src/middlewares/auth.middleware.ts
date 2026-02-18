import {Request,Response,NextFunction} from "express"
import jwt from "jsonwebtoken";


interface JwtPayload {
    id:string;
    email:string;
}

declare global {
    namespace Express {
        interface Request{
            user?:JwtPayload
        }
    }
}

export const authMiddleware = (
    req:Request,
    res:Response,
    next:NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({message: "Unauthorized"})

        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Invalid token format" });
        }

        const secret = process.env.JWT_SECRET as string;
        if (!secret) {
            return res.status(500).json({ message: "JWT_SECRET not configured" });
        }

        const decoded = jwt.verify(token, secret) as unknown as JwtPayload;
        
        if (!decoded || typeof decoded === 'string') {
            return res.status(401).json({ message: "Invalid token format" });
        }
        
        // Ensure decoded has required properties
        const payload = decoded as JwtPayload;
        if (!payload.id || !payload.email) {
            return res.status(401).json({ message: "Invalid token payload" });
        }
        
        req.user = payload;
        next();
        
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
