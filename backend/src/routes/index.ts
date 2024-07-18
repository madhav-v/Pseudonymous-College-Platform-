import express from "express";
import authRoutes from "./auth.routes";
import orgRoutes from "./org.routes";
import materialRoutes from "./material.routes";
const router = express.Router();

router.use("/auth", authRoutes);
router.use("/org", orgRoutes);
router.use("/material", materialRoutes);

export default router;
