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

    // Sort the data in descending order of count
    data.sort((a, b) => b.count - a.count);

    // Get the top 5 wilayas and sum up the counts of others
    const topFive = data.slice(0, 5);
    const othersCount = data
      .slice(5)
      .reduce((sum, wilaya) => sum + wilaya.count, 0);

    // Create the final result array
    const result = [...topFive, { _id: 'others', count: othersCount }];

    res.status(200).json({
      status: 'success',
      data : result,
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
      data: {
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
