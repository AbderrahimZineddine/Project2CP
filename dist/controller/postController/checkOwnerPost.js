"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkOwnerPost = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const appError_1 = __importDefault(require("../../utils/appError"));
const Post_1 = require("../../models/Post");
exports.checkOwnerPost = (0, catchAsync_1.default)(async (req, res, next) => {
    const post = await Post_1.Post.findById(req.params.id);
    if (!post) {
        return next(new appError_1.default('No post found with that id!', 404));
    }
    if (post.user != req.user.id) {
        return next(new appError_1.default('You do not have the permission to access this post!', 404));
    }
    req.post = post;
    next();
});
//# sourceMappingURL=checkOwnerPost.js.map