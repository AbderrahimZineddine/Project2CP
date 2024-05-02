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
    const data = await Application_1.Application.aggregate([
        {
            $group: {
                _id: null,
                created: {
                    $sum: {
                        $cond: [{ $lte: ['$createdAt', new Date()] }, 1, 0], // Count applications with createdAt >= current date
                    },
                },
                accepted: {
                    $sum: {
                        $cond: [
                            {
                                $and: [
                                    { $lte: ['$_acceptedAt', new Date()] },
                                    { $ifNull: ['$_acceptedAt', false] }, // Check if _acceptedAt exists or is null
                                ],
                            },
                            1,
                            0,
                        ],
                    },
                },
                declined: {
                    $sum: {
                        $cond: [
                            {
                                $and: [
                                    { $ifNull: ['$_deletedAt', false] }, // Check if _acceptedAt exists or is null
                                    { $lte: ['$_deletedAt', new Date()] },
                                    { $eq: ['$_acceptedAt', null] }, // Check if _acceptedAt exists or is null
                                ],
                            },
                            1,
                            0,
                        ], // Count applications with deletedAt <= current date and acceptedAt = null
                    },
                },
            },
        },
        {
            $project: {
                _id: 0, // Exclude the _id field from the output
                data: [
                    { _id: 'Created', count: '$created' }, // Format data for Created status
                    { _id: 'Accepted', count: '$accepted' }, // Format data for Accepted status
                    { _id: 'Declined', count: '$declined' }, // Format data for Declined status
                ],
            },
        },
    ]);
    res.status(200).json({
        status: 'success',
        data: data.length > 0 ? data[0].data : [], // Return the formatted data or an empty array if no data found
    });
});
//# sourceMappingURL=generalDonutChart.js.map