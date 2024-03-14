"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePortfolioPost = void 0;
const catchAsync_1 = __importDefault(require("../../../utils/catchAsync"));
const appError_1 = __importDefault(require("../../../utils/appError"));
const PortfolioPost_1 = require("../../../models/PortfolioPost");
const uploadController_1 = __importDefault(require("../../../controller/uploadController"));
exports.updatePortfolioPost = (0, catchAsync_1.default)(async (req, res, next) => {
    // add new images
    // delete removed images
    // edit description
    const post = await PortfolioPost_1.PortfolioPost.findById(req.params.id);
    if (!post) {
        return next(new appError_1.default('No portfolio post found with that id', 404));
    }
    if (req.body.description) {
        post.description = req.body.description;
    }
    let urls = post.images;
    const removed = req.body.removedPicturesUrls
        ? req.body.removedPicturesUrls instanceof Array
            ? req.body.removedPicturesUrls.length
            : 1
        : 0;
    const added = req.images ? req.images.length : 0;
    if (removed > urls.length) {
        return next(new appError_1.default('Error, you are trying to remove more images than you have in this post!', 400));
    }
    if (urls.length - removed + added < 1) {
        if (req.images) {
            for (const url of req.images) {
                await uploadController_1.default.deleteFromCloudinary(url);
            }
        }
        return next(new appError_1.default('You must have at least one image in your post!', 400));
    }
    console.log(req.body.removedPicturesUrls);
    if (req.body.removedPicturesUrls) {
        urls = urls.filter((url) => !req.body.removedPicturesUrls.includes(url));
        // for (const url in req.body.removedPicturesUrls) {
        if (req.body.removedPicturesUrls instanceof Array) {
            for (let i = 0; i < req.body.removedPicturesUrls.length; i++) {
                try {
                    await uploadController_1.default.deleteFromCloudinary(req.body.removedPicturesUrls[i]);
                }
                catch (error) {
                    if (process.env.NODE_ENV !== 'production') {
                        return next(new appError_1.default('Error deleting pictures from cloudinary : ' + error.message, 500));
                    }
                }
            }
        }
        else {
            try {
                console.log(typeof req.body.removedPicturesUrls);
                await uploadController_1.default.deleteFromCloudinary(req.body.removedPicturesUrls);
            }
            catch (error) {
                if (process.env.NODE_ENV !== 'production') {
                    return next(new appError_1.default('Error deleting pictures from cloudinary : ' + error.message, 500));
                }
            }
        }
    }
    if (req.images) {
        urls = urls.concat(req.images);
    }
    post.images = urls;
    await post.save();
    res.status(200).json({
        statusbar: 'success',
        portfolioPost: post,
    });
});
//# sourceMappingURL=updatePortfolioPost.js.map