import express from 'express';
import authController from '../controller/authController/authController';

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/verifyEmail', authController.verifyEmail);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword', authController.resetPassword);

router.use(authController.protect);
router.patch('/switch', authController.switchRole);
router.patch('/updateMyPassword', authController.updatePassword);
router.patch('/updateEmail', authController.updateEmail);

export default router;
