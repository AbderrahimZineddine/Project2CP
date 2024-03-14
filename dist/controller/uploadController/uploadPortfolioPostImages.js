"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const appError_1 = __importDefault(require("../../utils/appError"));
const cloudinary_1 = require("cloudinary");
const uploadController_1 = __importDefault(require("../../controller/uploadController"));
const uploadPortfolioPostImages = (0, catchAsync_1.default)(async (req, res, next) => {
    if (!req.files) {
        // return next(
        //   new AppError('Please upload at least one image for this post', 404)
        // );
        return next();
    }
    cloudinary_1.v2.config({
        api_key: process.env.API_KEY,
        cloud_name: process.env.CLOUD_NAME,
        api_secret: process.env.API_SECRET,
    });
    const urls = [];
    try {
        // const errMsgs = [];
        for (const file of req.files) {
            //   try {
            const result = await cloudinary_1.v2.uploader.upload(file.path, {
                transformation: {
                    format: 'jpg',
                },
                folder: req.user.id,
            });
            urls.push(result.secure_url);
            //   } catch (error) {
            //     errMsgs.push(`Error uploading Image : ${error.message}`);
            //   }
        }
        // if (errMsgs.length > 0 && process.env.NODE_ENV !== 'development') {
        //   let message = '';
        //   for (const errM of errMsgs) {
        //     message += errM + '\n';
        //   }
        //   return next(new AppError(message, 500));
        // } else if (errMsgs.length > 0) {
        //   for (const url of urls) {
        //     await uploadController.deleteFromCloudinary(url);
        //   }
        //   return next(
        //     new AppError('Error uploading images please try again!', 500)
        //   );
        // }
        req.images = urls;
        next();
    }
    catch (error) {
        for (const url of urls) {
            await uploadController_1.default.deleteFromCloudinary(url);
        }
        return next(new appError_1.default('Error uploading images please try again!', 500));
    }
});
exports.default = uploadPortfolioPostImages;
//# sourceMappingURL=uploadPortfolioPostImages.js.map