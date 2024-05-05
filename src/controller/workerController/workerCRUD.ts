import { MyRequest } from '../userController';
import { NextFunction, Response } from 'express';
import AppError from '../../utils/appError';
import catchAsync from '../../utils/catchAsync';
import { Worker } from '../../models/Worker';
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from '../handlerFactory';
import { Role } from '../../models/UserDoc';
import { PortfolioPost } from '../../models/PortfolioPost';
import { Review } from '../../models/Review';
import APIFeatures from '../../utils/APIFeatures';
import { WorkerDoc } from '../../models/WorkerDoc';

export const getAllWorkers = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    // Create APIFeatures instance to filter, sort, limit fields, and paginate
    const features = new APIFeatures(Worker.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // Execute the query and retrieve workers
    const workers = await features.query;

    let data;
    if (req.user) {
      // Map workers and add isFavorite property
      data = workers.map((worker: WorkerDoc) => ({
        ...worker.toObject(),
        isFavorite: req.user.favoriteWorkers.includes(worker.id),
      }));

      // Sort data to show favorites on top
      data.sort((a : any, b : any) => {
        if (a.isFavorite && !b.isFavorite) {
          return -1; // a comes before b
        } else if (!a.isFavorite && b.isFavorite) {
          return 1; // b comes before a
        } else {
          return 0; // maintain order
        }
      });
    } else {
      data = workers;
    }

    // Send response with sorted data
    res.status(200).json({ status: 'success', results: workers.length, workers: data });
  }
);

export const getWorkerById = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    const worker = await Worker.findById(req.params.id);
    if (!worker) {
      return next(new AppError('No worker found with that id', 404));
    }

    const { portfolioPosts, reviews } = req.query;
    let portfolioPostsData, reviewsData;

    // if (portfolioPosts) {
    //   worker.populate({ path: 'portfolioPosts'});
    // }
    if (reviews) {
      reviewsData = await Review.find({ worker: worker.id });
    }

    if (req.user && req.user.currentRole === Role.User) {
      const isFavorite = req.user.favoriteWorkers.includes(worker.id);
      res.status(200).json({
        status: 'success',
        worker,
        isFavorite,
        portfolioPostsData,
        reviewsData,
      });
    } else {
      res.status(200).json({
        status: 'success',
        worker,
        portfolioPostsData,
        reviewsData,
      });
    }
  }
);

export const createWorker = createOne(Worker);

export const updateWorker = updateOne(Worker);

export const deleteWorker = deleteOne(Worker);
