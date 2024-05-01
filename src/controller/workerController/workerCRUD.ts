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
    {
      // let filter = {};
      // if (req.params.id) {
      //   filter = { user: req.params.id };
      // }
      // const features = new APIFeatures(Model.find(filter), req.query)
      const features = new APIFeatures(Worker.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

      const workers = await features.query;
      let data;
      if (req.user) {
        data = workers.map((worker: WorkerDoc) => ({
          ...worker.toObject(),
          isFavorite: req.user.favoriteWorkers.includes(worker.id),
        }));
      } else {
        data = workers;
      }
      res
        .status(200)
        .json({ status: 'success', results: workers.length, workers: data });
    }
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

    if (portfolioPosts) {
      worker.populate({ path: 'portfolioPosts'});
    }
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
