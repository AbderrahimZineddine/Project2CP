"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDeal = exports.ValidateDealInputs = void 0;
const Deal_1 = require("../../models/Deal");
const appError_1 = __importDefault(require("../../utils/appError"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const Application_1 = require("../../models/Application");
const Notification_1 = require("../../models/Notification");
exports.ValidateDealInputs = (0, catchAsync_1.default)(async (req, res, next) => {
    const application = await Application_1.Application.findById(req.params.id);
    if (!application) {
        return next(new appError_1.default('There is no application with id : ' + req.params.id, 404));
    }
    if (await Deal_1.Deal.findOne({ user: req.user.id, post: application.post })) {
        return next(new appError_1.default('You already have a deal with this post!', 400));
    }
    req.application = application;
    next();
});
exports.createDeal = (0, catchAsync_1.default)(async (req, res, next) => {
    const deal = await Deal_1.Deal.create({
        userTitle: req.body.title,
        userDescription: req.body.description,
        user: req.user.id,
        worker: req.application.worker,
        post: req.application.post,
    });
    if (!deal) {
        return next(new appError_1.default('Error creating your Deal! Please try again later.', 500));
    }
    req.application._acceptedAt = new Date(Date.now());
    req.application._deletedAt = new Date(Date.now());
    req.application.save({ validateBeforeSave: false });
    await Notification_1.Notification.create({
        receiverId: req.application.worker,
        dataModel: Notification_1.NotificationDataModel.Deal,
        data: deal.id,
        title: 'New Deal',
        body: `${req.user.name} accepted your application`,
        type: Notification_1.NotificationType.NewDeal,
    });
    res.status(201).json({
        status: 'success',
        deal,
    });
});
//# sourceMappingURL=createDeal.js.map