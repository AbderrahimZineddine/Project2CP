"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePost = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const appError_1 = __importDefault(require("../../utils/appError"));
const Post_1 = require("../../models/Post");
const uploadController_1 = __importDefault(require("../uploadController"));
const Worker_1 = require("../../models/Worker");
exports.updatePost = (0, catchAsync_1.default)(async (req, res, next) => {
    // add new images
    // delete removed images
    // edit description
    let urls = req.post.images;
    const removed = req.body.removedPicturesUrls
        ? req.body.removedPicturesUrls instanceof Array
            ? req.body.removedPicturesUrls.length
            : 1
        : 0;
    if (removed > urls.length) {
        return next(new appError_1.default('Error, you are trying to remove more images than you have in this post!', 400));
    }
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
    req.post.images = urls;
    await req.post.save({ validateBeforeSave: false });
    req.post = await Post_1.Post.findByIdAndUpdate(req.params.id, {
        job: req.body.job,
        description: req.body.description,
        price: req.body.price,
        title: req.body.title,
        'location.lat': req.body.lat,
        'location.lng': req.body.lng,
        'location.title': req.body.locationTitle,
    }, { new: true, runValidators: true });
    // if (! req.body.selectedWorkers) {
    //   return next(new AppError('no worker has been selected', 400));
    // }
    if (req.body.selectedWorkers) {
        let newList = [];
        if (!Array.isArray(req.body.selectedWorkers)) {
            newList.push(req.body.selectedWorkers);
        }
        else {
            for (const id of req.body.selectedWorkers) {
                console.log(id);
                const work = await Worker_1.Worker.findById(id);
                if (work) {
                    newList.push(work._id);
                }
            }
        }
        if (req.post.selectedWorkers && req.post.selectedWorkers.length > 0) {
            for (const id of newList) {
                req.post.selectedWorkers.push(id);
            }
        }
        else {
            req.post.selectedWorkers = newList;
        }
        await req.post.save({ validateBeforeSave: false });
    }
    res.status(200).json({
        status: 'success',
        post: req.post,
    });
});
//# sourceMappingURL=updatePost.js.map