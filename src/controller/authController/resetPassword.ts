import { User } from '../../models/User';
import catchAsync from '../../utils/catchAsync';
import AppError from '../../utils/appError';
import { Response, NextFunction } from 'express';
import crypto from 'crypto';
import { createAndSendToken } from './createAndSendToken';
import { MyRequest } from './authController';

export const resetPassword = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    //1) get user based on password reset token :
    const hashedOTP = crypto
      .createHash('sha256')
      .update(req.body.otp)
      .digest('hex');

    //* be careful when querying nested ducuments
    const user = await User.findOne({
      'authentication.otp': hashedOTP,
      'authentication.otpExpires': { $gt: Date.now() },
    });

    //2)  If token has not expired, and there is user, set the new password
    if (!user) {
      return next(new AppError('Token is invalid or has expired', 400));
    }

    user.authentication.password = req.body.password;
    user.authentication.passwordConfirm = req.body.passwordConfirm;
    user.authentication.otpExpires = undefined;
    user.authentication.otp = undefined;
    await user.save();

    //3) update change password at and hash the new password:
    //* done using middleware in user
    //4) Log the user in, send JWT
    createAndSendToken(user, 201, req, res);
  }
);
