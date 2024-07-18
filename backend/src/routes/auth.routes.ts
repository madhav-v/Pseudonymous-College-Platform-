import express from "express";
import { AuthController } from "../controllers/auth.controller";
import { checkAuth } from "../middleware/auth.middleware";

const router = express.Router();
const authCtrl = new AuthController();

router.post("/register", authCtrl.register);
router.post("/login", authCtrl.login);
router.post("/forgetPassword", authCtrl.forgetPassword);
router.post("/resetPassword", authCtrl.resetPassword);
router.post("/addUsername", checkAuth, authCtrl.addUsername);

export default router;
