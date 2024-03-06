import { User } from '../../models/User';
import catchAsync from '../../utils/catchAsync';
import { NextFunction, Response } from 'express';
import { MyRequest } from './authController';
import crypto from 'crypto';
import AppError from '../../utils/appError';
import { createAndSendToken } from './createAndSendToken';
import Email from '../../utils/email';

export const sendVerificationEmail = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    if (!req.body.email) {
      return next(new AppError('Enter an email to resend the code', 400)); //400 ??
    }

    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');

    const user = await User.findOne({ newEmail: req.body.email });
    if(!user) {
        return next(new AppError('This is the wrong email address', 400)); //400 ??
    }

    user.authentication.otp = hashedOTP;
    user.authentication.otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.save({ validateBeforeSave: false });

    try {
      await new Email(user, otp).sendOTPEmail();

      res.status(200).json({
        status: 'success',
        message: 'Verification email sent',
        email: user.newEmail,
      });
    } catch (error) {
      console.log('error : ', error);
      user.authentication.otp = undefined;
      user.authentication.otpExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return next(
        new AppError(
          'There was an error sending the email. Try again later!',
          500
        )
      );
    }
  }
);

export default sendVerificationEmail;