import { UserDoc } from 'models/UserDoc';
import catchAsync from '../../utils/catchAsync';
import { Request, Response, NextFunction, Router } from 'express';
import { Worker } from '../../models/Worker';
import { WorkerDoc } from '../../models/WorkerDoc';
import { restrictTo } from '../authController/restrictTo';
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from './getAllUsers';
import { resizeProfilePicture, uploadProfilePicture } from './multerStorage';
import { editMe } from './editMeUser';
import { getMe } from './getMe';
import { updateEmail } from '../authController/updateEmail';

export interface MyRequest extends Request {
  user: UserDoc | WorkerDoc;
}

const userController = {
  getUser: getUser,
  getAllUsers: getAllUsers,
  deleteUser: deleteUser,
  updateUser: updateUser,
  createUser: createUser,
  uploadProfilePicture: uploadProfilePicture,
  resizeProfilePicture: resizeProfilePicture,
  getMe: getMe,
  editMe: editMe,
};

export default userController;
