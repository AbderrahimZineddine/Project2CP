"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePostById2 = exports.deletePostById = void 0;
const uploadController_1 = __importDefault(require("../uploadController"));
const Post_1 = require("../../models/Post");
const appError_1 = __importDefault(require("../../utils/appError"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const Deal_1 = require("../../models/Deal");
const Application_1 = require("../../models/Application");
const Notification_1 = require("../../models/Notification");
exports.deletePostById = (0, catchAsync_1.default)(async (req, res, next) => {
    if (await Deal_1.Deal.findOne({ post: req.params.id })) {
        return next(new appError_1.default('You cannot delete a post linked with a deal!', 404));
    }
    const post = await Post_1.Post.findById(req.params.id);
    if (!post) {
        return next(new appError_1.default('No post found with that id', 404));
    }
    for (const url of post.images) {
        await uploadController_1.default.deleteFromCloudinary(url);
    }
    // await Post.findByIdAndDelete(post.id);
    const applications = await Application_1.Application.find({ post: req.params.id });
    for (const app of applications) {
        app._deletedAt = new Date(Date.now());
        app.save();
        await Notification_1.Notification.create({
            receiverId: app.worker,
            dataModel: Notification_1.NotificationDataModel.Post,
            data: post.id,
            title: 'Application declined!',
            body: `${req.user.name} declined your application!`,
            type: Notification_1.NotificationType.ApplicationDeclined,
        });
    }
    await Post_1.Post.findByIdAndUpdate(req.params.id, { _deletedAt: new Date(Date.now()) }, { new: true });
    res.status(200).json({
        status: 'success',
    });
});
const deletePostById2 = async (id, name, next) => {
    try {
        if (await Deal_1.Deal.findOne({ post: id })) {
            return next(new appError_1.default('You cannot delete a post linked with a deal!', 404));
        }
        const post = await Post_1.Post.findById(id);
        if (!post) {
            return next(new appError_1.default('No post found with that id', 404));
        }
        for (const url of post.images) {
            await uploadController_1.default.deleteFromCloudinary(url);
        }
        // await Post.findByIdAndDelete(post.id);
        const applications = await Application_1.Application.find({ post: id });
        for (const app of applications) {
            app._deletedAt = new Date(Date.now());
            app.save();
            await Notification_1.Notification.create({
                receiverId: app.worker,
                dataModel: Notification_1.NotificationDataModel.Post,
                data: post.id,
                title: 'Application declined!',
                body: `${name} declined your application!`,
                type: Notification_1.NotificationType.ApplicationDeclined,
            });
        }
        await Post_1.Post.findByIdAndUpdate(id, { _deletedAt: new Date(Date.now()) }, { new: true });
    }
    catch (error) {
        new appError_1.default(`Error deleting post! error : ${error.message}`, 500);
    }
};
exports.deletePostById2 = deletePostById2;
//# sourceMappingURL=deletePost.js.map