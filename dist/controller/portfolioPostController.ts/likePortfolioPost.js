"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToggleLikePortfolioPost = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const appError_1 = __importDefault(require("../../utils/appError"));
const PortfolioPost_1 = require("../../models/PortfolioPost");
const Like_1 = require("../../models/Like");
exports.ToggleLikePortfolioPost = (0, catchAsync_1.default)(async (req, res, next) => {
    const post = await PortfolioPost_1.PortfolioPost.findById(req.params.id);
    if (!post) {
        return next(new appError_1.default('No portfolio post found with that id', 404));
    }
    const like = await Like_1.Like.findOne({
        userId: req.user.id,
        postId: post.id,
    });
    if (like) {
        await Like_1.Like.findByIdAndDelete(like.id);
        //   post.likes = post.likes - 1;
        post.likes--;
        await post.save({ validateBeforeSave: false });
        res.status(200).json({
            status: 'success',
            message: 'Like deleted successfully',
        });
    }
    else {
        const like = await Like_1.Like.create({
            userId: req.user.id,
            postId: post.id,
        });
        post.likes++;
        await post.save({ validateBeforeSave: false });
        res.status(200).json({
            status: 'success',
            message: 'Like created successfully',
            like,
        });
    }
});
//# sourceMappingURL=likePortfolioPost.js.map