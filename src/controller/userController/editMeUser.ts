import AppError from '../../utils/appError';
import { Response, NextFunction } from 'express';
// import { unlink } from 'node:fs';
// import { promisify } from 'util';
import { MyRequest } from '../userController';
import { Role } from '../../models/UserDoc';
import uploadController from '../../controller/uploadController';

export const editMe = (role: any) => {
  return async (req: MyRequest, res: Response, next: NextFunction) => {
    let oldDeleted = false;
    try {
      if (
        req.body.authentication &&
        (req.body.authentication.password ||
          req.body.authentication.passwordConfirm)
      ) {
        throw new AppError(
          'This route is not for password updates. Please use /updateMyPassword',
          400
        );
      }

      // if (req.user.role === Role.Worker && req.body.name) {
      //   throw new AppError(
      //     'You cannot change your name because it is linked to your id card!',
      //     400
      //   );
      // }

      const oldPfp = req.user.profilePicture;
      const updatedUser = await role.findByIdAndUpdate(
        req.user.id,
        {
          name: req.body.name,
          wilaya: req.body.wilaya,
          phoneNumber: req.body.phoneNumber,
          facebook: req.body.facebook,
          bio: req.body.bio,

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

          profilePicture: req.profilePicture ?? oldPfp,
        },

        { new: true, runValidators: true }
      );

      if (updatedUser && updatedUser.profilePicture != oldPfp) {
        try {
          oldDeleted = true;

          await uploadController.deleteFromCloudinary(oldPfp);
        } catch (error) {
          if (process.env.NODE_ENV !== 'production') {
            throw new AppError(
              'Error while deleting old profile picture from editing user: ' +
                error.message,

              500
            );
          }
        }
      }

      res.status(200).json({
        status: 'success',

        user: updatedUser,
      });
    } catch (error) {
      // oldDeleted = false => the user was updated successfully so you shoudn't delete req.pfp (which is now user.pfp)
      // if error occured while deleting old profile picture it is already handled
      if (!oldDeleted && req.profilePicture) {
        try {
          await uploadController.deleteFromCloudinary(req.profilePicture);
        } catch (error) {
          if (process.env.NODE_ENV !== 'production') {
            throw new AppError(
              'Error while deleting old profile picture from editing user: ' +
                error.message,
              500
            );
          }
        }
      }

      if (error instanceof AppError) {
        return next(error);
      } else {
        // console.log(error)
        return next(
          new AppError(
            'Error while editing profile! ERROR : ' + error.message,
            500
          )
        );
      }
    }
  };
};
