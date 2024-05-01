"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUser = exports.getAllUsers = void 0;
const appError_1 = __importDefault(require("../../utils/appError"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const User_1 = require("../../models/User");
const handlerFactory_1 = require("../handlerFactory");
const Post_1 = require("../../models/Post");
const Review_1 = require("../../models/Review");
exports.getAllUsers = (0, handlerFactory_1.getAll)(User_1.User);
exports.getUser = (0, catchAsync_1.default)(async (req, res, next) => {
    const user = await User_1.User.findById(req.params.id);
    // query = query.find({ _deletedAt: null });
    if (!user) {
        return next(new appError_1.default('no user found with that id', 404));
    }
    const { posts, reviews } = req.query;
    let postsData, reviewsData;
    if (posts) {
        postsData = await Post_1.Post.find({ user: user.id });
    }
    if (reviews) {
        reviewsData = await Review_1.Review.find({ user: user.id });
    }
    res.status(200).json({
        status: 'success',
        user,
        postsData,
        reviewsData,
    });
});
exports.createUser = (0, handlerFactory_1.createOne)(User_1.User);
exports.updateUser = (0, handlerFactory_1.updateOne)(User_1.User);
exports.deleteUser = (0, handlerFactory_1.deleteOne)(User_1.User);
//# sourceMappingURL=getAllUsers.js.map