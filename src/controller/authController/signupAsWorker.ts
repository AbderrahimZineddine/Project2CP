import { User } from '../../models/User';
import catchAsync from '../../utils/catchAsync';
import { Response, NextFunction } from 'express';
import { Role } from '../authController';
import { MyRequest } from '../userController';
import {
  ValidateIdPictureCreate,
  ValidationRequest,
  ValidateCertificateCreate,
} from '../../models/validationRequest';
import { WorkerDoc } from '../../models/WorkerDoc';
import { Certificate, CertificateDoc } from '../../models/Certificate';
import AppError from '../../utils/appError';

export const signupAsWorker = catchAsync(
  //TODO check if already singed up
  async (req: MyRequest, res: Response, next: NextFunction) => {
    const { job, location } = req.body;

    const certificates = [];
    if (req.certificates && req.certificates.length > 0) {
      for (const certificate of req.certificates) {
        //TODO send Worker Certificates!
        // sendCertificateToAdmin(req.user, certificate);
        const cert = await Certificate.create({
          title: certificate.title,
          image: certificate.image,
        });
        certificates.push(cert.id);
      }
    }

    // await user.validate('idPicture');
    // await user.save({ validateBeforeSave: false });
    const user: WorkerDoc = await User.findByIdAndUpdate(
      req.user.id,
      {
        role: Role.Worker,
        job,
        location,
        certificates,
        idPicture: req.idPicture,
      },
      { new: true, overwriteDiscriminatorKey: true }
    );

    try {
      //* Send To admin :
      await ValidateIdPictureCreate(user.id, req.idPicture);
      for (const cert of certificates) {
        await ValidateCertificateCreate(user.id, cert);
      }
    } catch (error) {
      user.role = Role.User;
      user.job = undefined;
      user.location = undefined;
      user.certificates = undefined;
      user.idPicture = undefined;
      user.save({ validateBeforeSave: false });
      return next(
        new AppError(
          'Error while sending validation request! please sing up again',
          500
        )
      ); //500??
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
