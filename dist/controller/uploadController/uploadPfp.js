"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appError_1 = __importDefault(require("../../utils/appError"));
const cloudinary_1 = require("cloudinary");
const uploadProfilePicture = async (req, res, next) => {
    // Check if file exists
    const file = req.file;
    if (!file) {
        return next();
    }
    // Configure cloudinary
    cloudinary_1.v2.config({
        api_key: process.env.API_KEY,
        cloud_name: process.env.CLOUD_NAME,
        api_secret: process.env.API_SECRET,
    });
    try {
        // Upload and resize image using cloudinary
        const result = await cloudinary_1.v2.uploader.upload(file.path, {
            transformation: {
                width: 500,
                height: 500,
                crop: 'crop',
                format: 'jpg',
                quality: 90,
            },
            folder: req.user.id,
        });
        // Update user profile picture and save
        req.profilePicture = result.secure_url;
    }
    catch (err) {
        // Handle cloudinary upload errors
        return next(new appError_1.default(err.message, 500));
    }
    // Continue with the next middleware
    next();
};
exports.default = uploadProfilePicture;
//# sourceMappingURL=uploadPfp.js.map