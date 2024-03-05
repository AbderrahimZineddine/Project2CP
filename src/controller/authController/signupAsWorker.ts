import { User } from '../../models/User';
import catchAsync from '../../utils/catchAsync';
import { Response, NextFunction } from 'express';
import { MyRequest, Role } from './authController';

export const signupAsWorker = catchAsync(
  //TODO check if already singed up
  async (req: MyRequest, res: Response, next: NextFunction) => {
    const { job, certificates, idPicture, location } = req.body;

    // await user.validate('idPicture');
    // await user.save({ validateBeforeSave: false });
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        role: Role.Worker,
        job,
        certificates,
        idPicture,
        location,
      },
      { new: true, overwriteDiscriminatorKey: true }
    );
    req.user = user; //TODO ?? what to send ?
    res.status(200).json({
      status: 'success',
      message:
        'Sign up as a worker successfully! Please wait for your id validation to login',
    });
  }
);
