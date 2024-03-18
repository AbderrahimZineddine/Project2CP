"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.savePost = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const Post_1 = require("../../models/Post");
const appError_1 = __importDefault(require("../../utils/appError"));
exports.savePost = (0, catchAsync_1.default)(async (req, res, next) => {
    const post = await Post_1.Post.findById(req.params.id);
    if (!post) {
        return next(new appError_1.default('No post found with id ' + req.params.id, 404));
    }
    const user = req.user;
    if (user.savedPosts) {
        if (user.savedPosts.includes(post.id)) {
            user.savedPosts = user.savedPosts.filter((p) => p != post.id);
            user.save({ validateBeforeSave: false });
            res.status(200).json({
                status: 'success',
                message: 'Post unsaved successfully',
            });
        }
        else {
            user.savedPosts.push(post.id);
            user.save({ validateBeforeSave: false });
            res.status(200).json({
                status: 'success',
                message: 'Post saved successfully',
            });
        }
    }
    else {
        user.savedPosts = [post.id];
        user.save({ validateBeforeSave: false });
        res.status(200).json({
            status: 'success',
            message: 'Post saved successfully',
        });
    }
});
//# sourceMappingURL=savePost.js.map