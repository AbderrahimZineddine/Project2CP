import { User } from '../../models/User';
import catchAsync from '../../utils/catchAsync';
import AppError from '../../utils/appError';
import { Response, NextFunction } from 'express';
import { createAndSendToken } from './createAndSendToken';
import { MyRequest } from '../authController';

export const login = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(
        new AppError('Please enter a valid email and password.', 404)
      );
    }

    // console.log('********************************')
    // console.log(await User.find())
    // console.log('********************************')

    const user = await User.findOne({ email }).select(
      '+authentication.password'
    );

    if (
      !user ||
      !(await user.correctPassword(password, user.authentication.password))
    ) {
      return next(new AppError('Incorrect Email or Password.', 404));
    }

    if (!user.authentication.isVerified) {
      return next(
        new AppError(
          'You are not verified! Please verify your email account and login',
          400
        )
      ); //TODO 400 ?
    }
    // everything good
    //Store fcm token
    if (req.body.fcmToken) {
      if (!user.fcmTokens) {
        user.fcmTokens = [];
        user.fcmTokens.push(req.body.fcmToken);
        user.save({ validateBeforeSave: false });
      } else if (!user.fcmTokens.includes(req.body.fcmToken)) {
        user.fcmTokens.push(req.body.fcmToken);
        user.save({ validateBeforeSave: false });
      }
    }
    createAndSendToken(user, 200, req, res); //TODO: code correct?
  }
);
