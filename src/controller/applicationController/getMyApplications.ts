import { MyRequest } from '../userController';
import { NextFunction, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { Application } from '../../models/Application';
import { Post } from '../../models/Post';

// export const getMyApplications = catchAsync(
//   async (req: MyRequest, res: Response, next: NextFunction) => {
//     const Applications = await Application.find({ worker: req.user.id });

//     res.status(200).json({
//       status: 'success',
//       Applications,
//     });
//   }
// );

export const getMyApplications = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    req.query.worker = req.user.id;
    next();
  }
);

export const getMyApplicationsReceived = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    // Get the ID of the authenticated user
    const userId = req.user._id;

    try {
      // Find posts belonging to the user
      const userPosts = await Post.find({ user: userId });

      // Extract post IDs from userPosts
      const postIds = userPosts.map((post) => post._id);

      // Find applications associated with the user's posts
      const receivedApplications = await Application.find({ post: { $in: postIds } }).populate('worker');

      res.status(200).json({
        status: 'success',
        data: receivedApplications,
      });
    } catch (error) {
      next(error);
    }
  }
);

