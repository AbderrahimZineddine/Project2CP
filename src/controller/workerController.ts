import {
  createWorker,
  deleteWorker,
  getAllWorkers,
  getWorkerById,
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
import { checkOwnerPortfolioPost } from './workerController/portfolioPostController.ts/checkOwnerPortfolioPost';

const workerController = {
  getWorkerById: getWorkerById,
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
  checkOwnerCertificate: checkOwnerCertificate,
};

export default workerController;
