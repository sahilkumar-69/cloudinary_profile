import { Router } from "express";

import { upload } from "../middleware/multer_upload.js";
import {
  delete_record,
  deleteProfile,
  updateProfile,
  upload_file,
  upload_profileData,
} from "../controller/fileController.js";

const router = Router();

router.route("/").post(upload.single("image"), upload_file);
router.route("/deleterecord").get(delete_record);

router
  .route("/profile")
  .post(
    upload.fields([{ name: "avatar" }, { name: "pdf" }, { name: "video" }]),
    upload_profileData
  );

router.route("/deleteprofile").get(deleteProfile)

router.route("/updateprofile").post(upload.single("avatar"),updateProfile)

export default router;


