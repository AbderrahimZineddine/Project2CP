import { MyRequest } from '../userController/userController';
import { NextFunction, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { WorkerDoc } from '../../models/WorkerDoc';
import { CerteficateToAdmin } from '../../models/CerteficateToAdmin';

export const editMeWorker = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    console.log('req.cer : ', req.certeficates)
    if (req.certeficates) {
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
    // if (req.body.firstName || req.body.lastName ) {
    //     return next(new AppError('You cannot change your first name or last name', 400)) //TODO check 400 ?
    // }
    if (req.body.job) {
      (req.user as WorkerDoc).job = req.body.job;
      req.user.save({ validateModifiedOnly: true });
    }
    if (req.body.location) {
      (req.user as WorkerDoc).location = req.body.location;
      req.user.save({ validateModifiedOnly: true });
    }

    next();
  }
);
