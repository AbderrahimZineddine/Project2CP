import { Application } from '../models/Application';
import {
  ValidateApplicationInputs,
  applyPost,
} from './applicationController/applyPost';
import { deleteOne, getAll, getOne } from './handlerFactory';
import { updateApplication } from './applicationController/updateApplication';
import {
  getMyApplications,
  getMyApplicationsReceived,
} from './applicationController/getMyApplications';
import { getMyPostsApplications } from './applicationController/getMyPostsApplications';
import {
  checkOwnerApplication,
  checkSentApplication,
} from './applicationController/checkOwnerApplication';

const applicationController = {
  applyPost: applyPost,
  ValidateApplicationInputs: ValidateApplicationInputs,
  checkOwnerApplication: checkOwnerApplication,
  checkSentApplication: checkSentApplication,
  deleteApplication: deleteOne(Application),
  updateApplication: updateApplication,
  getApplicationById: getOne(Application),
  getMyApplications: getMyApplications,
  getMyPostsApplications: getMyPostsApplications,
  getMyApplicationsReceived: getMyApplicationsReceived,
  getAllApplications: getAll(Application),
};

export default applicationController;
