import { MyRequest } from '../../controller/userController';
import { NextFunction, Response } from 'express';
import AppError from '../../utils/appError';
import catchAsync from '../../utils/catchAsync';
import { Worker } from '../../models/Worker';
import { WorkerDoc } from '../../models/WorkerDoc';
import APIFeatures from '../../utils/APIFeatures';

const calculateScore = (worker: WorkerDoc, globalAverageRating: number) => {
  const R = worker.rating;
  const N = worker.ratingsNumber;
  const E = worker.experience;
  const K = 5; // Adjust this value based on your preference

  const adjustedRating =
    (N / (N + K)) * R + (K / (N + K)) * globalAverageRating;
  const score = 0.7 * adjustedRating + 0.3 * Math.log(1 + E);
  return score;
};

export const getBestWorkers = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    const result = await Worker.aggregate([
      { $group: { _id: null, avgRating: { $avg: '$rating' } } },
    ]);
    const globalAverageRating = result[0] ? result[0].avgRating : 0;
    // const workers: WorkerDoc[] = await Worker.find();
    const features = new APIFeatures(Worker.find(), req.query)
      .filter()
      .limitFields();

    const workers = await features.query;
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;

    const skip = (page - 1) * limit;

    let data;
    data = workers.map((worker: WorkerDoc) => ({
      ...worker.toObject(),
      isFavorite: req.user.favoriteWorkers.includes(worker.id),
      score: calculateScore(worker, globalAverageRating),
    }));

    data.sort((a: any, b: any) => {
      if (a.score > b.score) {
        return -1; // a comes before b
      } else if (a.score < b.score) {
        return 1; // b comes before a
      } else if (!a.isFavorite && b.isFavorite) {
        return 1; // b comes before a
      } else if (a.isFavorite && !b.isFavorite) {
        return -1; // a comes before b
      } else {
        return 0; // maintain order
      }
    });

    const bestWorkers = data.slice(skip, skip + limit);

    res.status(200).json({
      status: 'success',
      bestWorkers,
    });
  }
);
