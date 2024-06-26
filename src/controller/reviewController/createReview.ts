import { MyRequest } from '../userController';
import { NextFunction, Response } from 'express';
import { Review } from '../../models/Review';
import AppError from '../../utils/appError';
import catchAsync from '../../utils/catchAsync';
import { Post } from '../../models/Post';
import { Deal, DealDoc, DealStatus } from '../../models/Deal';
import {
  NotificationDataModel,
  NotificationType,
  Notification,
} from '../../models/Notification';
import { deletePostById2 } from '../../controller/postController/deletePost';

export const ValidateReviewInputs = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    if (!req.body.rating) {
      return next(new AppError('A review must have a rating!', 400));
    }

    const deal: any = await Deal.findById(req.params.id);

    if (!deal) {
      return next(
        new AppError('There is no deal with id : ' + req.params.id, 404)
      );
    }

    if (!(deal.status === DealStatus.Finished)) {
      return next(new AppError('this deal is not finished yet ', 400));
    }

    // if (
    //   await Review.findOne({ user: req.user.id, worker: (deal as any).worker })
    // ) {
    //   return next(
    //     new AppError('You already left a Review with for this worker!', 400)
    //   );
    // }

    req.deal = deal;
    next();
  }
);

export const createReview = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    const review = await Review.create({
      user: req.user.id,
      worker: req.deal.worker,
      review: req.body.review,
      rating: req.body.rating,
    });

    if (!review) {
      return next(
        new AppError('Error creating your Review! Please try again later.', 500)
      );
    }

    //TODO : delete stuff after leaving review:  post, deal ....
    req.deal._deletedAt = new Date(Date.now());
    await req.deal.save();
    // await Post.findByIdAndUpdate(
    //   req.deal.post,
    //   {
    //     _deletedAt: new Date(Date.now()),
    //   },
    //   { new: true }
    // );

    deletePostById2(req.deal.post.toString(), req.user.name, next);

    await Notification.create({
      receiverId: review.worker,
      dataModel: NotificationDataModel.Review,
      data: review.id,
      title: 'New Review',
      body: `${req.user.name} left a review`,
      type: NotificationType.NewReview,
    });

    res.status(201).json({
      status: 'success',
      review,
    });
  }
);
