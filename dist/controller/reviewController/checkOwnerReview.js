"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkOwnerReview = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const appError_1 = __importDefault(require("../../utils/appError"));
const Review_1 = require("../../models/Review");
exports.checkOwnerReview = (0, catchAsync_1.default)(async (req, res, next) => {
    const review = await Review_1.Review.findById(req.params.id);
    if (!review) {
        return next(new appError_1.default('No review found with that id!', 404));
    }
    console.log(req.user.id);
    console.log(review.user.toString());
    console.log(review.worker);
    if (req.user.id != review.user.toString()) {
        return next(new appError_1.default('You do not have the permission to update this review!', 404));
    }
    req.review = review;
    next();
});
//# sourceMappingURL=checkOwnerReview.js.map