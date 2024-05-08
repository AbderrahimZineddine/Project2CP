"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyPost = exports.ValidateApplicationInputs = void 0;
const Application_1 = require("../../models/Application");
const appError_1 = __importDefault(require("../../utils/appError"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const Post_1 = require("../../models/Post");
const Deal_1 = require("../../models/Deal");
exports.ValidateApplicationInputs = (0, catchAsync_1.default)(async (req, res, next) => {
    if (!req.body.description) {
        return next(new appError_1.default('Please enter a description for this application', 400));
    }
    console.log(req);
    const post = await Post_1.Post.findById(req.params.id);
    if (!post) {
        return next(new appError_1.default('There is no post with id ' + req.params.id, 404));
    }
    if (await Application_1.Application.findOne({ worker: req.user.id, post: post.id })) {
        return next(new appError_1.default('You have already applied for this post!', 400));
    }
    if (await Deal_1.Deal.findOne({ worker: req.user.id, post: post.id })) {
        return next(new appError_1.default('You already have a deal with this post!', 400));
    }
    req.post = post;
    next();
});
exports.applyPost = (0, catchAsync_1.default)(async (req, res, next) => {
    const application = await Application_1.Application.create({
        description: req.body.description,
        price: req.body.price,
        worker: req.user.id,
        post: req.post.id,
    });
    if (!application) {
        return next(new appError_1.default('Error creating your application! Please try again later.', 500));
    }
    res.status(201).json({
        status: 'success',
        application,
    });
});
//# sourceMappingURL=applyPost.js.map