import { User } from '../../models/User';
import catchAsync from '../../utils/catchAsync';
import { Response, NextFunction } from 'express';
import { Worker } from '../../models/Worker';
import { WorkerDoc } from '../../models/WorkerDoc';
import { createAndSendToken } from './createAndSendToken';
import { MyRequest, Role } from './authController';

export const switchRole = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    if (req.user.currentRole === Role.Worker) {
      // switch from worker to user :
      req.user = await Worker.findByIdAndUpdate(
        req.user.id,
        { currentRole: Role.User },
        { overwriteDiscriminatorKey: true, new: true }
      );
      return createAndSendToken(req.user, 200, req, res);
      // this should end here
    }
    // already signed in as worker :
    if (req.user.role === Role.Worker) {
      if ((req.user as WorkerDoc).workerAccountVerified) {
        // all good :
        // req.user.currentRole = Role.Worker;
        req.user = await User.findByIdAndUpdate(
          req.user.id,
          { currentRole: Role.Worker },
          { overwriteDiscriminatorKey: true, new: true }
        );
        return createAndSendToken(req.user, 200, req, res);
      }

      // return next(
      //   new AppError('Your Worker account has not been validated yet', 404)
      // ); //TODO check 404 ?
      res.status(403).json({
        status: 'success',
        message: 'Your Worker account has not been validated yet',
      }); // Forbidden response
    }

    // return next(new AppError('Please sign up as a worker first', 404)); //TODO check  ?
    else {
      res.status(404).json({
        status: 'success',
        message: 'Please sign up as a worker first',
      }); // Not found response
    }
  }
);
