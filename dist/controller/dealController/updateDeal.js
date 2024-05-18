"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDeal = exports.updateDeal = void 0;
const Deal_1 = require("../../models/Deal");
const appError_1 = __importDefault(require("../../utils/appError"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const UserDoc_1 = require("../../models/UserDoc");
const Notification_1 = require("../../models/Notification");
const Post_1 = require("../../models/Post");
exports.updateDeal = (0, catchAsync_1.default)(async (req, res, next) => {
    if (req.dealRole === UserDoc_1.Role.Worker) {
        if (req.body.title) {
            req.deal.workerTitle = req.body.title;
        }
        if (req.body.description) {
            req.deal.workerDescription = req.body.description;
        }
    }
    else {
        if (req.body.title) {
            req.deal.userTitle = req.body.title;
        }
        if (req.body.description) {
            req.deal.userDescription = req.body.description;
        }
    }
    await req.deal.save();
    res.status(200).json({
        status: 'success',
        deal: req.deal,
    });
});
exports.deleteDeal = (0, catchAsync_1.default)(async (req, res, next) => {
    const post = await Post_1.Post.findById(req.deal.post);
    if (post) {
        post.hidden = false;
        await post.save();
    }
    const doc = await Deal_1.Deal.findByIdAndUpdate(req.params.id, { _deletedAt: Date.now() }, { new: true });
    if (!doc) {
        return next(new appError_1.default(`No Deal found with ID : ${req.params.id}`, 404));
    }
    if (req.dealRole == UserDoc_1.Role.User) {
        await Notification_1.Notification.create({
            receiverId: doc.worker,
            dataModel: Notification_1.NotificationDataModel.User,
            data: req.user.id,
            title: 'Deal canceled!',
            body: `${req.user.name} canceled a deal with you!`,
            type: Notification_1.NotificationType.DealCanceled,
        });
    }
    else if (req.dealRole == UserDoc_1.Role.Worker) {
        await Notification_1.Notification.create({
            receiverId: doc.user,
            dataModel: Notification_1.NotificationDataModel.Worker,
            data: req.user.id,
            title: 'Deal canceled!',
            body: `${req.user.name} canceled a deal with you!`,
            type: Notification_1.NotificationType.DealCanceled,
        });
    }
    res.status(204).json({ status: 'success', message: 'delete successfully' }); //* 204
});
//# sourceMappingURL=updateDeal.js.map