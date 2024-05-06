"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRequestById = exports.getMyRequests = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const Application_1 = require("../../models/Application");
const appError_1 = __importDefault(require("../../utils/appError"));
const Post_1 = require("../../models/Post");
exports.getMyRequests = (0, catchAsync_1.default)(async (req, res, next) => {
    const posts = await Post_1.Post.find({
        selectedWorkers: { $in: [req.user.id] },
    });
    const data = await Promise.all(posts.map(async (post) => {
        const applied = await Application_1.Application.findOne({
            worker: req.user.id,
            post: post._id, // Assuming `savedPosts` contains objects with `_id` properties
        });
        const isSaved = req.user.savedPosts.includes(post._id);
        return {
            post,
            application: {
                id: applied.id,
                applied: applied != null,
            },
            isSaved,
        };
    }));
    res.status(200).json({
        status: 'success',
        results: data.length,
        data,
    });
});
exports.deleteRequestById = (0, catchAsync_1.default)(async (req, res, next) => {
    const post = await Post_1.Post.findById(req.params.id);
    if (!post) {
        return next(new appError_1.default('No post found with id ' + req.params.id, 404));
    }
    if (post.selectedWorkers.includes(req.user.id)) {
        post.selectedWorkers = post.selectedWorkers.filter((workerId) => workerId.toString() !== req.user.id);
        await post.save({ validateBeforeSave: false });
    }
    res.status(200).json({
        status: 'success',
        message: 'Request deleted successfully',
    });
});
//# sourceMappingURL=getMyRequests.js.map