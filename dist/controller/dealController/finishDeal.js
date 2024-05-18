"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.finishDealAccept = exports.finishDealDecline = exports.finishDealRequest = void 0;
const Deal_1 = require("../../models/Deal");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const UserDoc_1 = require("../../models/UserDoc");
const Worker_1 = require("../../models/Worker");
const Notification_1 = require("../../models/Notification");
const User_1 = require("../../models/User");
const Application_1 = require("../../models/Application");
const Post_1 = require("../../models/Post");
exports.finishDealRequest = (0, catchAsync_1.default)(async (req, res, next) => {
    if (req.dealRole === UserDoc_1.Role.Worker) {
        req.deal.status = Deal_1.DealStatus.FinishRequestSent;
        req.deal.statusOrd = 1;
    }
    await req.deal.save();
    const user = await User_1.User.findById(req.deal.user);
    await Notification_1.Notification.create({
        receiverId: user.id,
        dataModel: Notification_1.NotificationDataModel.Deal,
        data: req.deal.id,
        title: 'Deal Finish request',
        body: `${req.user.name} requested to finish the deal`,
        type: Notification_1.NotificationType.DealFinishRequest,
    });
    res.status(200).json({
        status: 'success',
        deal: req.deal,
    });
});
exports.finishDealDecline = (0, catchAsync_1.default)(async (req, res, next) => {
    req.deal.status = Deal_1.DealStatus.OnGoing;
    req.deal.statusOrd = 2;
    await req.deal.save();
    const worker = await Worker_1.Worker.findById(req.deal.worker);
    await Notification_1.Notification.create({
        receiverId: worker.id,
        dataModel: Notification_1.NotificationDataModel.Deal,
        data: req.deal.id,
        title: 'Deal Finish declined!',
        body: `${req.user.name} declined your finish deal request`,
        type: Notification_1.NotificationType.DealFinishDecline,
    });
    res.status(200).json({
        status: 'success',
        deal: req.deal,
    });
});
exports.finishDealAccept = (0, catchAsync_1.default)(async (req, res, next) => {
    req.deal.status = Deal_1.DealStatus.Finished;
    req.deal.statusOrd = 3;
    req.deal._finishedAt = new Date(Date.now());
    // const exp = (req.deal.worker as any).experience + 1;
    // (req.deal.worker as any).save({ validateBeforeSave: false });
    const worker = await Worker_1.Worker.findById(req.deal.worker);
    worker.experience++;
    await worker.save({ validateBeforeSave: false });
    // req.deal._deletedAt = new Date(Date.now());
    await req.deal.save();
    const post = await Post_1.Post.findByIdAndUpdate(req.deal.post, {
        hidden: true,
    }, { new: true });
    const applications = await Application_1.Application.find({ post: post.id });
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
    await Notification_1.Notification.create({
        receiverId: worker.id,
        dataModel: Notification_1.NotificationDataModel.Deal,
        data: req.deal.id,
        title: 'Deal Finished!',
        body: `${req.user.name} accepted your finish deal request`,
        type: Notification_1.NotificationType.DealFinished,
    });
    res.status(200).json({
        status: 'success',
        deal: req.deal,
    });
});
//# sourceMappingURL=finishDeal.js.map