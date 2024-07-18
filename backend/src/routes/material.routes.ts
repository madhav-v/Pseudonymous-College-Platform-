import express from "express";
import { MaterialController } from "../controllers/material.controller";
import { checkAuth } from "../middleware/auth.middleware";
import { checkPermission } from "../middleware/permission.middleware";
import upload from "../middleware/multer.middleware";

const router = express.Router();
const materialCtrl = new MaterialController();

router.post(
  "/addMaterial",
  checkAuth,
  checkPermission("admin"),
  upload.single("file"),
  materialCtrl.createMaterial
);

router.put(
  "/updateMaterial/:id",
  checkAuth,
  checkPermission("admin"),
  upload.single("file"),
  materialCtrl.updateMaterial
);

router.get("/getMaterials", materialCtrl.getAllMaterials);
router.get("/getMaterialById/:id", materialCtrl.getMaterialById);

router.delete(
  "/deleteMaterialById/:id",
  checkAuth,
  checkPermission("admin"),
  materialCtrl.deleteMaterialById
);

export default router;
