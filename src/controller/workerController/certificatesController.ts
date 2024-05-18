import { NextFunction, Response } from 'express';
import { MyRequest } from '../userController';
import catchAsync from '../../utils/catchAsync';
import { Certificate, CertificateDoc } from '../../models/Certificate';
import {
  ValidateCertificateCreate,
  ValidationRequest,
} from '../../models/validationRequest';
import AppError from '../../utils/appError';
import { WorkerDoc } from 'models/WorkerDoc';
import mongoose from 'mongoose';
import uploadController from '../../controller/uploadController';
import { Worker } from '../../models/Worker';

export const updateCertificateImage = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!req.certificate) {
      throw new AppError('Certificate image not found', 404); //404 ??
    }
    const cert = await Certificate.findById(id);
    if (!cert) {
      throw new AppError('No Certificate found with that id', 404);
    }
    // const oldCert = {...cert}; //! error
    const oldImage = cert.image;
    const oldIsValid = cert.isValid;
    cert.image = req.certificate;
    cert.isValid = false;
    await cert.save();
    await (req.user as WorkerDoc).checkCertifiedStatus();
    try {
      await ValidationRequest.create({
        worker: req.user.id,
        certificate: cert.id,
        type: 'Certificate',
      });
      await uploadController.deleteFromCloudinary(oldImage);
    } catch (error) {
      cert.image = oldImage;
      uploadController.deleteFromCloudinary(req.certificate);
      cert.isValid = oldIsValid;
      cert.save({ validateBeforeSave: false });
      await (req.user as WorkerDoc).checkCertifiedStatus();

      console.log(error);
      if (error instanceof AppError) {
        return next(error);
      }
      return next(
        new AppError(
          'Error sending certificate validation request! Please try again' +
            error.message,
          500
        )
      ); //500?
    }
    res.status(200).json({
      status: 'success',
      message: 'Certificate sent to admin successfully',
      certificate: cert,
    });
  }
);

export const updateCertificateTitle = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    if (!req.body.title) {
      return next(new AppError('Certificate title not found', 404)); //404 ??
    }
    const cert = await Certificate.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      status: 'success',
      message: 'Certificate updated successfully',
      certificate: cert,
    });
  }
);

export const getCertificateById = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    const certificate = await Certificate.findById(req.params.id);
    if (!certificate) {
      return next(new AppError('No Certificate found with that id', 404));
    }
    res.status(200).json({
      status: 'success',
      certificate,
    });
  }
);

export const deleteCertificateById = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    console.log('deleteCertificate');

    // await Certificate.findByIdAndDelete(req.params.id);
    const certificate = await Certificate.findById(req.params.id);
    if (!certificate) {
      return next(
        new AppError('No certificate found with this id :' + req.params.id, 404)
      );
    }
    try {
      await uploadController.deleteFromCloudinary(certificate.image);
    } catch (error) {
      return next(
        new AppError('Error deleting certificate! Please try again later', 500)
      );
    }
    // (req.user as WorkerDoc).certificates = (
    //   req.user as WorkerDoc
    // ).certificates.filter(
    //   (certificate) =>
    //     certificate != (req.params.id as unknown as mongoose.Types.ObjectId)
    // );
    // await req.user.save({ validateBeforeSave: false });

    await ValidationRequest.findOneAndDelete({ certificate: req.params.id });
    certificate._deletedAt = new Date(Date.now());
    await (req.user as WorkerDoc).checkCertifiedStatus();
    // certificate._acceptedAt = undefined; //TODO check again
    await certificate.save({ validateModifiedOnly: true });

    res.status(200).json({
      status: 'success',
    });
  }
);

export const checkTitle = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    if (!req.body.title) {
      return next(new AppError('Please provide a certificate title !', 404));
    }
    next();
  }
);

export const addCertificate = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    if (!req.certificate || !req.body.title) {
      return next(
        new AppError('Please provide a certificate image and title !', 404)
      );
    }
    //
    let pushed = false;
    try {
      const certificate = await Certificate.create({
        image: req.certificate,
        title: req.body.title,
      });
      (req.user as WorkerDoc).certificates.push(certificate.id);
      await (req.user as WorkerDoc).save({ validateBeforeSave: false });
      await (req.user as WorkerDoc).checkCertifiedStatus();

      req.user.save({ validateBeforeSave: false });
      pushed = true;
      await ValidateCertificateCreate(req.user.id, certificate.id);

      res.status(200).json({
        status: 'success',
        certificate,
      });
    } catch (error) {
      uploadController.deleteFromCloudinary(req.certificate);

      if (pushed) {
        (req.user as WorkerDoc).certificates.pop();
        await req.user.save({ validateBeforeSave: false });
        await (req.user as WorkerDoc).checkCertifiedStatus();

        return next(
          new AppError(
            'Error while sending validation request! please try again later',
            500
          )
        );
      }
      return next(
        new AppError(
          'Error while creating certificate! please try again later',
          500
        )
      );
    }
  }
);

export const checkOwnerCertificate = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    if (
      !(req.user as WorkerDoc).certificates.find(
        (val: any) => val.id === req.params.id
      )
    ) {
      return next(
        new AppError('This certificate does not belong to this user', 404)
      );
    }
    next();
  }
);

export const getMyCertificates = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    const certificates = [];
    for (const certId of (req.user as WorkerDoc).certificates) {
      const cert = await Certificate.findById(certId);
      if (cert) {
        certificates.push(cert);
      }
    }
    res.status(200).json({
      status: 'success',
      certificates,
    });
  }
);

export const getWorkerCertificatesById = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    const worker: WorkerDoc = await Worker.findById(req.params.id).populate({
      path: 'certificates',
    });

    if (!worker) {
      return next(
        new AppError('there no worker with id ' + req.params.id, 404)
      );
    }

    // const certificates = [];
    // for (const certId of worker.certificates) {
    //   const cert = await Certificate.findById(certId);
    //   if (cert) {
    //     certificates.push(cert);
    //   }
    // }
    res.status(200).json({
      status: 'success',
      certificates: worker.certificates,
    });
  }
);
