"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyPostsApplications = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const Application_1 = require("../../models/Application");
exports.getMyPostsApplications = (0, catchAsync_1.default)(async (req, res, next) => {
    //call checkPostOwner middleware
    const Applications = await Application_1.Application.find({ post: req.post.id });
    res.status(200).json({
        status: 'success',
        Applications,
    });
});
//# sourceMappingURL=getMyPostsApplications.js.map