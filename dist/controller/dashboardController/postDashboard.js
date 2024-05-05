"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postTotal = exports.postsPerJob = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const Post_1 = require("../../models/Post");
const User_1 = require("../../models/User");
exports.postsPerJob = (0, catchAsync_1.default)(async (req, res) => {
    const data = await Post_1.Post.aggregate([
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
exports.postTotal = (0, catchAsync_1.default)(async (req, res, next) => {
    // Count the total number of applications
    const totalUsers = await User_1.User.countDocuments();
    // const totalWorkers = await Worker.countDocuments();
    // Find the total number of distinct workers
    const totalPosts = await Post_1.Post.countDocuments();
    // Calculate the average applications per worker
    const averagePosts = totalPosts / totalUsers;
    // const averagePosts2 = totalPosts / totalWorkers;
    res.status(200).json({
        status: 'success',
        data: {
            // {
            //   _id: 'Created',
            //   count: totalPosts,
            // },
            created: totalPosts,
            // {
            //   _id: 'Average post per user',
            //   count: averagePosts,
            // },
            averagePostPerUser: averagePosts,
            // {
            //   _id: 'Average post per worker',
            //   count: averagePosts2,
            // },
        },
    });
});
//# sourceMappingURL=postDashboard.js.map