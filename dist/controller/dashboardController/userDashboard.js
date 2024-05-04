"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userTotal = exports.usersPerWilaya = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const User_1 = require("../../models/User");
const Post_1 = require("../../models/Post");
const Deal_1 = require("../../models/Deal");
exports.usersPerWilaya = (0, catchAsync_1.default)(async (req, res) => {
    const data = await User_1.User.aggregate([
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
exports.userTotal = (0, catchAsync_1.default)(async (req, res, next) => {
    // Count the total number of applications
    const totalUsers = await User_1.User.countDocuments();
    // Find the total number of distinct workers
    const totalPosts = await Post_1.Post.countDocuments();
    const totalDeals = await Deal_1.Deal.countDocuments();
    // Calculate the average applications per worker
    const averagePosts = totalPosts / totalUsers;
    const averageDeals = totalDeals / totalUsers;
    res.status(200).json({
        status: 'success',
        total: {
            // {
            //   _id: 'Created',
            //   count: totalUsers,
            // },
            created: totalUsers,
            // {
            //   _id: 'Average post per user',
            //   count: averagePosts,
            // },
            averagePostPerUser: averagePosts,
            // {
            //   _id: 'Average deals per user',
            //   count: averageDeals,
            // },
            averageDealPerUser: averageDeals,
        },
    });
});
//# sourceMappingURL=userDashboard.js.map