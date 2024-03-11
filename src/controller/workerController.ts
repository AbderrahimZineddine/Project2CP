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
  checkOwnerCertificate,
  checkTitle,
  deleteCertificateById,
  getCertificateById,
  getMyCertificates,
  updateCertificateImage,
  updateCertificateTitle,
} from './workerController/certificatesController';

const workerController = {
  getWorker: getWorker,
  getAllWorkers: getAllWorkers,
  deleteWorker: deleteWorker,
  updateWorker: updateWorker,
  createWorker: createWorker,
  editMeWorker: editMeWorker,
  updateCertificateImage: updateCertificateImage,
  updateCertificateTitle: updateCertificateTitle,
  getCertificateById: getCertificateById,
  getMyCertificate: getMyCertificates,
  deleteCertificateById: deleteCertificateById,
  addCertificate: addCertificate,
  checkTitle: checkTitle,
  checkOwnerCertificate: checkOwnerCertificate
};

export default workerController;
