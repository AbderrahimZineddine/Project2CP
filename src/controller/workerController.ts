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
  getWorkerCertificatesById,
  updateCertificateImage,
  updateCertificateTitle,
} from './workerController/certificatesController';
import { checkOwnerPortfolioPost } from './portfolioPostController.ts/checkOwnerPortfolioPost';
import { getAll } from './handlerFactory';
import { Certificate } from '../models/Certificate';
import { getWorkerSavedPostsById } from './workerController/getSavedPosts';
import { deleteRequestById, getMyRequests } from './workerController/getMyRequests';

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
  getAllCertificates: getAll(Certificate),
  deleteCertificateById: deleteCertificateById,
  addCertificate: addCertificate,
  checkTitle: checkTitle,
  checkOwnerCertificate: checkOwnerCertificate,
  getWorkerSavedPostsById: getWorkerSavedPostsById,
  getWorkerCertificatesById: getWorkerCertificatesById,
  getMyRequests : getMyRequests,
  deleteRequestById : deleteRequestById,

};

export default workerController;
