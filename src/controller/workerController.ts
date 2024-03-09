import {
  createWorker,
  deleteWorker,
  getAllWorkers,
  getWorker,
  updateWorker,
} from './workerController/workerCRUD';
import { editMeWorker } from './workerController/editMeWorker';
import uploadCertificates from './uploadController/uploadCertificate';
import {
  addCertificate,
  deleteCertificateById,
  getCertificateById,
  updateCertificate,
} from './workerController/certificatesController';

const workerController = {
  getWorker: getWorker,
  getAllWorkers: getAllWorkers,
  deleteWorker: deleteWorker,
  updateWorker: updateWorker,
  createWorker: createWorker,
  editMeWorker: editMeWorker,
  updateCertificate: updateCertificate,
  getCertificateById: getCertificateById,
  deleteCertificateById: deleteCertificateById,
  addCertificate: addCertificate,
};

export default workerController;
