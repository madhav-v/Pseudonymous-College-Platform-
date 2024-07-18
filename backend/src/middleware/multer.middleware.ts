import multer from "multer";
import { Request, Response } from "express";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `./public`);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req: Request, file: any, cb: any) => {
  console.log("file mime type", file.mimetype);
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "video/mp4" ||
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb(new Error("invalid file type only vedio and the audio are allowed"));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    // 30 mb max size
    fieldSize: 30 * 1024 * 1024,
  },
  fileFilter,
});

export default upload;
