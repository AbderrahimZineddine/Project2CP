"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appError_1 = __importDefault(require("../../utils/appError"));
const cloudinary_1 = require("cloudinary");
const uploadCertificates = async (req, res, next) => {
    // Check if file exists
    const files = req.files;
    if (!files ||
        !files.certificatesImages ||
        files.certificatesImages.length === 0) {
        return next();
    }
    // Configure cloudinary
    cloudinary_1.v2.config({
        api_key: process.env.API_KEY,
        cloud_name: process.env.CLOUD_NAME,
        api_secret: process.env.API_SECRET,
    });
    try {
        const titles = req.body.certificatesTitles;
        console.log(titles);
        console.log(titles.length);
        // console.log(req.files)
        // console.log(files.profilePicture);
        // console.log(files.certificatesImages);
        if (titles instanceof Array &&
            titles.length != files.certificatesImages.length) {
            return next(new appError_1.default('Please make sure to upload each certificate with a title', 400));
        }
        let certificates = [];
        if (titles instanceof Array) {
            let i = 0;
            // Upload and resize image using cloudinary
            const uploadPromises = files.certificatesImages.map(async (file) => {
                const result = await cloudinary_1.v2.uploader.upload(file.path, {
                    transformation: {
                        format: 'jpg',
                    },
                    folder: req.user.id,
                });
                i++;
                return {
                    title: titles[i - 1] ?? file.originalname,
                    image: result.secure_url,
                };
            });
            // Update user profile picture and save
            certificates = await Promise.all(uploadPromises);
        }
        else {
            const result = await cloudinary_1.v2.uploader.upload(files.certificatesImages[0].path, {
                transformation: {
                    format: 'jpg',
                },
                folder: req.user.id,
            });
            certificates.push({
                title: titles,
                image: result.secure_url,
            });
        }
        req.certificates = certificates;
        console.log(certificates);
        next();
    }
    catch (err) {
        // Handle cloudinary upload errors
        console.log(err);
        return next(new appError_1.default('Error while uploading the files', 500));
    }
};
exports.default = uploadCertificates;
//# sourceMappingURL=uploadCertificate.js.map