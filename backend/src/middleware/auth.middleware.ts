import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/errorhandler";
import environment from "../utils/validateEnv";
import userSvc from "../services/user.service";

export interface CustomRequest extends Request {
  user?: any;
}

export const checkAuth = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let token: string | undefined = undefined;
    if (typeof req.headers["authorization"] === "string") {
      token = req.headers["authorization"];
    } else if (typeof req.headers["x-xsrf-token"] === "string") {
      token = req.headers["x-xsrf-token"];
    } else if (typeof req.query["token"] === "string") {
      token = req.query["token"];
    }
    if (!token || token === "" || token === null) {
      next({ status: 401, msg: "Please login first!!" });
      return;
    }
    const tokenString = token as string;
    const tokenParts = tokenString.split(" ");
    if (tokenParts.length !== 2 || !tokenParts[1]) {
      next({ status: 401, msg: "Token not set" });
      return;
    }

    let data = jwt.verify(tokenParts[1], environment.JWT_SECRET) as JwtPayload;

    let user = await userSvc.getUserById(data.id);
    if (!user) {
      next({ status: 403, msg: "User does not exists." });
    }

    req.user = user;
    // console.log(user);

    next();
  } catch (error: any) {
    const errorMessage = error.message || "Authentication error";
    const statusCode = error.statusCode || 401;
    const err = new ErrorHandler(errorMessage, statusCode);
    next(err);
  }
};
