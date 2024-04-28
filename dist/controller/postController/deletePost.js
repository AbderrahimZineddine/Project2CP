"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePostById = void 0;
const uploadController_1 = __importDefault(require("../uploadController"));
const Post_1 = require("../../models/Post");
const appError_1 = __importDefault(require("../../utils/appError"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
exports.deletePostById = (0, catchAsync_1.default)(async (req, res, next) => {
    const post = await Post_1.Post.findById(req.params.id);
    if (!post) {
        return next(new appError_1.default('No portfolio post found with that id', 404));
    }
    for (const url of post.images) {
        await uploadController_1.default.deleteFromCloudinary(url);
    }
    // await Post.findByIdAndDelete(post.id);
    await Post_1.Post.findByIdAndUpdate(req.params.id, { _deletedAt: Date.now() }, { new: true });
    res.status(200).json({
        status: 'success',
    });
});
//# sourceMappingURL=deletePost.js.map