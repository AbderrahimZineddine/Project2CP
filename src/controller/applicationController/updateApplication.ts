import { MyRequest } from '../userController';
import { NextFunction, Response } from 'express';
import { Application } from '../../models/Application';
import AppError from '../../utils/appError';
import catchAsync from '../../utils/catchAsync';

export const updateApplication = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      {
        description: req.body.description,
        price: req.body.price,
      },
      { new: true }
    );

    if (!application) {
      return next(
        new AppError(
          'Error updating your application! Please try again later.',
          500
        )
      );
    }

    res.status(200).json({
      status: 'success',
      application,
    });
  }
);
