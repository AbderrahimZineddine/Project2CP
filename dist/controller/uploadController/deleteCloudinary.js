"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const cloudinary_build_url_1 = require("cloudinary-build-url");
const deleteFromCloudinary = async (url) => {
    cloudinary_1.v2.config({
        api_key: process.env.API_KEY,
        cloud_name: process.env.CLOUD_NAME,
        api_secret: process.env.API_SECRET,
    });
    const publicId = (0, cloudinary_build_url_1.extractPublicId)(url);
    console.log(publicId);
    await cloudinary_1.v2.uploader.destroy(publicId);
};
exports.default = deleteFromCloudinary;
//# sourceMappingURL=deleteCloudinary.js.map