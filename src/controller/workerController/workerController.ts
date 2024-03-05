import {
  resizeProfilePicture,
  uploadProfilePicture,
} from '../userController/multerStorage';
import {
  createWorker,
  deleteWorker,
  getAllWorkers,
  getWorker,
  updateWorker,
} from './workerCRUD';
import { getMe } from '../userController/getMe';
import { editMeWorker } from './editMeWorker';
import { updateEmail } from '../authController/updateEmail';

const workerController = {
  getWorker: getWorker,
  getAllWorkers: getAllWorkers,
  deleteWorker: deleteWorker,
  updateWorker: updateWorker,
  createWorker: createWorker,
  editMeWorker: editMeWorker,
};

export default workerController;
