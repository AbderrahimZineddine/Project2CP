"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPost = exports.ValidatePostInputs = void 0;
const Post_1 = require("../../models/Post");
const WorkerDoc_1 = require("../../models/WorkerDoc");
const appError_1 = __importDefault(require("../../utils/appError"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const uploadController_1 = __importDefault(require("../uploadController"));
exports.ValidatePostInputs = (0, catchAsync_1.default)(async (req, res, next) => {
    if (!req.body.title) {
        return next(new appError_1.default('Please enter a title for this post', 400));
    }
    if (!req.body.job || !(req.body.job in WorkerDoc_1.Job)) {
        return next(new appError_1.default('Please specify a job for this post', 400));
    }
    next();
});
exports.createPost = (0, catchAsync_1.default)(async (req, res, next) => {
    const post = await Post_1.Post.create({
        images: req.images,
        description: req.body.description,
        price: req.body.price,
        title: req.body.title,
        job: req.body.job,
        user: req.user.id,
        selectedWorkers: req.body.selectedWorkers,
    });
    if (!post) {
        if (req.images) {
            for (const image of req.images) {
                await uploadController_1.default.deleteFromCloudinary(image);
            }
        }
        return next(new appError_1.default('Error creating your Post! Please try again later', 500));
    }
    res.status(200).json({
        status: 'success',
        post,
    });
});
//# sourceMappingURL=createPost.js.map