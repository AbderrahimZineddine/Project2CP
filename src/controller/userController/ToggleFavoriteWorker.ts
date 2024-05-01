import { Like } from 'models/Like';
import { PortfolioPost } from '../../models/PortfolioPost';
import AppError from '../../utils/appError';
import catchAsync from '../../utils/catchAsync';
import { MyRequest } from '../userController';
import { NextFunction, Response, request } from 'express';
import { Worker } from '../../models/Worker';
import { User } from '../../models/User';

export const ToggleFavoriteWorker = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    const worker = await Worker.findById(req.params.id);
    if (!worker) {
      return next(new AppError('No worker found with that id', 404));
    }
    if (req.user.favoriteWorkers.includes(worker.id)) {
      req.user.favoriteWorkers = req.user.favoriteWorkers.filter(
        (workerId) => (workerId as unknown as string) != req.params.id
      );

      await req.user.save({ validateBeforeSave: false });
      res.status(200).json({
        status: 'success',
        message: 'worker removed from favorites successfully',
      });
    } else {
      req.user.favoriteWorkers.push(worker.id);

      await req.user.save({ validateBeforeSave: false });
      res.status(200).json({
        status: 'success',
        message: 'worker saved as favorite successfully',
      });
    }
  }
);

export const getFavoriteWorkers = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    const workers = [];
    for (const workerId of req.user.favoriteWorkers) {
      workers.push(await Worker.findById(workerId));
    }
    res.status(200).json({
      status: 'success',
      workers,
    });
  }
);

export const getFavoriteWorkersFromUserId = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(
        new AppError('No user found with that id : ' + req.params.id, 404)
      );
    }
    const workers = [];
    for (const workerId of user.favoriteWorkers) {
      workers.push(await Worker.findById(workerId));
    }
    res.status(200).json({
      status: 'success',
      workers,
    });
  }
);
