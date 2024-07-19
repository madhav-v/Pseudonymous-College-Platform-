import express from "express";
import { checkAuth } from "../middleware/auth.middleware";
import { PostController } from "../controllers/post.controller";

const router = express.Router();
const postCtrl = new PostController();

export default router;
