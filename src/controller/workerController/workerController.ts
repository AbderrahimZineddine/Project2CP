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
import uploadCerteficates from './uploadCerteficate';

const workerController = {
  getWorker: getWorker,
  getAllWorkers: getAllWorkers,
  deleteWorker: deleteWorker,
  updateWorker: updateWorker,
  createWorker: createWorker,
  editMeWorker: editMeWorker,
  uploadCerteficates : uploadCerteficates,
  
};

export default workerController;
