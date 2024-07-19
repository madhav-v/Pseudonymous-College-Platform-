import express from "express";
import authRoutes from "./auth.routes";
import orgRoutes from "./org.routes";
import materialRoutes from "./material.routes";
import postRoutes from "./post.routes";
const router = express.Router();

router.use("/auth", authRoutes);
router.use("/org", orgRoutes);
router.use("/material", materialRoutes);
router.use("/post", postRoutes);

export default router;
