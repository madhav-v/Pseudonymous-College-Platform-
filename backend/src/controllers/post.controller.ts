import { Request, Response } from "express";
import ErrorHandler from "../utils/errorhandler";
import { getRepository } from "typeorm";
import logger from "../config/logger";
import { Org } from "../models/Org.model";
import cloudinary from "../config/cloudinary.config";
import { CustomRequest } from "../middleware/auth.middleware";
import { User } from "../models/User.model";

export class PostController {
  createPost = async (req: Request, res: Response) => {
    try {
    } catch (error: any) {}
  };

  getAllPosts = async (req: Request, res: Response) => {
    try {
    } catch (error: any) {}
  };
}
