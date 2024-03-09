import AppError from '../../utils/appError';
import { Response, NextFunction } from 'express';
import { MyRequest } from '../authController';

export const restrictTo = (...roles: string[]) => {
  //*?  answer : return a function cz express expects that, so we "call" (ex : restrictTo(['user'])) this function, which return a function (a) , then express uses (a) to do whatever it needs; other middlewares are used directly so we don't call them
  return (req: MyRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.currentRole)) {
      return next(
        new AppError(
          'You do not have the permission to perform this action',
          403
        )
      );
    }

    // user may go to next route :
    next();
  };
};
