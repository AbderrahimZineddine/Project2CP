import catchAsync from '../../utils/catchAsync';
import { MyRequest } from '../../controller/userController';
import { User } from '../../models/User';
import { NextFunction, Response } from 'express';
import { Post } from '../../models/Post';
import { Deal } from '../../models/Deal';

export const usersPerWilaya = catchAsync(
  async (req: MyRequest, res: Response) => {
    const data = await User.aggregate([
      {
        $group: {
          _id: '$wilaya',
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      status: 'success',
      data,
    });
  }
);

export const userTotal = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    // Count the total number of applications
    const totalUsers = await User.countDocuments();

    // Find the total number of distinct workers
    const totalPosts = await Post.countDocuments();
    const totalDeals = await Deal.countDocuments();

    // Calculate the average applications per worker
    const averagePosts = totalPosts / totalUsers;
    const averageDeals = totalDeals / totalUsers;

    res.status(200).json({
      status: 'success',
      total : {
        // {
        //   _id: 'Created',
        //   count: totalUsers,
        // },
        created: totalUsers,
        // {
        //   _id: 'Average post per user',
        //   count: averagePosts,
        // },
        averagePostPerUser: averagePosts,
        // {
        //   _id: 'Average deals per user',
        //   count: averageDeals,
        // },
        averageDealPerUser: averageDeals,
      },
    });
  }
);
