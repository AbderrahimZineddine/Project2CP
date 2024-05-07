import { MyRequest } from '../userController';
import { NextFunction, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { WorkerDoc } from '../../models/WorkerDoc';
import { ValidationRequest } from '../../models/validationRequest';
import { Certificate } from '../../models/Certificate';

export const editMeWorker = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    // const certificates = (req.user as WorkerDoc).certificates;
    // if (req.certificates && req.certificates.length > 0) {
    //   for (const certificate of req.certificates) {
    //     const cert = await Certificate.create({
    //       title: certificate.title,
    //       image: certificate.image,
    //     });
    //     certificates.push(cert.id);
    //   }
    // }

    // console.log(req.body.job)
    if (req.body.job) {
      (req.user as WorkerDoc).job = req.body.job;
      await req.user.save({ validateModifiedOnly: true });
    }
    if (req.body.lat && req.body.lng && req.body.title ) {
      (req.user as WorkerDoc).location.lat = req.body.lat;
      (req.user as WorkerDoc).location.lng = req.body.lng;
      (req.user as WorkerDoc).location.title = req.body.title;

      await req.user.save({ validateModifiedOnly: true });
    }

    next();
  }
);
