"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReview = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
exports.updateReview = (0, catchAsync_1.default)(async (req, res, next) => {
    if (req.body.review) {
        req.review.review = req.body.review;
    }
    if (req.body.rating) {
        if (req.body.rating < 0 || req.body.rating > 5) {
            return next('Rating must be between 0 and 5');
        }
        // const worker: WorkerDoc = await Worker.findById(req.review.worker);
        // worker.rating =
        //   (req.body.rating - req.review.rating + worker.rating) /
        //   worker.ratingsNumber;
        // await worker.save({validateModifiedOnly:  true});
        req.review.rating = req.body.rating;
    }
    await req.review.save({ validateBeforeSave: true });
    res.status(200).json({
        status: 'success',
        review: req.review,
    });
});
//# sourceMappingURL=updateReview.js.map