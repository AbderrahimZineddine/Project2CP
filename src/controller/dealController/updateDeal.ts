import { MyRequest } from '../userController';
import { NextFunction, Response } from 'express';
import { Deal } from '../../models/Deal';
import AppError from '../../utils/appError';
import catchAsync from '../../utils/catchAsync';
import { Role } from '../../models/UserDoc';
import {
  NotificationType,
  NotificationDataModel,
  Notification,
} from '../../models/Notification';

export const updateDeal = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    if (req.dealRole === Role.Worker) {
      if (req.body.title) {
        req.deal.workerTitle = req.body.title;
      }
      if (req.body.description) {
        req.deal.workerDescription = req.body.description;
      }
    } else {
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
  }
);

export const deleteDeal = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {

    const doc = await Deal.findByIdAndUpdate(
      req.params.id,
      { _deletedAt: Date.now() },
      { new: true }
    );
    if (!doc) {
      return next(
        new AppError(`No Deal found with ID : ${req.params.id}`, 404)
      );
    }

    if (req.dealRole == Role.User) {
      await Notification.create({
        receiverId: doc.worker,
        dataModel: NotificationDataModel.User,
        data: req.user.id,
        title: 'Deal canceled!',
        body: `${req.user.name} canceled a deal with you!`,
        type: NotificationType.DealCanceled,
      });
    } else if (req.dealRole == Role.Worker) {
      await Notification.create({
        receiverId: doc.user,
        dataModel: NotificationDataModel.Worker,
        data: req.user.id,
        title: 'Deal canceled!',
        body: `${req.user.name} canceled a deal with you!`,
        type: NotificationType.DealCanceled,
      });
    }

    res.status(204).json({ status: 'success', message: 'delete successfully' }); //* 204
  }
);
