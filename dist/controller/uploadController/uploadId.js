"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appError_1 = __importDefault(require("../../utils/appError"));
const cloudinary_1 = require("cloudinary");
const uploadId = async (req, res, next) => {
    // Check if file exists
    const files = req.files;
    if (!files || !files.idPicture || files.idPicture.length === 0) {
        return next(); //500 ??
    }
    else if (files.idPicture.length > 1) {
        return next(new appError_1.default('Please upload only one id picture', 400));
    }
    // Configure cloudinary
    cloudinary_1.v2.config({
        api_key: process.env.API_KEY,
        cloud_name: process.env.CLOUD_NAME,
        api_secret: process.env.API_SECRET,
    });
    try {
        // Upload and resize image using cloudinary
        const result = await cloudinary_1.v2.uploader.upload(files.idPicture[0].path, {
            transformation: {
                format: 'jpg',
            },
            folder: req.user.id,
        });
        // Update user profile picture and save
        req.idPicture = result.secure_url;
    }
    catch (err) {
        // Handle cloudinary upload errors
        return next(new appError_1.default(err.message, 500));
    }
    // Continue with the next middleware
    next();
};
exports.default = uploadId;
//# sourceMappingURL=uploadId.js.map