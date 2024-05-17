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
const Notification_1 = require("../../models/Notification");
const Worker_1 = require("../../models/Worker");
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
        const worker = await Worker_1.Worker.findOne({
            portfolioPosts: { $in: [post.id] },
        });
        if (worker) {
            await Notification_1.Notification.create({
                receiverId: worker.id,
                dataModel: Notification_1.NotificationDataModel.PortfolioPost,
                data: post.id,
                title: 'Liked your post',
                body: `${req.user.name} liked your post`,
                type: Notification_1.NotificationType.PostLiked,
            });
        }
        res.status(200).json({
            status: 'success',
            message: 'Like created successfully',
            like,
        });
    }
});
//# sourceMappingURL=likePortfolioPost.js.map