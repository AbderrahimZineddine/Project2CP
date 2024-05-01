"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkSentApplication = exports.checkOwnerApplication = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const appError_1 = __importDefault(require("../../utils/appError"));
const Application_1 = require("../../models/Application");
const Post_1 = require("../../models/Post");
exports.checkOwnerApplication = (0, catchAsync_1.default)(async (req, res, next) => {
    const application = await Application_1.Application.findById(req.params.id);
    if (!application) {
        return next(new appError_1.default('No Application found with that id!', 404));
    }
    console.log(req.user.id);
    console.log(application.worker);
    if (application.worker.id != req.user.id) {
        return next(new appError_1.default('You do not have the permission to update this Application!', 404));
    }
    req.application = application;
    next();
});
exports.checkSentApplication = (0, catchAsync_1.default)(async (req, res, next) => {
    const application = await Application_1.Application.findById(req.params.id);
    if (!application) {
        return next(new appError_1.default('No Application found with that id!', 404));
    }
    const post = await Post_1.Post.findById(application.post);
    if (!post) {
        return next(new appError_1.default('No Post found with that id! (post in application not found)', 404));
    }
    console.log('req.user.id : ', req.user.id);
    console.log('post.user.id : ', post.user.id);
    if (req.user.id != post.user.id) {
        return next(new appError_1.default('You do not have the permission to update this Application!', 404));
    }
    req.application = application;
    next();
});
//# sourceMappingURL=checkOwnerApplication.js.map