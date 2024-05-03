"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applicationGeneralDonutChart = exports.GeneralDonutChart1 = exports.applicationPerJobCategory = void 0;
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
// export const applicationGeneralDonutChart = catchAsync(
//   async (req: MyRequest, res: Response) => {
//     const data = await Application.aggregate([
//       {
//         $group: {
//           _id: null,
//           created: {
//             $sum: {
//               $cond: [{ $lte: ['$createdAt', new Date()] }, 1, 0], // Count applications with createdAt >= current date
//             },
//           },
//           // accepted: {
//           //   $sum: {
//           //     $cond: [
//           //       {
//           //         $and: [
//           //           { $ne: ['$_acceptedAt', null] },
//           //           { $lte: ['$_acceptedAt', new Date()] },
//           //         ],
//           //       }, // Count applications with _acceptedAt set and less than or equal to current date (accepted)
//           //       1,
//           //       0,
//           //     ],
//           //   },
//           // },
//           // declined: {
//           //   $sum: {
//           //     $cond: [
//           //       {
//           //         $and: [
//           //           { $ifNull: ['$_deletedAt', false] }, // Check if _acceptedAt exists or is null
//           //           { $lte: ['$_deletedAt', new Date()] },
//           //           { $eq: ['$_acceptedAt', null] }, // Check if _acceptedAt exists or is null
//           //         ],
//           //       },
//           //       1,
//           //       0,
//           //     ], // Count applications with deletedAt <= current date and acceptedAt = null
//           //   },
//           // },
//         },
//       },
//       {
//         $project: {
//           _id: 0, // Exclude the _id field from the output
//           data: [
//             { _id: 'Created', count: '$created' }, // Format data for Created status
//             // { _id: 'Accepted', count: '$accepted' }, // Format data for Accepted status
//             // { _id: 'Declined', count: '$declined' }, // Format data for Declined status
//           ],
//         },
//       },
//     ]);
//     res.status(200).json({
//       status: 'success',
//       data: data.length > 0 ? data[0].data : [], // Return the formatted data or an empty array if no data found
//     });
//   }
// );
const GeneralDonutChart1 = (model) => async (req, res) => {
    const created = await model.countDocuments();
    const deleted = await model.countDocuments({
        _deletedAt: { $ne: null },
    });
    res.status(200).json({
        status: 'success',
        data: {
            created,
            deleted,
        },
    });
};
exports.GeneralDonutChart1 = GeneralDonutChart1;
exports.applicationGeneralDonutChart = (0, catchAsync_1.default)(async (req, res) => {
    const created = await Application_1.Application.countDocuments();
    const accepted = await Application_1.Application.countDocuments({
        _acceptedAt: { $ne: null },
    });
    const deleted = await Application_1.Application.countDocuments({
        _acceptedAt: { $eq: null },
        _deletedAt: { $ne: null },
    });
    res.status(200).json({
        status: 'success',
        data: {
            created,
            accepted,
            deleted,
        },
    });
});
//# sourceMappingURL=generalDonutChart.js.map