import express from "express";
import { OrgController } from "../controllers/org.controller";
import { checkAuth } from "../middleware/auth.middleware";
import { checkPermission } from "../middleware/permission.middleware";
import upload from "../middleware/multer.middleware";

const router = express.Router();
const orgCtrl = new OrgController();

router.get("/allOrgs", orgCtrl.getAllOrgs);
router.get("/myOrg", checkAuth, orgCtrl.getMyOrg);

router.post("/create", checkAuth, checkPermission("admin"), orgCtrl.createOrg);
router.post(
  "/addLogo",
  checkAuth,
  checkPermission("admin"),
  upload.single("logo"),
  orgCtrl.addLogo
);
router.post(
  "/addMainPic",
  checkAuth,
  checkPermission("admin"),
  upload.single("mainPic"),
  orgCtrl.addMainPic
);
router.post(
  "/addOtherPics",
  checkAuth,
  checkPermission("admin"),
  upload.array("otherPics", 5),
  orgCtrl.addOtherPics
);
router.post(
  "/addOrgVideo",
  checkAuth,
  checkPermission("admin"),
  upload.single("orgsVideo"),
  orgCtrl.addOrgsVideo
);
export default router;
