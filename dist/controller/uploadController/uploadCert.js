"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appError_1 = __importDefault(require("../../utils/appError"));
const cloudinary_1 = require("cloudinary");
const uploadCertificate = async (req, res, next) => {
    // Check if file exists
    const file = req.file;
    if (!file) {
        return next(new appError_1.default('Certificate image not found', 404)); //404 ??
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
                format: 'jpg',
            },
            folder: req.user.id,
        });
        // Update user profile picture and save
        req.certificate = result.secure_url;
    }
    catch (err) {
        // Handle cloudinary upload errors
        return next(new appError_1.default(err.message, 500));
    }
    // Continue with the next middleware
    next();
};
exports.default = uploadCertificate;
//# sourceMappingURL=uploadCert.js.map