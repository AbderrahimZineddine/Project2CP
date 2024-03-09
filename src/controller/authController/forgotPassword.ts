import { User } from '../../models/User';
import catchAsync from '../../utils/catchAsync';
import AppError from '../../utils/appError';
import { Response, NextFunction } from 'express';
import Email from '../../utils/email';
import { MyRequest } from '../authController';

// export const restrictToCurrentRole = (...roles: string[]) => {
//   //*?  answer : return a function cz express expects that, so we "call" (ex : restrictTo(['user'])) this function, which return a function (a) , then express uses (a) to do whatever it needs; other middlewares are used directly so we don't call them
//   return (req: MyRequest, res: Response, next: NextFunction) => {
//     if (!roles.includes(req.user.currentRole)) {
//       return next(
//         new AppError(
//           'You currently do not have the permission to perform this action',
//           403
//         )
//       );
//     }
//     // user may go to next route :
//     next();
//   };
// };

export const forgotPassword = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    //1) get User from POSTed email :
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next(
        new AppError('There is no user with that email address', 404)
      );
    }

    //2) Generate random token and store the hashed token in user
    const otp = user.createOTP();
    await user.save({ validateBeforeSave: false });

    //3) send the token via email
    try {
      await new Email(user, otp).sendPassswordReset();

      res.status(200).json({
        status: 'success',
        message: 'Token sent to email',
        email: user.email,
      });
    } catch (error) {
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
