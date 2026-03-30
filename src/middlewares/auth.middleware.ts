import { NextFunction, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config"; 

const auth = (...roles: string[]) => {

  return async (req: any, res: Response, next: NextFunction) => {
    try {
      let token = req.headers.authorization;

      // ১. টোকেন আছে কি না চেক করা
      if (!token) {
        return res.status(401).json({
          success: false,
          message: "You are not authorized!",
        });
      }

     
      if (token.startsWith("Bearer ")) {
        token = token.split(" ")[1];
      }

      const decoded = jwt.verify(
        token,
        config.jwt_access_secret as string 
      ) as JwtPayload;

      const { role } = decoded;

     
      if (roles.length && !roles.includes(role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: You do not have permission to perform this action",
        });
      }

   
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid token or expired!",
      });
    }
  };
};


export default auth;