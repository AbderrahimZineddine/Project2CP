import uploadController from '../uploadController';
import { MyRequest } from '../userController';
import { NextFunction, Response, application } from 'express';
import { Post } from '../../models/Post';
import AppError from '../../utils/appError';
import catchAsync from '../../utils/catchAsync';
import { Deal } from '../../models/Deal';
import { Application } from '../../models/Application';
import {
  NotificationDataModel,
  NotificationType,
  Notification,
} from '../../models/Notification';

export const deletePostById = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    if (await Deal.findOne({ post: req.params.id })) {
      return next(
        new AppError('You cannot delete a post linked with a deal!', 404)
      );
    }
    const post = await Post.findById(req.params.id);
    if (!post) {
      return next(new AppError('No post found with that id', 404));
    }
    for (const url of post.images) {
      await uploadController.deleteFromCloudinary(url);
    }
    // await Post.findByIdAndDelete(post.id);
    const applications = await Application.find({ post: req.params.id });
    for (const app of applications) {
      app._deletedAt = new Date(Date.now());
      app.save();

      await Notification.create({
        receiverId: app.worker,
        dataModel: NotificationDataModel.Post,
        data: post.id,
        title: 'Application declined!',
        body: `${req.user.name} declined your application!`,
        type: NotificationType.ApplicationDeclined,
      });
    }

    await Post.findByIdAndUpdate(
      req.params.id,
      { _deletedAt: new Date(Date.now()) },
      { new: true }
    );

    res.status(200).json({
      status: 'success',
    });
  }
);

export const deletePostById2 = async (
  id: string,
  name: string,
  next: NextFunction
) => {
  try {
    if (await Deal.findOne({ post: id })) {
      return next(
        new AppError('You cannot delete a post linked with a deal!', 404)
      );
    }
    const post = await Post.findById(id);
    if (!post) {
      return next(new AppError('No post found with that id', 404));
    }
    for (const url of post.images) {
      await uploadController.deleteFromCloudinary(url);
    }
    // await Post.findByIdAndDelete(post.id);
    const applications = await Application.find({ post: id });
    for (const app of applications) {
      app._deletedAt = new Date(Date.now());
      app.save();

      await Notification.create({
        receiverId: app.worker,
        dataModel: NotificationDataModel.Post,
        data: post.id,
        title: 'Application declined!',
        body: `${name} declined your application!`,
        type: NotificationType.ApplicationDeclined,
      });
    }

    await Post.findByIdAndUpdate(
      id,
      { _deletedAt: new Date(Date.now()) },
      { new: true }
    );
  } catch (error) {
    new AppError(`Error deleting post! error : ${error.message}`, 500);
  }
};
