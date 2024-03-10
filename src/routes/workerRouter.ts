import express from 'express';
import workerController from '../controller/workerController';
import authController from '../controller/authController';
import userController from '../controller/userController';
import { Worker } from '../models/Worker';
import uploadController from '../controller/uploadController';
import upload from 'controller/uploadController/upload';

const router = express.Router();

router.use(authController.protect);

router.patch(
  '/certificates/:id/image',
  uploadController.upload.single('certificate'),
  uploadController.uploadCertificate,
  workerController.updateCertificateImage
);
router.patch(
  '/certificates/:id/title',
  workerController.updateCertificateTitle
);
router.get('/certificates/:id', workerController.getCertificateById);
router.delete('/certificates/:id', workerController.deleteCertificateById);
router.post(
  '/certificates/',
  uploadController.upload.single('certificate'),
  uploadController.uploadCertificate,
  workerController.addCertificate
);

router.use(authController.restrictTo('Worker'));

router.route('/').get(workerController.getAllWorkers);
router.get('/me', userController.getMe, workerController.getWorker);

router.patch(
  '/editMe',
  // userController.upload.single('profilePicture'),
  uploadController.upload.single('profilePicture'),
  uploadController.uploadProfilePicture,
  // userController.upload.array('certificates'),
  // uploadController.uploadCertificates,
  workerController.editMeWorker,
  userController.editMe(Worker)
);

// router.use(restrictTo('admin')); //TODO add later
// CRUD :
router.route('/').post(workerController.createWorker);

router
  .route('/:id') //! don't repeat that mistake !!!!!!!!!!!!!!!!!!!!!!!!!!!!! ( route(:id)) other routes after are like id ( ex : me ) )
  .get(workerController.getWorker)
  .patch(workerController.updateWorker)
  .delete(workerController.deleteWorker);

export default router;
