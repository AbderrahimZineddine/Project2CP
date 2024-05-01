import { Application } from '../models/Application';
import {
  ValidateApplicationInputs,
  applyPost,
} from './applicationController/applyPost';
import { deleteOne, getAll, getOne } from './handlerFactory';
import { updateApplication } from './applicationController/updateApplication';
import { getMyApplications } from './applicationController/getMyApplications';
import { getMyPostsApplications } from './applicationController/getMyPostsApplications';
import { checkOwnerApplication } from './applicationController/checkOwnerApplication';

const applicationController = {
  applyPost: applyPost,
  ValidateApplicationInputs: ValidateApplicationInputs,
  checkOwnerApplication: checkOwnerApplication,
  deleteApplication: deleteOne(Application),
  updateApplication: updateApplication,
  getApplicationById: getOne(Application),
  getMyApplications: getMyApplications,
  getMyPostsApplications: getMyPostsApplications,
  getAllApplications: getAll(Application),
};

export default applicationController;
