import { MyRequest } from '../userController';
import { NextFunction, Response } from 'express';
import { Deal, DealStatus } from '../../models/Deal';
import AppError from '../../utils/appError';
import catchAsync from '../../utils/catchAsync';
import { Role } from '../../models/UserDoc';
import { WorkerDoc } from 'models/WorkerDoc';
import { Worker } from '../../models/Worker';
import {
  NotificationDataModel,
  NotificationType,
  Notification,
} from '../../models/Notification';
import { User } from '../../models/User';

export const finishDealRequest = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    if (req.dealRole === Role.Worker) {
      req.deal.status = DealStatus.FinishRequestSent;
      req.deal.statusOrd = 1;
    }
    await req.deal.save();

    const user = await User.findById(req.deal.user);
    await Notification.create({
      receiverId: user.id,
      dataModel: NotificationDataModel.Deal,
      data: req.deal.id,
      title: 'Deal Finish request',
      body: `${req.user.name} requested to finish the deal`,
      type: NotificationType.DealFinishRequest,
    });

    res.status(200).json({
      status: 'success',
      deal: req.deal,
    });
  }
);

export const finishDealDecline = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    req.deal.status = DealStatus.OnGoing;
    req.deal.statusOrd = 2;

    await req.deal.save();

    const worker: WorkerDoc = await Worker.findById(req.deal.worker);
    await Notification.create({
      receiverId: worker.id,
      dataModel: NotificationDataModel.Deal,
      data: req.deal.id,
      title: 'Deal Finish declined!',
      body: `${req.user.name} declined your finish deal request`,
      type: NotificationType.DealFinishDecline,
    });

    res.status(200).json({
      status: 'success',
      deal: req.deal,
    });
  }
);

export const finishDealAccept = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    req.deal.status = DealStatus.Finished;
    req.deal.statusOrd = 3;
    req.deal._finishedAt = new Date(Date.now());

    // const exp = (req.deal.worker as any).experience + 1;
    // (req.deal.worker as any).save({ validateBeforeSave: false });
    const worker: WorkerDoc = await Worker.findById(req.deal.worker);
    worker.experience++;
    await worker.save({ validateBeforeSave: false });
    // req.deal._deletedAt = new Date(Date.now());

    await req.deal.save();

    await Notification.create({
      receiverId: worker.id,
      dataModel: NotificationDataModel.Deal,
      data: req.deal.id,
      title: 'Deal Finished!',
      body: `${req.user.name} accepted your finish deal request`,
      type: NotificationType.DealFinished,
    });

    res.status(200).json({
      status: 'success',
      deal: req.deal,
    });
  }
);
