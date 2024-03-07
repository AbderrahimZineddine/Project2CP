import { User } from '../../models/User';
import catchAsync from '../../utils/catchAsync';
import { Response, NextFunction } from 'express';
import { Role } from './authController';
import { MyRequest } from '../userController/userController';
import { CerteficateToAdmin } from '../../models/CerteficateToAdmin';
import { WorkerDoc } from '../../models/WorkerDoc';

export const signupAsWorker = catchAsync(
  //TODO check if already singed up
  async (req: MyRequest, res: Response, next: NextFunction) => {
    const { job, location } = req.body;

    // await user.validate('idPicture');
    // await user.save({ validateBeforeSave: false });
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        role: Role.Worker,
        job,
        location,
      },
      { new: true, overwriteDiscriminatorKey: true }
    );

    if (req.certeficates && req.certeficates.length > 0) {
      for (const certeficate of req.certeficates) {
        //TODO send Worker Certeficates!
        // sendCerteficateToAdmin(req.user, certeficate);
        await CerteficateToAdmin.create({
          worker: {
            id: req.user.id,
            name: req.user.lastName + ' ' + req.user.firstName,
            job: (req.user as WorkerDoc).job,
          },
          title: certeficate.title,
          image: certeficate.image,
        });
      }
    }

    //TODO Send ID
    req.user = user; //TODO ?? what to send ?
    res.status(200).json({
      status: 'success',
      message:
        'Sign up as a worker successfully! Please wait for your id validation to login',
    });
  }
);
