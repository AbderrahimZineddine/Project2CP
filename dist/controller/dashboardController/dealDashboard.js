"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dealTotal = exports.dealGeneralDonutChart = void 0;
const Deal_1 = require("../../models/Deal");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const User_1 = require("../../models/User");
const Worker_1 = require("../../models/Worker");
exports.dealGeneralDonutChart = (0, catchAsync_1.default)(async (req, res) => {
    const created = await Deal_1.Deal.countDocuments();
    const finished = await Deal_1.Deal.countDocuments({
        _finishedAt: { $ne: null },
    });
    const declined = await Deal_1.Deal.countDocuments({
        _finishedAt: { $eq: null },
        _deletedAt: { $ne: null },
    });
    res.status(200).json({
        status: 'success',
        data: [
            {
                _id: 'created',
                count: created,
            },
            {
                _id: 'finished',
                count: finished,
            },
            {
                _id: 'declined',
                count: declined,
            },
        ],
    });
});
exports.dealTotal = (0, catchAsync_1.default)(async (req, res, next) => {
    // Count the total number of applications
    const totalUsers = await User_1.User.countDocuments();
    const totalWorkers = await Worker_1.Worker.countDocuments();
    // Find the total number of distinct workers
    const totalDeals = await Deal_1.Deal.countDocuments();
    // Calculate the average applications per worker
    const averageDeals = totalDeals / totalUsers;
    const averageDeals2 = totalDeals / totalWorkers;
    res.status(200).json({
        status: 'success',
        data: {
            // {
            //   _id: 'Created',
            //   count: totalDeals,
            // },
            created: totalDeals,
            // {
            //   _id: 'Average deal per user',
            //   count: averageDeals,
            // },
            averageDealPerUser: averageDeals,
            // {
            //   _id: 'Average deal per worker',
            //   count: averageDeals2,
            // },
            averageDealPerWorker: averageDeals2,
        },
    });
});
//# sourceMappingURL=dealDashboard.js.map