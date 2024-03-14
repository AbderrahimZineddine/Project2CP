import { Like } from 'models/Like';
import { PortfolioPost } from '../../models/PortfolioPost';
import AppError from '../../utils/appError';
import catchAsync from '../../utils/catchAsync';
import { MyRequest } from '../userController';
import { NextFunction, Response, request } from 'express';
import { Worker } from '../../models/Worker';

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
