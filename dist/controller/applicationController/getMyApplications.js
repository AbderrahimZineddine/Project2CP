"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyApplicationsReceived = exports.getMyApplications = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const Application_1 = require("../../models/Application");
const Post_1 = require("../../models/Post");
// export const getMyApplications = catchAsync(
//   async (req: MyRequest, res: Response, next: NextFunction) => {
//     const Applications = await Application.find({ worker: req.user.id });
//     res.status(200).json({
//       status: 'success',
//       Applications,
//     });
//   }
// );
exports.getMyApplications = (0, catchAsync_1.default)(async (req, res, next) => {
    req.query.worker = req.user.id;
    next();
});
exports.getMyApplicationsReceived = (0, catchAsync_1.default)(async (req, res, next) => {
    // Get the ID of the authenticated user
    const userId = req.user._id;
    try {
        // Find posts belonging to the user
        const userPosts = await Post_1.Post.find({ user: userId });
        // Extract post IDs from userPosts
        const postIds = userPosts.map((post) => post._id);
        // Find applications associated with the user's posts
        const receivedApplications = await Application_1.Application.find({ post: { $in: postIds } }).populate('worker');
        res.status(200).json({
            status: 'success',
            data: receivedApplications,
        });
    }
    catch (error) {
        next(error);
    }
});
//# sourceMappingURL=getMyApplications.js.map