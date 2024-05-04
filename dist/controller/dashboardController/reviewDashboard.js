"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewTotal = exports.reviewsByRating = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const Review_1 = require("../../models/Review");
const Worker_1 = require("../../models/Worker");
exports.reviewsByRating = (0, catchAsync_1.default)(async (req, res) => {
    const data = await Review_1.Review.aggregate([
        {
            $group: {
                _id: '$rating',
                count: { $sum: 1 },
            },
        },
    ]);
    res.status(200).json({
        status: 'success',
        data,
    });
});
exports.reviewTotal = (0, catchAsync_1.default)(async (req, res, next) => {
    // Count the total number of applications
    const totalWorkers = await Worker_1.Worker.countDocuments();
    // Find the total number of distinct workers
    const totalReviews = await Review_1.Review.countDocuments();
    // Calculate the average applications per worker
    const averageReviews = totalReviews / totalWorkers;
    res.status(200).json({
        status: 'success',
        total: {
            // {
            //   _id: 'Created',
            //   count: totalWorkers,
            // },
            created: totalWorkers,
            // {
            //   _id: 'Average review per worker',
            //   count: averageReviews,
            // },
            averageReviewPerWorker: averageReviews,
        },
    });
});
//# sourceMappingURL=reviewDashboard.js.map