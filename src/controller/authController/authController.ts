import { UserDoc } from 'models/UserDoc';
import { Request, Response, NextFunction } from 'express';
import { WorkerDoc } from '../../models/WorkerDoc';
import { signup } from './signup';
import { login } from './login';
import { switchRole } from './switchRole';
import { signupAsWorker } from './signupAsWorker';
import { isLoggedIn } from './isLoggedIn';
import { protect } from './protect';
import { forgotPassword } from './forgotPassword';
import { resetPassword } from './resetPassword';
import { updatePassword } from './updatePassword';
import { verifyEmail } from './verifyEmail';
import { restrictTo } from './restrictTo';
import { logout } from './logout';
import { updateEmail } from './updateEmail';
import sendVerificationEmail from './resendEmailVerification';

export interface MyRequest extends Request {
  user: UserDoc | WorkerDoc;
}
export enum Role {
  User = 'User',
  Worker = 'Worker',
}

const authController = {
  signup: signup,
  login: login,
  logout: logout,
  switchRole: switchRole,
  signupAsWorker: signupAsWorker,
  isLoggedIn: isLoggedIn,
  protect: protect,
  forgotPassword: forgotPassword,
  resetPassword: resetPassword,
  updatePassword: updatePassword,
  verifyEmail: verifyEmail,
  restrictTo: restrictTo,
  updateEmail :updateEmail,
  sendVerificationEmail : sendVerificationEmail
};

export default authController;
