import catchAsync from '../../utils/catchAsync';
import AppError from '../../utils/appError';
import { Response, NextFunction } from 'express';
import { unlink } from 'node:fs';
import { promisify } from 'util';
import { MyRequest } from '../userController';
import { Role } from '../../models/UserDoc';
// import { User } from 'models/User';
// import { Worker } from 'models/Worker';
// import { Model } from 'mongoose';
// import { WorkerDoc } from 'models/WorkerDoc';

export const editMe = (role: any) => {
  return catchAsync(
    async (req: MyRequest, res: Response, next: NextFunction) => {
      if (
        req.body.authentication &&
        (req.body.authentication.password ||
          req.body.authentication.passwordConfirm)
      ) {
        return next(
          new AppError(
            'This route is not for password updates. Please use /updateMyPassword',
            400
          )
        );
      }

      if (
        req.user.role === Role.Worker &&
        (req.body.firstName || req.body.lastName)
      ) {
        return next(
          new AppError('You cannot change your first name or last name', 400)
        ); //TODO check 400 ?
      }

      // const oldfilename = req.user.profilePicture;
      // let model;
      // if (role === Role.Worker) {
      //   model = Worker;
      // } else {
      //   model = User;
      // }
      const updatedUser = await role.findByIdAndUpdate(
        req.user.id,
        {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          wilaya: req.body.wilaya,
          phoneNumber: req.body.phoneNumber,
          'contacts.instagram': req.body.contacts
            ? req.body.contacts.instagram
            : req.user.contacts.instagram,
          'contacts.facebook': req.body.contacts
            ? req.body.contacts.facebook
            : req.user.contacts.facebook,
          'contacts.whatsapp': req.body.contacts
            ? req.body.contacts.whatsapp
            : req.user.contacts.whatsapp,
          'contacts.linkedin': req.body.contacts
            ? req.body.contacts.linkedin
            : req.user.contacts.linkedin,
          // profilePicture: req.file
          //   ? req.file.filename
          //   : req.user.profilePicture,
        },
        { new: true, runValidators: true }
      );

      // try {
      //   if (req.file && oldfilename != 'default.jpg') {
      //     // delete the previous image !
      //     const unlinkPromisified = promisify(unlink);
      //     await unlinkPromisified(`src/public/img/users/${oldfilename}`);
      //   }
      // } catch (error) {
      //   return next(new AppError('Error deleting old profile picture !', 400)); //400??
      // }
      res.status(200).json({
        status: 'success',
        data: {
          user: updatedUser,
        },
      });
    }
  );
};
