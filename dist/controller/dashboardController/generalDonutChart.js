"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applicationGeneralDonutChart = exports.applicationPerJobCategory = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const Application_1 = require("../../models/Application");
// Helper function to format date as "MMM DD" (e.g., "Jan 23")
exports.applicationPerJobCategory = (0, catchAsync_1.default)(async (req, res) => {
    const data = await Application_1.Application.aggregate([
        {
            // $lookup: {
            //   from: 'workers',
            //   localField: 'worker',
            //   foreignField: '_id',
            //   as: 'workerData',
            // },
            $lookup: {
                from: 'users',
                localField: 'worker',
                foreignField: '_id',
                as: 'workerData',
            },
        },
        { $unwind: '$workerData' },
        {
            $group: {
                _id: '$workerData.job',
                count: { $sum: 1 },
            },
        },
    ]);
    res.status(200).json({
        status: 'success',
        data,
    });
});
exports.applicationGeneralDonutChart = (0, catchAsync_1.default)(async (req, res) => {
    const data = await Application_1.Application.aggregate([]);
    res.status(200).json({
        status: 'success',
        data,
    });
});
//# sourceMappingURL=generalDonutChart.js.map