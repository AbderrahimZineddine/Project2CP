"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReview = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const Worker_1 = require("../../models/Worker");
const Review_1 = require("../../models/Review");
exports.deleteReview = (0, catchAsync_1.default)(async (req, res, next) => {
    const worker = await Worker_1.Worker.findById(req.review.worker);
    worker.ratingsNumber--;
    worker.rating =
        worker.ratingsNumber != 0
            ? (worker.rating * worker.ratingsNumber + 1 - req.review.rating) / worker.ratingsNumber
            : 0;
    await worker.save({ validateBeforeSave: false });
    // await Review.findByIdAndDelete(req.review.id);
    await Review_1.Review.findByIdAndUpdate(req.params.id, { _deletedAt: Date.now() }, { new: true });
    res.status(200).json({
        status: 'success',
    });
});
//# sourceMappingURL=deleteReview.js.map