import workerController from '../controller/workerController';
import uploadController from '../controller/uploadController';
import { Router } from 'express';
import authController from '../controller/authController';

const router = Router();

router.get('/:id', workerController.getCertificateById);
router.get('/me', workerController.getMyCertificate);

router.use(authController.protect);
router.use(authController.restrictTo('Worker'));

router.patch(
  '/:id/title',
  workerController.checkOwnerCertificate,
  workerController.updateCertificateTitle
);

router.delete(
  '/:id',
  workerController.checkOwnerCertificate,
  workerController.deleteCertificateById
);

// workerController.checkTitle, //* doesn't' work ⬇️
router.post(
  '/',
  uploadController.upload.single('certificate'),
  uploadController.uploadCertificate,
  workerController.addCertificate
  );

export default router;