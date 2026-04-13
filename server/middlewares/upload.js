import { fileURLToPath } from "url";
import fs from "fs";
import multer from "multer";
import path from "path";

// Fix __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const fileFilter = (req, file, cb) => {
  const imageTypes = /jpeg|jpg|png|gif/;
  const videoTypes = /mp4|webm|mov/;

  const ext = path.extname(file.originalname).toLowerCase(); // e.g., ".jpg"
  const mime = file.mimetype; // correct property

  const isImage = imageTypes.test(ext) && mime.startsWith("image/");
  const isVideo = videoTypes.test(ext) && mime.startsWith("video/");

  if (isImage || isVideo) {
    cb(null, true);
  } else {
    cb(new Error("Only image and video files are allowed!"));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB (5 * 1024 * 1024 === 5MB )
});

export default { upload };
