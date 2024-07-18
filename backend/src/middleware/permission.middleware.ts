import { NextFunction, Request, Response } from "express";

export interface CustomRequest extends Request {
  user?: any;
}

export const checkPermission = (role: string) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    let user = req.user;
    if (typeof role === "string" && user.role === role) {
      next();
    } else if (Array.isArray(role) && role.includes(user.role)) {
      next();
    } else {
      next({
        status: 403,
        msg: "You do not have privilege to access this request",
      });
    }
  };
};
