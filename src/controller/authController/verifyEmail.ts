import { User } from '../../models/User';
import catchAsync from '../../utils/catchAsync';
import { NextFunction, Response } from 'express';
import { MyRequest } from '../authController';
import crypto from 'crypto';
import AppError from '../../utils/appError';
import { createAndSendToken } from './createAndSendToken';

export const verifyEmail = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    if (!req.body.otp) {
      return next(new AppError('Empty otp details are not allowed', 400)); //400 ??
    }

    const hashedOTP = crypto
      .createHash('sha256')
      .update(req.body.otp)
      .digest('hex');

    const user = await User.findOne({
      newEmail: req.body.email,
      'authentication.otp': hashedOTP,
      'authentication.otpExpires': { $gt: Date.now() },
    });

    if (!user) {
      return next(new AppError('Token is invalid or has expired', 400));
    }

    user.email = user.newEmail; //Setting the new email / or original one when signing up
    user.newEmail = undefined;
    user.authentication.otp = undefined;
    user.authentication.otpExpires = undefined;
    user.authentication.isVerified = true;
    await user.save({ validateBeforeSave: false });

    createAndSendToken(user, 201, req, res);
  }
);
