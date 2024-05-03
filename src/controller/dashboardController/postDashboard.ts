import catchAsync from '../../utils/catchAsync';
import { MyRequest } from '../../controller/userController';
import { Post } from '../../models/Post';
import { NextFunction, Response } from 'express';
import { User } from '../../models/User';
import { Worker } from '../../models/Worker';

export const postsPerJob = catchAsync(async (req: MyRequest, res: Response) => {
  const data = await Post.aggregate([
    {
      $group: {
        _id: '$job',
        count: { $sum: 1 },
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data,
  });
});

export const postTotal = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    // Count the total number of applications
    const totalUsers = await User.countDocuments();
    // const totalWorkers = await Worker.countDocuments();

    // Find the total number of distinct workers
    const totalPosts = await Post.countDocuments();

    // Calculate the average applications per worker
    const averagePosts = totalPosts / totalUsers;
    // const averagePosts2 = totalPosts / totalWorkers;

    res.status(200).json({
      status: 'success',
      data: [
        {
          _id: 'Created',
          count: totalPosts,
        },
        {
          _id: 'Average post per user',
          count: averagePosts,
        },
        // {
        //   _id: 'Average post per worker',
        //   count: averagePosts2,
        // },
      ],
    });
  }
);
