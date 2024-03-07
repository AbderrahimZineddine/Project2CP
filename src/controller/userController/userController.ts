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
import { editMe } from './editMeUser';
import { getMe } from './getMe';
import { updateEmail } from '../authController/updateEmail';
import uploadProfilePicture from './uploadPfp';
import upload from './upload';
import uploadId from './uploadId';

export interface MyRequest extends Request {
  user: UserDoc | WorkerDoc;
  certeficates?: {
    title: string;
    image: string;
  }[];
  idPicture?: string;
}

const userController = {
  getUser: getUser,
  getAllUsers: getAllUsers,
  deleteUser: deleteUser,
  updateUser: updateUser,
  createUser: createUser,
  getMe: getMe,
  editMe: editMe,
  upload : upload,
  uploadProfilePicture: uploadProfilePicture,
  uploadId : uploadId,

};

export default userController;
