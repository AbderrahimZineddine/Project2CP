"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReview = exports.ValidateReviewInputs = void 0;
const Review_1 = require("../../models/Review");
const appError_1 = __importDefault(require("../../utils/appError"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const Deal_1 = require("../../models/Deal");
const Notification_1 = require("../../models/Notification");
const deletePost_1 = require("../../controller/postController/deletePost");
exports.ValidateReviewInputs = (0, catchAsync_1.default)(async (req, res, next) => {
    if (!req.body.rating) {
        return next(new appError_1.default('A review must have a rating!', 400));
    }
    const deal = await Deal_1.Deal.findById(req.params.id);
    if (!deal) {
        return next(new appError_1.default('There is no deal with id : ' + req.params.id, 404));
    }
    if (!(deal.status === Deal_1.DealStatus.Finished)) {
        return next(new appError_1.default('this deal is not finished yet ', 400));
    }
    // if (
    //   await Review.findOne({ user: req.user.id, worker: (deal as any).worker })
    // ) {
    //   return next(
    //     new AppError('You already left a Review with for this worker!', 400)
    //   );
    // }
    req.deal = deal;
    next();
});
exports.createReview = (0, catchAsync_1.default)(async (req, res, next) => {
    const review = await Review_1.Review.create({
        user: req.user.id,
        worker: req.deal.worker,
        review: req.body.review,
        rating: req.body.rating,
    });
    if (!review) {
        return next(new appError_1.default('Error creating your Review! Please try again later.', 500));
    }
    //TODO : delete stuff after leaving review:  post, deal ....
    req.deal._deletedAt = new Date(Date.now());
    await req.deal.save();
    // await Post.findByIdAndUpdate(
    //   req.deal.post,
    //   {
    //     _deletedAt: new Date(Date.now()),
    //   },
    //   { new: true }
    // );
    (0, deletePost_1.deletePostById2)(req.deal.post.toString(), req.user.name, next);
    await Notification_1.Notification.create({
        receiverId: review.worker,
        dataModel: Notification_1.NotificationDataModel.Review,
        data: review.id,
        title: 'New Review',
        body: `${req.user.name} left a review`,
        type: Notification_1.NotificationType.NewReview,
    });
    res.status(201).json({
        status: 'success',
        review,
    });
});
//# sourceMappingURL=createReview.js.map