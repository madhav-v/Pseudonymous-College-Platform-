import { Request, Response } from "express";
import ErrorHandler from "../utils/errorhandler";
import { getRepository, Not } from "typeorm";
import logger from "../config/logger";
import { Org } from "../models/Org.model";
import cloudinary from "../config/cloudinary.config";
import { CustomRequest } from "../middleware/auth.middleware";
import { User } from "../models/User.model";
import { Post } from "../models/Post.model";

export class PostController {
  createPost = async (req: CustomRequest, res: Response) => {
    try {
      const { title, content } = req.body;
      const author = req.user;
      let media: string = "";
      if (req.file) {
        const result = await cloudinary.v2.uploader.upload(req.file.path);
        media = result.secure_url;
      }

      const postRepository = getRepository(Post);
      const post = postRepository.create({
        title,
        content,
        author,
        media,
        createdAt: new Date(),
      });
      const savedPost = await postRepository.save(post);
      res.status(201).json(savedPost);
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "An error occurred";
      const err = new ErrorHandler(message, statusCode);
      logger.error(`Error creating post: ${message}`, error);
      res.status(statusCode).json({
        error: err.message,
        message: "An error occurred",
      });
    }
  };

  getAllPosts = async (req: CustomRequest, res: Response) => {
    try {
      const postRepository = getRepository(Post);
      const userRepository = getRepository(User);
      const userId = req.user.id;

      const posts = await postRepository.find({
        where: { author: Not(userId) },
        relations: ["author", "likes", "comments", "comments.user"],
      });

      res.status(200).json({
        data: posts,
      });
    } catch (error: any) {}
  };

  getPostById = async (req: CustomRequest, res: Response) => {
    try {
      const postId = parseInt(req.params.id);
      const postRepository = getRepository(Post);
      const post = await postRepository
        .createQueryBuilder("post")
        .leftJoinAndSelect("post.user", "user")
        .where("post.id = :postId", { postId })
        .getOne();
      if (!post) {
        throw new ErrorHandler("Post not found", 404);
      }
      res.status(200).json(post);
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "An error occurred";
      const err = new ErrorHandler(message, statusCode);
      logger.error(`Error getting post: ${message}`, error);
      res.status(statusCode).json({
        error: err.message,
        message: "An error occurred",
      });
    }
  };

  deletePost = async (req: CustomRequest, res: Response) => {
    try {
      const postId = parseInt(req.params.id);
      const postRepository = getRepository(Post);
      const post = await postRepository.findOne({ where: { id: postId } });
      if (!post) {
        throw new ErrorHandler("Post not found", 404);
      }
      await postRepository.remove(post);
      res.status(200).json({ message: "Post deleted successfully" });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "An error occurred";
      const err = new ErrorHandler(message, statusCode);
      logger.error(`Error deleting post: ${message}`, error);
      res.status(statusCode).json({
        error: err.message,
        message: "An error occurred",
      });
    }
  };

  getMyPosts = async (req: CustomRequest, res: Response) => {
    try {
      const userId = parseInt(req.user.id);
      if (isNaN(userId)) {
        throw new Error("Invalid user ID");
      }
      const postRepository = getRepository(Post);

      const posts = await postRepository.find({
        where: { author: { id: userId } },
      });

      res.status(200).json({
        data: posts,
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "An error occurred";
      const err = new ErrorHandler(message, statusCode);
      logger.error(`Error getting all posts: ${message}`, error);

      res.status(statusCode).json({
        error: err.message,
        message: "An error occurred",
      });
    }
  };

  getPostsByUser = async (req: CustomRequest, res: Response) => {
    try {
      const userId = parseInt(req.params.id); // Get the user id from request params
      if (isNaN(userId)) {
        throw new Error("Invalid user ID");
      }

      const postRepository = getRepository(Post);

      const posts = await postRepository.find({
        where: { author: { id: userId } },
        relations: ["user"],
      });

      res.status(200).json({
        data: posts,
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "An error occurred";
      const err = new ErrorHandler(message, statusCode);
      logger.error(`Error getting posts by user: ${message}`, error);

      res.status(statusCode).json({
        error: err.message,
        message: "An error occurred",
      });
    }
  };

  updatePost = async (req: CustomRequest, res: Response) => {
    try {
      const postId = parseInt(req.params.id);
      const { title, content } = req.body;
      let media: string = "";

      if (req.file) {
        const result = await cloudinary.v2.uploader.upload(req.file.path);
        media = result.secure_url;
      }

      const postRepository = getRepository(Post);
      const post = await postRepository.findOne({ where: { id: postId } });
      if (!post) {
        throw new ErrorHandler("Post not found", 404);
      }
      post.title = title;
      post.content = content;
      post.media = media;
      const updatedPost = await postRepository.save(post);
      res.status(200).json(updatedPost);
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      const message = error.message || "An error occurred";
      const err = new ErrorHandler(message, statusCode);
      logger.error(`Error updating post: ${message}`, error);
      res.status(statusCode).json({
        error: err.message,
        message: "An error occurred",
      });
    }
  };
}
