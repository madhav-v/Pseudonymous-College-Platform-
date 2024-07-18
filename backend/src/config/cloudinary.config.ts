import cloudinary from "cloudinary";
import environment from "../utils/validateEnv";

cloudinary.v2.config({
  cloud_name: environment.CLOUDINARY_CLIENT_NAME,
  api_key: environment.CLOUDINARY_CLIENT_API,
  api_secret: environment.CLOUDINARY_CLIENT_SECRET,
});

export default cloudinary;
