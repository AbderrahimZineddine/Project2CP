import express from 'express';
import workerController from '../controller/workerController/workerController';
import authController from '../controller/authController/authController';
import userController from '../controller/userController/userController';
import { Worker } from '../models/Worker';

const router = express.Router();


router.use(authController.protect);

router.use(authController.restrictTo('Worker'));

router.route('/')
  .get(workerController.getAllWorkers)
router.get('/me', userController.getMe, workerController.getWorker);

router.patch(
  '/editMe',
  userController.uploadProfilePicture,
  userController.resizeProfilePicture,
  workerController.editMeWorker,
  userController.editMe(Worker)
);


// router.use(restrictTo('admin')); //TODO add later
// CRUD :
router
  .route('/')
  .post(workerController.createWorker);

router
  .route('/:id')  //! don't repeat that mistake !!!!!!!!!!!!!!!!!!!!!!!!!!!!! ( route(:id)) other routes after are like id ( ex : me ) )
  .get(workerController.getWorker)
  .patch(workerController.updateWorker)
  .delete(workerController.deleteWorker);


export default router;
