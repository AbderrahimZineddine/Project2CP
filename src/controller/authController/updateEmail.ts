import { User } from '../../models/User';
import catchAsync from '../../utils/catchAsync';
import { NextFunction, Response } from 'express';
import { MyRequest } from './authController';
import crypto from 'crypto';
import AppError from '../../utils/appError';
import { createAndSendToken } from './createAndSendToken';
import Email from '../../utils/email';
// email is for sure here :

// 1 : send otp
// check otp route , if successful : update email and login

// if not : back to old email !

export const updateEmail = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    if (!req.body.email) {
      return next(new AppError('Enter your new email', 400)); //400 ??
    }
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      next(new AppError('Email already exists', 400));
    }
    // req.user.email = req.body.email;
    const oldEmail = req.user.email;

    req.user.newEmail = req.body.email;
    const otp = req.user.createOTP();
    await req.user.save({ validateModifiedOnly: true }); //TODO check this feature again

    try {
      req.user.email = req.body.email;
      await new Email(req.user, otp).sendOTPEmail();
    } catch (error) {
      req.user.email = oldEmail; //* so not to save req.user with the new email
      req.user.newEmail = undefined;
      req.user.authentication.otp = undefined;
      req.user.authentication.otpExpires = undefined;
      await req.user.save({ validateBeforeSave: false });

      return next(
        new AppError(
          'There was an error sending the email. Try again later!',
          500
        )
      );
    }

    res.status(200).json({
      status: 'PENDING',
      message: 'Verification email sent',
      email: req.body.email,
    });
  }
);
