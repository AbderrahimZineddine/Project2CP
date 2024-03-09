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

export const updateCertificate = catchAsync(
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
    if (
      (req.user as WorkerDoc).certificates.includes(
        req.params.id as unknown as mongoose.Types.ObjectId //! ?
      )
    ) {
      await Certificate.findByIdAndDelete(req.params.id);
      (req.user as WorkerDoc).certificates = (
        req.user as WorkerDoc
      ).certificates.filter(
        (certificate) =>
          certificate != (req.params.id as unknown as mongoose.Types.ObjectId)
      );
      await ValidationRequest.findOneAndDelete({ certificate: req.params.id });
      await req.user.save({ validateBeforeSave: false });
      res.status(200).json({
        status: 'success',
      });
    }
  }
);

export const addCertificate = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    if (!req.certificate || !req.body.title) {
      return next(
        new AppError('Please provide a certificate and a title!', 404)
      );
    }

    const certificate = await Certificate.create({
      image: req.certificate,
      title: req.body.title,
    });
    (req.user as WorkerDoc).certificates.push(certificate.id);

    res.status(200).json({
      status: 'success',
    });
  }
);
