"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostsFromUserById = exports.getMyPosts = exports.getAllPosts = exports.getPostById = void 0;
const Post_1 = require("../../models/Post");
const appError_1 = __importDefault(require("../../utils/appError"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const handlerFactory_1 = require("../handlerFactory");
exports.getPostById = (0, catchAsync_1.default)(async (req, res, next) => {
    const post = await Post_1.Post.findById(req.params.id);
    if (!post) {
        return next(new appError_1.default('No post found with this id', 500));
    }
    res.status(200).json({
        status: 'success',
        post,
    });
});
exports.getAllPosts = (0, handlerFactory_1.getAll)(Post_1.Post);
exports.getMyPosts = (0, catchAsync_1.default)(async (req, res, next) => {
    req.query.user = req.user.id;
    next();
});
exports.getPostsFromUserById = (0, catchAsync_1.default)(async (req, res, next) => {
    req.query.user = req.params.id;
    next();
});
//# sourceMappingURL=getPost.js.map