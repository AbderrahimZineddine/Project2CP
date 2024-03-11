import { User } from '../../models/User';
import { UserDoc } from 'models/UserDoc';
import catchAsync from '../../utils/catchAsync';
import { NextFunction, Response } from 'express';
import { MyRequest } from '../authController';
import Email from '../../utils/email';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import AppError from '../../utils/appError';

export const signup = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');

    const {
      firstName,
      lastName,
      email,
      password,
      wilaya,
      phoneNumber,
      passwordConfirm,
    } = req.body;

    const user: UserDoc = await User.create({
      firstName,
      lastName,
      email,
      newEmail: email,
      phoneNumber,
      wilaya,
      authentication: {
        password,
        passwordConfirm,
        otp: hashedOTP,
        otpExpires: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    // createAndSendToken(user, 201, req, res);

    // req.user.authentication.otp = hashedOTP;
    // req.user.authentication.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    // await req.user.save({ validateBeforeSave: false });

    try {
      console.log('user : ', user);
      console.log('otp : ', otp);

      await new Email(user, otp).sendOTPEmail();

      res.status(200).json({
        status: 'PENDING',
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
