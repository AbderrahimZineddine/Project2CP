import express from 'express';
import workerController from '../controller/workerController/workerController';
import authController from '../controller/authController/authController';
import userController from '../controller/userController/userController';
import { Worker } from '../models/Worker';

const router = express.Router();

// router.use(restrictTo('admin')); //TODO add later
// CRUD :
router
  .route('/')
  .get( workerController.getAllWorkers)
  .post( authController.restrictTo('admin'), workerController.createWorker);

router
  .route('/:id')
  .get( workerController.getWorker)
  .patch(authController.restrictTo('admin'), workerController.updateWorker)
  .delete(authController.restrictTo('admin'), workerController.deleteWorker);



router.use(authController.protect);

router.use(authController.restrictTo('Worker'));

router.get('/me', userController.getMe, workerController.getWorker);

router.patch(
  '/editMe',
  userController.uploadProfilePicture,
  userController.resizeProfilePicture,
  workerController.editMeWorker,
  userController.editMeUser(Worker)
);

export default router;
