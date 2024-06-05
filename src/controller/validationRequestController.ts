import { NextFunction, Response } from 'express';
import {
  ValidateIdPictureCreate,
  ValidationRequest,
  ValidationType,
} from '../models/validationRequest';
import { getAll, getOne } from './handlerFactory';
import { MyRequest } from './userController';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import { Certificate } from '../models/Certificate';
import { Worker } from '../models/Worker';
import uploadController from './uploadController';
import { Role } from '../models/UserDoc';
import { WorkerDoc } from '../models/WorkerDoc';
import { User } from '../models/User';
import {
  Notification,
  NotificationDataModel,
  NotificationType,
} from '../models/Notification';

const approveValidationRequest = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    const valReq = await ValidationRequest.findById(req.params.id);
    if (!valReq) {
      return next(
        new AppError(
          'There is no validation request with id ' + req.params.id,
          404
        )
      );
    }

    if (valReq.type === ValidationType.Certificate) {
      //   const cert = await Certificate.findById(valReq.certificate);
      //   if (!cert) {
      //     return next(
      //       new AppError(
      //         'There is no Certificate with id ' + valReq.certificate,
      //         404
      //       )
      //     );
      //   }
      console.log('in');
      const cert = valReq.certificate;
      cert.isValid = true;
      cert._acceptedAt = new Date(Date.now());
      await cert.save({ validateBeforeSave: false });
      // await ValidationRequest.findByIdAndDelete(req.params.id);
      await ValidationRequest.findByIdAndUpdate(
        req.params.id,
        { _deletedAt: Date.now() },
        { new: true }
      );

      await Notification.create({
        receiverId: valReq.worker.id,
        dataModel: NotificationDataModel.Certificate,
        data: valReq.certificate.id,
        title: 'Certificate Approved !',
        body: 'Your certificate has been accepted by the admin',
        type: NotificationType.CertificateApproved,
      });
      res.status(200).json({ status: 'success', certificate: cert });
    } else {
      const worker = valReq.worker;
      worker.workerAccountVerified = true;
      await worker.save({ validateBeforeSave: false });
      await worker.checkCertifiedStatus();
      // await ValidationRequest.findByIdAndDelete(req.params.id);
      await ValidationRequest.findByIdAndUpdate(
        req.params.id,
        { _deletedAt: Date.now() },
        { new: true }
      );
      await Notification.create({
        receiverId: worker.id,
        dataModel: NotificationDataModel.Worker,
        data: worker.id,
        title: 'Worker Account not accepted !',
        body: 'Your request for a worker account has not been accepted by the admin',
        type: NotificationType.WorkerAccountApproved,
      });
      res.status(200).json({ status: 'success', worker });
    }
  }
);

const disapproveValidationRequest = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    const valReq = await ValidationRequest.findById(req.params.id);
    if (!valReq) {
      return next(
        new AppError(
          'There is no validation request with id ' + req.params.id,
          404
        )
      );
    }

    if (valReq.type === ValidationType.Certificate) {
      // await Certificate.findByIdAndDelete(valReq.certificate.id);
      await Certificate.findByIdAndUpdate(
        valReq.certificate.id,
        { _deletedAt: new Date(Date.now()) },
        { new: true }
      );

      await valReq.worker.checkCertifiedStatus();
      // await ValidationRequest.findByIdAndDelete(req.params.id);
      await ValidationRequest.findByIdAndUpdate(
        req.params.id,
        { _deletedAt: Date.now() },
        { new: true }
      );

      await Notification.create({
        receiverId: valReq.worker.id,
        dataModel: NotificationDataModel.Certificate,
        data: valReq.worker.id,
        title: 'Certificate Disapproved !',
        body: 'Your certificate has not been accepted by the admin',
        type: NotificationType.CertificateDisapproved,
      });
      res.status(200).json({ status: 'success' });
    } else {
      const worker = valReq.worker;
      worker.workerAccountVerified = false;
      worker.job = undefined;
      worker.isCertified = undefined;
      worker.experience = undefined;
      worker.rating = undefined;
      worker.location = undefined;
      worker.ratingsNumber = undefined;
      worker.portfolioPosts = undefined;
      worker.savedPosts = undefined;
      if (worker.idPicture) {
        await uploadController.deleteFromCloudinary(worker.idPicture);
        worker.idPicture = undefined;
      }
      if (worker.certificates) {
        for (const certificate of worker.certificates) {
          const cert = await Certificate.findById(certificate);

          await uploadController.deleteFromCloudinary(cert.image);
          await Certificate.findByIdAndDelete(certificate);
        }
        worker.certificates = undefined;
      }
      await worker.save({ validateBeforeSave: false }); //TODO check if it is necessary
      await User.findByIdAndUpdate(
        worker.id,
        {
          role: Role.User,
          currentRole: Role.User,
        },
        {
          new: true,
          overwriteDiscriminatorKey: true,
          runValidators: false,
        }
      );

      // await ValidationRequest.findByIdAndDelete(req.params.id);
      await ValidationRequest.findByIdAndUpdate(
        req.params.id,
        { _deletedAt: Date.now() },
        { new: true }
      );

      await Notification.create({
        receiverId: worker.id,
        dataModel: NotificationDataModel.User,
        data: worker.id,
        title: 'Worker Account not accepted !',
        body: 'Your request for a worker account has not been accepted by the admin',
        type: NotificationType.WorkerAccountDisapproved,
      });
      res.status(200).json({ status: 'success' });
    }
  }
);

const validationRequestController = {
  approveValidationRequest: approveValidationRequest,
  disapproveValidationRequest: disapproveValidationRequest,
  getValidationRequestById: getOne(ValidationRequest),
  getAllValidationRequests: getAll(ValidationRequest),
};

export default validationRequestController;
