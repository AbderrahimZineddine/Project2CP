import { Role, UserDoc } from '../models/UserDoc';
import { Request, Response, NextFunction, Router } from 'express';
import { WorkerDoc } from '../models/WorkerDoc';
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from './userController/getAllUsers';
import { editMe } from './userController/editMeUser';
import { getMe } from './userController/getMe';
import {
  ToggleFavoriteWorker,
  getFavoriteWorkers,
  getFavoriteWorkersFromUserId,
} from './userController/ToggleFavoriteWorker';
import { PostDoc } from '../models/Post';
import { ApplicationDoc } from 'models/Application';
import { DealDoc } from '../models/Deal';
import { ReviewDoc } from '../models/Review';
import { getMap } from './userController/getMap';

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
  post: PostDoc;
  application: ApplicationDoc;
  deal: DealDoc;
  dealRole: Role;
  review: ReviewDoc;
}

const userController = {
  getUser: getUser,
  getMap : getMap,
  getAllUsers: getAllUsers,
  deleteUser: deleteUser,
  updateUser: updateUser,
  createUser: createUser,
  getMe: getMe,
  editMe: editMe,
  ToggleFavoriteWorker: ToggleFavoriteWorker,
  getFavoriteWorkers: getFavoriteWorkers,
  getFavoriteWorkersFromUserId: getFavoriteWorkersFromUserId,
};

export default userController;
