import mongoose from 'mongoose';
import catchAsync from '../utils/catchAsync';
import { deleteOne, getAll, getOne } from '../controller/handlerFactory';
import { MyRequest } from '../controller/userController';
import { NextFunction, Response } from 'express';
import AppError from '../utils/appError';
import { User } from './User';
import { sendPushNotification } from '../firebase';

export enum NotificationType {
  CertificateDisapproved = 'CertificateDisapproved',
  CertificateApproved = 'CertificateApproved',
  WorkerAccountDisapproved = 'WorkerAccountDisapproved',
  WorkerAccountApproved = 'WorkerAccountApproved',
  NewApplication = 'NewApplication',
  NewDeal = 'NewDeal',
  PostLiked = 'PostLiked',
  NewReview = 'NewReview',
  DealFinished = 'DealFinished',
  DealFinishDecline = 'DealFinishDecline',
  DealFinishRequest = 'DealFinishRequest',
  ApplicationDeclined = 'ApplicationDeclined',
  // ref: 'dataModel',
  DealCanceled = 'DealCanceled',
}

export enum NotificationDataModel {
  Application = 'Application',
  Post = 'Post',
  User = 'User',
  Worker = 'Worker',
  Deal = 'Deal',
  Review = 'Review',
  PortfolioPost = 'PortfolioPost',
  Certificate = 'Certificate',
}

export interface NotificationDoc extends mongoose.Document {
  receiverId: mongoose.Schema.Types.ObjectId;
  data: mongoose.Schema.Types.ObjectId;
  dataModel: string;
  title: string;
  body: string;
  type: NotificationType;
  viewed: boolean;
}

const NotificationSchema = new mongoose.Schema(
  {
    receiverId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    dataModel: {
      type: String,
      required: [true, 'notification data model is required'],
    },
    data: {
      type: mongoose.Schema.ObjectId,
      // ref: 'dataModel',
      ref: (doc: any) => doc.dataModel,
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
  },
  {
    timestamps: true,
  }
);

NotificationSchema.pre(/^find/, function <NotificationDoc>(next: NextFunction) {
  this.populate({
    path: 'receiverId',
    select: 'name profilePicture', // Select specific fields from the user model
  });
  // this.populate({
  //   path: 'data',
  // });
  next();
});

NotificationSchema.pre('save', async function (next: NextFunction) {
  if (this.isNew) {
    console.log('A new notifications has been created !');
    // Perform additional actions for new user creation
    const user = await User.findById(this.receiverId);
    if (user && user.fcmTokens) {
      for (const token of user.fcmTokens) {
        sendPushNotification(token, this.title, this.body);
      }
    }
  }
  next();
});

export const Notification = mongoose.model<NotificationDoc>(
  'Notification',
  NotificationSchema
);

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

const getAllNotifications = getAll(Notification);
const getNotificationById = getOne(Notification);
const getUserNotificationsById = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    // req.query.sort = 'statusOrd -createdAt'; //default already
    req.query.receiverId = req.params.id;
    next();
  }
);

const deleteNotificationById = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    // req.query.sort = 'statusOrd -createdAt'; //default already
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) {
      return next(new AppError('no Document found with that ID', 404));
    }
    res.status(204).json({
      status: 'success',
      message: 'notification deleted successfully',
    }); //* 204
  }
);

const getMyNotificationsById = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    // req.query.sort = 'statusOrd -createdAt'; //default already
    req.query.receiverId = req.user.id;
    next();
  }
);

const checkReceiverNotifications = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return next(
        new AppError('There is no notification with id ' + req.params.id, 404)
      );
    }

    console.log(
      (notification.receiverId as any).id.toString(),
      '||||||',
      req.user.id.toString()
    );
    if (
      (notification.receiverId as any).id.toString() != req.user.id.toString()
    ) {
      return next(
        new AppError(
          "This notification doesn't belong to the current user ",
          404
        )
      );
    }
    req.notification = notification;

    next();
  }
);

const notificationViewed = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    req.notification.viewed = true;
    req.notification.save();
    res.status(200).json({
      message: 'success',
      notification: req.notification,
    });
  }
);

const newNotificationsCount = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    const count = await Notification.countDocuments({
      receiverId: req.query.receiverId,
      viewed: false,
    });
    res.status(200).json({
      message: 'success',
      count,
    });
  }
);

export const notificationController = {
  getAllNotifications,
  getUserNotificationsById,
  getMyNotificationsById,
  checkReceiverNotifications,
  notificationViewed,
  getNotificationById,
  newNotificationsCount,
  deleteNotificationById,
};
