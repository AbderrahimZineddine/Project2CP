import { NextFunction, Response } from 'express';
import { MyRequest } from '../../controller/userController/userController';
import { Role } from '../../models/UserDoc';
import AppError from '../../utils/appError';

const verifyAlreadySignedUp = (
  req: MyRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user.role === Role.Worker) {
    return next(
      new AppError('This user has already signed up as a worker!', 400)
    );
  }
  next();
};

export default verifyAlreadySignedUp;
