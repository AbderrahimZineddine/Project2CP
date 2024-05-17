import { MyRequest } from '../userController';
import { NextFunction, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import AppError from '../../utils/appError';
import { PortfolioPost } from '../../models/PortfolioPost';
import { Like } from '../../models/Like';
import {
  NotificationDataModel,
  NotificationType,
  Notification,
} from '../../models/Notification';
import { Worker } from '../../models/Worker';
import { WorkerDoc } from '../../models/WorkerDoc';

export const ToggleLikePortfolioPost = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    const post = await PortfolioPost.findById(req.params.id);
    if (!post) {
      return next(new AppError('No portfolio post found with that id', 404));
    }
    const like = await Like.findOne({
      userId: req.user.id,
      postId: post.id,
    });
    if (like) {
      await Like.findByIdAndDelete(like.id);
      //   post.likes = post.likes - 1;
      post.likes--;
      await post.save({ validateBeforeSave: false });
      res.status(200).json({
        status: 'success',
        message: 'Like deleted successfully',
      });
    } else {
      const like = await Like.create({
        userId: req.user.id,
        postId: post.id,
      });
      post.likes++;
      await post.save({ validateBeforeSave: false });

      const worker: WorkerDoc = await Worker.findOne({
        portfolioPosts: { $in: [post.id] },
      });
      if (worker) {
        await Notification.create({
          receiverId: worker.id,
          dataModel: NotificationDataModel.PortfolioPost,
          data: post.id,
          title: 'Liked your post',
          body: `${req.user.name} liked your post`,
          type: NotificationType.PostLiked,
        });
      }

      res.status(200).json({
        status: 'success',
        message: 'Like created successfully',
        like,
      });
    }
  }
);
