import { UserDoc } from 'models/UserDoc';
import catchAsync from '../utils/catchAsync';
import { Request, Response, NextFunction, Router } from 'express';
import { Worker } from '../models/Worker';
import { WorkerDoc } from '../models/WorkerDoc';
import { restrictTo } from './authController/restrictTo';
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from './userController/getAllUsers';
import { editMe } from './userController/editMeUser';
import { getMe } from './userController/getMe';
import { updateEmail } from './authController/updateEmail';
import uploadProfilePicture from './uploadController/uploadPfp';
import upload from './uploadController/upload';
import uploadId from './uploadController/uploadId';
import { ToggleFavoriteWorker } from './userController/ToggleFavoriteWorker';
import { PostDoc } from '../models/Post';

export interface MyRequest extends Request {
  user: UserDoc | WorkerDoc;
  certificates?: {
    title: string;
    image: string;
  }[];
  idPicture?: string;
  certificate?: string;
  images?: string[];
  profilePicture?: string;
  post: PostDoc,
}

const userController = {
  getUser: getUser,
  getAllUsers: getAllUsers,
  deleteUser: deleteUser,
  updateUser: updateUser,
  createUser: createUser,
  getMe: getMe,
  editMe: editMe,
  ToggleFavoriteWorker: ToggleFavoriteWorker,
};

export default userController;
