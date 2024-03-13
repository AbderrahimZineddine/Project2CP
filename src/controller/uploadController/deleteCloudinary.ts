import { v2 as cloudinary } from 'cloudinary';
import { extractPublicId } from 'cloudinary-build-url';

const deleteFromCloudinary = async (url: string) => {
  cloudinary.config({
    api_key: process.env.API_KEY,
    cloud_name: process.env.CLOUD_NAME,
    api_secret: process.env.API_SECRET,
  });
  const publicId = extractPublicId(url);
  console.log(publicId);
  await cloudinary.uploader.destroy(publicId);
};

export default deleteFromCloudinary;
