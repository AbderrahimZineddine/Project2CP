"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.workerTotal = exports.workersPerJob = exports.workersPerWilaya = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const Worker_1 = require("../../models/Worker");
const Deal_1 = require("../../models/Deal");
const Review_1 = require("../../models/Review");
exports.workersPerWilaya = (0, catchAsync_1.default)(async (req, res) => {
    const data = await Worker_1.Worker.aggregate([
        {
            $group: {
                _id: '$wilaya',
                count: { $sum: 1 },
            },
        },
    ]);
    res.status(200).json({
        status: 'success',
        data,
    });
});
exports.workersPerJob = (0, catchAsync_1.default)(async (req, res) => {
    const data = await Worker_1.Worker.aggregate([
        {
            $group: {
                _id: '$job',
                count: { $sum: 1 },
            },
        },
    ]);
    res.status(200).json({
        status: 'success',
        data,
    });
});
exports.workerTotal = (0, catchAsync_1.default)(async (req, res, next) => {
    // Count the total number of applications
    const totalWorkers = await Worker_1.Worker.countDocuments();
    // Find the total number of distinct workers
    const totalReviews = await Review_1.Review.countDocuments();
    const totalDeals = await Deal_1.Deal.countDocuments();
    // Calculate the average applications per worker
    const averageReviews = totalReviews / totalWorkers;
    const averageDeals = totalDeals / totalWorkers;
    res.status(200).json({
        status: 'success',
        data: {
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
            // {
            //   _id: 'Average deals per worker',
            //   count: averageDeals,
            // },
            averageDealsPerWorker: averageDeals,
        },
    });
});
//# sourceMappingURL=workerDashboard.js.map