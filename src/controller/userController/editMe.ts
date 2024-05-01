import catchAsync from '../../utils/catchAsync';
import AppError from '../../utils/appError';
import { Response, NextFunction } from 'express';
import { unlink } from 'node:fs';
import { promisify } from 'util';
import { MyRequest } from '../userController';
import { Role } from '../../models/UserDoc';
import uploadController from '../../controller/uploadController';
// import { User } from 'models/User';
// import { Worker } from 'models/Worker';
// import { Model } from 'mongoose';
// import { WorkerDoc } from 'models/WorkerDoc';

export const editMe = (role: any) => {
  return catchAsync(
    async (req: MyRequest, res: Response, next: NextFunction) => {
      try {
        if (
          req.body.authentication &&
          (req.body.authentication.password ||
            req.body.authentication.passwordConfirm)
        ) {
          if (req.profilePicture) {
            await uploadController.deleteFromCloudinary(req.profilePicture);
          }
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
          if (req.profilePicture) {
            await uploadController.deleteFromCloudinary(req.profilePicture);
          }
          return next(
            new AppError('You cannot change your first name or last name', 400)
          ); //TODO check 400 ?
        }

        const oldPfp = req.user.profilePicture;
        const updatedUser = await role.findByIdAndUpdate(
          req.user.id,
          {
            name: req.body.name,
            
            wilaya: req.body.wilaya,
            phoneNumber: req.body.phoneNumber,
            facebookAccount : req.body.facebookAccount,
            bio : req.body.bio,
            // 'contacts.instagram': req.body.contacts
            //   ? req.body.contacts.instagram
            //   : req.user.contacts.instagram,
            // 'contacts.facebook': req.body.contacts
            //   ? req.body.contacts.facebook
            //   : req.user.contacts.facebook,
            // 'contacts.whatsapp': req.body.contacts
            //   ? req.body.contacts.whatsapp
            //   : req.user.contacts.whatsapp,
            // 'contacts.linkedin': req.body.contacts
            //   ? req.body.contacts.linkedin
            //   : req.user.contacts.linkedin,
            profilePicture: req.profilePicture ?? req.user.profilePicture,
          },
          { new: true, runValidators: true }
        );

        if (updatedUser.profilePicture != oldPfp) {
          await uploadController.deleteFromCloudinary(oldPfp);
        }

        res.status(200).json({
          status: 'success',
          data: {
            user: updatedUser,
          },
        });
      } catch (error) {
        try {
          
          if (req.profilePicture) {
            await uploadController.deleteFromCloudinary(req.profilePicture);
          }
        } catch (error) {
          if (process.env.NODE_ENV !== 'production') {
            return next(
              new AppError(
                `Some uploaded images failed to delete during editing profile: ${error.message}`,
                500
              )
            );
          } else {
            return next(new AppError('Error while editing profile', 500));
          }
        }
        
        return next(new AppError('Error while editing profile', 500));
      }
    }
  );
};
