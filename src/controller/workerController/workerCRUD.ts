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

export const getAllWorkers = getAll(Worker);

export const getWorkerById = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    const worker = await Worker.findById(req.params.id);
    if (!worker) {
      return next(new AppError('No worker found with that id', 404));
    }
    if (req.user && req.user.currentRole === Role.User) {
      const isFavorite = req.user.favoriteWorkers.includes(worker.id);
      res.status(200).json({
        status: 'success',
        worker,
        isFavorite,
      });
    } else {
      res.status(200).json({
        status: 'success',
        worker,
      });
    }
  }
);

export const createWorker = createOne(Worker);

export const updateWorker = updateOne(Worker);

export const deleteWorker = deleteOne(Worker);
