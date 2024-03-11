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
import uploadController from '../../controller/uploadController';

export const signupAsWorker = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    const { job, location } = req.body;

    // if (!job || !location || !req.idPicture) {  //TODO require location !
    if (!job || !req.idPicture) {
      await cancelSingupAsWorker(req.user as WorkerDoc, req, next);

      return next(
        new AppError(
          'Please provide all required information for signing up as a worker',
          400
        )
      );
    }

    try {
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
      console.log(user);
      //* Send To admin :
      // const val1 = await ValidateIdPictureCreate(user.id, req.idPicture);
      const val1 = await ValidationRequest.create({
        worker: user.id,
        idPicture: req.idPicture,
        type: 'idPicture',
      });
      console.log(val1);
      for (const cert of certificates) {
        // const v2 = await ValidateCertificateCreate(user.id, cert);
        const v2 = await ValidationRequest.create({
          worker: user.id,
          certificate: cert,
          type: 'Certificate',
        });
        console.log(v2);
      }
      req.user = user; //TODO ?? what to send ?
      res.status(200).json({
        status: 'success',
        message:
          'Sign up as a worker successfully! Please wait for your id validation to login',
        worker: user,
      });
    } catch (error) {
      await cancelSingupAsWorker(req.user as WorkerDoc, req, next);
      console.log(error);
      return next(
        new AppError(
          'Error while sending validation request! please sing up again',
          500
        )
      ); //500??
    }
  }
);
async function cancelSingupAsWorker(
  user: WorkerDoc,
  req: MyRequest,
  next: NextFunction
) {
  user.role = Role.User;
  user.job = undefined;
  user.location = undefined;
  let errorMessages = [];
  for (const cert of req.certificates) {
    try {
      await uploadController.deleteFromCloudinary(cert.image);
    } catch (error) {
      errorMessages.push(`Error deleting certificate image: ${error.message}`);
      // Log or handle the error as needed
    }
  }
  user.certificates = undefined;
  try {
    await uploadController.deleteFromCloudinary(req.idPicture);
    user.idPicture = undefined;
  } catch (error) {
    errorMessages.push(`Error deleting idPicture: ${error.message}`);
    // Log or handle the error as needed
  }
  // user.save({ validateBeforeSave: false }); //doesnt work!
  await User.replaceOne({ _id: user._id }, user, {
    overwriteDiscriminatorKey: true,
    runValidators: false,
  });

  if (process.env.NODE_ENV !== 'production' && errorMessages.length > 0) {
    return next(
      new AppError(
        `Some uploaded images failed to delete during signup: ${errorMessages.join(
          ', '
        )}`,
        400
      )
    );
  }
}
