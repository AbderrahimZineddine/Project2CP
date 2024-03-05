import { User } from '../../models/User';
import catchAsync from '../../utils/catchAsync';
import AppError from '../../utils/appError';
import { Response, NextFunction } from 'express';
import { createAndSendToken } from './createAndSendToken';
import { MyRequest } from './authController';

export const updatePassword = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    // 1) get user from collection
    //* can't user findByIdAndUpdate cz we can't access to this.password in the validator and middlewares
    // in genereal don't use it while working with password
    const user = await User.findById(req.user.id).select(
      '+authentication.password'
    );

    //2) check if POSTed password is correct
    if (
      !user ||
      !(await user.correctPassword(
        req.body.currentPassword,
        user.authentication.password
      ))
    ) {
      return next(new AppError('Your currecnt password is Wrong!', 401));
    }

    //3) if correct, change password
    user.authentication.password = req.body.password;
    user.authentication.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    // 4) Log user in, send JWT
    createAndSendToken(user, 201, req, res);
  }
);
