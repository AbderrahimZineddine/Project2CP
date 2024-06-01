"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationController = exports.Notification = exports.NotificationDataModel = exports.NotificationType = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const handlerFactory_1 = require("../controller/handlerFactory");
const appError_1 = __importDefault(require("../utils/appError"));
const User_1 = require("./User");
const firebase_1 = require("../firebase");
var NotificationType;
(function (NotificationType) {
    NotificationType["CertificateDisapproved"] = "CertificateDisapproved";
    NotificationType["CertificateApproved"] = "CertificateApproved";
    NotificationType["WorkerAccountDisapproved"] = "WorkerAccountDisapproved";
    NotificationType["WorkerAccountApproved"] = "WorkerAccountApproved";
    NotificationType["NewApplication"] = "NewApplication";
    NotificationType["NewDeal"] = "NewDeal";
    NotificationType["PostLiked"] = "PostLiked";
    NotificationType["NewReview"] = "NewReview";
    NotificationType["DealFinished"] = "DealFinished";
    NotificationType["DealFinishDecline"] = "DealFinishDecline";
    NotificationType["DealFinishRequest"] = "DealFinishRequest";
    NotificationType["ApplicationDeclined"] = "ApplicationDeclined";
    // ref: 'dataModel',
    NotificationType["DealCanceled"] = "DealCanceled";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
var NotificationDataModel;
(function (NotificationDataModel) {
    NotificationDataModel["Application"] = "Application";
    NotificationDataModel["Post"] = "Post";
    NotificationDataModel["User"] = "User";
    NotificationDataModel["Worker"] = "Worker";
    NotificationDataModel["Deal"] = "Deal";
    NotificationDataModel["Review"] = "Review";
    NotificationDataModel["PortfolioPost"] = "PortfolioPost";
    NotificationDataModel["Certificate"] = "Certificate";
})(NotificationDataModel || (exports.NotificationDataModel = NotificationDataModel = {}));
const NotificationSchema = new mongoose_1.default.Schema({
    receiverId: {
        type: mongoose_1.default.Schema.ObjectId,
        ref: 'User',
    },
    dataModel: {
        type: String,
        required: [true, 'notification data model is required'],
    },
    data: {
        type: mongoose_1.default.Schema.ObjectId,
        // ref: 'dataModel',
        ref: (doc) => doc.dataModel,
        required: [true, 'notification data is required'],
    },
    title: {
        type: String,
        required: [true, 'notification must have a title'],
    },
    body: {
        type: String,
        required: [true, 'notification must have a body'],
    },
    type: {
        enum: NotificationType,
        type: String,
        required: [true, 'notification must have a type'],
    },
    viewed: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
NotificationSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'receiverId',
        select: 'name profilePicture', // Select specific fields from the user model
    });
    // this.populate({
    //   path: 'data',
    // });
    next();
});
NotificationSchema.pre('save', async function (next) {
    if (this.isNew) {
        console.log('A new notifications has been created !');
        // Perform additional actions for new user creation
        const user = await User_1.User.findById(this.receiverId);
        if (user && user.fcmTokens) {
            for (const token of user.fcmTokens) {
                (0, firebase_1.sendPushNotification)(token, this.title, this.body);
            }
        }
    }
    next();
});
exports.Notification = mongoose_1.default.model('Notification', NotificationSchema);
// const createNotification = async (
//   receiverId: string,
//   senderId: string,
//   type: NotificationType
// ) => {
//   const notification = await Notification.create({
//     receiverId,
//     senderId,
//     type,
//   });
//   return notification;
// };
const getAllNotifications = (0, handlerFactory_1.getAll)(exports.Notification);
const getNotificationById = (0, handlerFactory_1.getOne)(exports.Notification);
const getUserNotificationsById = (0, catchAsync_1.default)(async (req, res, next) => {
    // req.query.sort = 'statusOrd -createdAt'; //default already
    req.query.receiverId = req.params.id;
    next();
});
const deleteNotificationById = (0, catchAsync_1.default)(async (req, res, next) => {
    // req.query.sort = 'statusOrd -createdAt'; //default already
    const notification = await exports.Notification.findByIdAndDelete(req.params.id);
    if (!notification) {
        return next(new appError_1.default('no Document found with that ID', 404));
    }
    res.status(204).json({
        status: 'success',
        message: 'notification deleted successfully',
    }); //* 204
});
const getMyNotificationsById = (0, catchAsync_1.default)(async (req, res, next) => {
    // req.query.sort = 'statusOrd -createdAt'; //default already
    req.query.receiverId = req.user.id;
    next();
});
const checkReceiverNotifications = (0, catchAsync_1.default)(async (req, res, next) => {
    const notification = await exports.Notification.findById(req.params.id);
    if (!notification) {
        return next(new appError_1.default('There is no notification with id ' + req.params.id, 404));
    }
    console.log(notification.receiverId.id.toString(), '||||||', req.user.id.toString());
    if (notification.receiverId.id.toString() != req.user.id.toString()) {
        return next(new appError_1.default("This notification doesn't belong to the current user ", 404));
    }
    req.notification = notification;
    next();
});
const notificationViewed = (0, catchAsync_1.default)(async (req, res, next) => {
    req.notification.viewed = true;
    req.notification.save();
    res.status(200).json({
        message: 'success',
        notification: req.notification,
    });
});
const newNotificationsCount = (0, catchAsync_1.default)(async (req, res, next) => {
    const count = await exports.Notification.countDocuments({
        receiverId: req.query.receiverId,
        viewed: false,
    });
    res.status(200).json({
        message: 'success',
        count,
    });
});
exports.notificationController = {
    getAllNotifications,
    getUserNotificationsById,
    getMyNotificationsById,
    checkReceiverNotifications,
    notificationViewed,
    getNotificationById,
    newNotificationsCount,
    deleteNotificationById,
};
//# sourceMappingURL=Notification.js.map