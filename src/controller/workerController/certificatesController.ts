import { NextFunction, Response } from 'express';
import { MyRequest } from '../userController';
import catchAsync from '../../utils/catchAsync';
import { Certificate } from '../../models/Certificate';
import {
  ValidateCertificateCreate,
  ValidationRequest,
} from '../../models/validationRequest';
import AppError from '../../utils/appError';
import { WorkerDoc } from 'models/WorkerDoc';
import mongoose from 'mongoose';
import uploadController from '../../controller/uploadController';

export const updateCertificateImage = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!req.certificate) {
      return next(new AppError('Certificate image not found', 404)); //404 ??
    }
    const cert = await Certificate.findById(id);
    const oldCert = cert;
    (cert.image = req.certificate), (cert.isValid = false), await cert.save();
    try {
      await ValidateCertificateCreate(req.user.id, cert.id);
    } catch (error) {
      cert.image = oldCert.image;
      uploadController.deleteFromCloudinary(req.certificate);
      cert.isValid = oldCert.isValid;
      cert.save();
      return next(
        new AppError(
          'Error sending certificate validation request! Please try again',
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
    const id = req.params.id;
    if (!req.body.title) {
      return next(new AppError('Certificate title not found', 404)); //404 ??
    }
    const cert = await Certificate.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
    });
   
    res.status(200).json({
      status: 'success',
      message: 'Certificate sent to admin successfully',
      certificate: cert,
    });
  }
);

export const getCertificateById = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    const certificate = await Certificate.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      certificate,
    });
  }
);

export const deleteCertificateById = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    if (!req.params.id) {
    }
    if (
      (req.user as WorkerDoc).certificates.includes(
        req.params.id as unknown as mongoose.Types.ObjectId //! ?
      )
    ) {
      // await Certificate.findByIdAndDelete(req.params.id);
      const certificate = await Certificate.findById(req.params.id);
      if (!certificate) {
        return next(
          new AppError(
            'No certificate found with this id :' + req.params.id,
            404
          )
        );
      }
      try {
        await uploadController.deleteFromCloudinary(certificate.image);
      } catch (error) {
        return next(
          new AppError(
            'Error deleting certificate! Please try again later',
            500
          )
        );
      }
      (req.user as WorkerDoc).certificates = (
        req.user as WorkerDoc
      ).certificates.filter(
        (certificate) =>
          certificate != (req.params.id as unknown as mongoose.Types.ObjectId)
      );
      await req.user.save({ validateBeforeSave: false });
      await ValidationRequest.findOneAndDelete({ certificate: req.params.id });
      res.status(200).json({
        status: 'success',
      });
    }
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
    if (!req.certificate) {
      return next(new AppError('Please provide a certificate image !', 404));
    }
    let pushed = false;
    try {
      const certificate = await Certificate.create({
        image: req.certificate,
        title: req.body.title,
      });
      (req.user as WorkerDoc).certificates.push(certificate.id);
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
