import { User } from '../../models/User';
import { UserDoc } from '../../models/UserDoc';
import catchAsync from '../../utils/catchAsync';
import AppError from '../../utils/appError';
import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Worker } from '../../models/Worker';
import { WorkerDoc } from '../../models/WorkerDoc';
import { MyRequest, Role } from '../authController';

export const protect = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    //1) get Token or return an error :
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
      // console.log(token)
    }

    if (!token) {
      return next(
        new AppError('You are not logged in! Please login to get access', 401)
      );
    }
    // 2) Verify Token
    //! from http://stackoverflow.com/questions
    const jwtVerifyPromisified = (
      token: string,
      secret: string
    ): Promise<any> => {
      return new Promise((resolve, reject) => {
        jwt.verify(token, secret, {}, (err, payload) => {
          if (err) {
            reject(err);
          } else {
            resolve(payload);
          }
        });
      });
    };

    

    const decoded = await jwtVerifyPromisified(
      token, //* sorry
      process.env.JWT_SECRET
    );

    //3) Check if user still exists or password is still the same
    let currentUser: UserDoc | WorkerDoc;
    const currentRole = decoded.currentRole;
    // console.log("currentRole is : ", currentRole);
    if (currentRole == Role.Worker) {
      //TODO :check
      currentUser = await Worker.findById(decoded.id);
      //console.log("currentUser is : ", currentUser);
      if (!currentUser || !(currentUser as WorkerDoc).workerAccountVerified) {
        return next(new AppError('your account is not verified yet!', 400));
      }
    } else {
      currentUser = await User.findById(decoded.id);
    }

    if (!currentUser) {
      return next(
        new AppError('The user belonging to the token no longer exists', 400)
      ); //TODO 400 ?
    }

    if (!currentUser.authentication.isVerified) {
      return next(
        new AppError(
          'You are not verified! Please verify your email account and login',
          400
        )
      ); //TODO 400 ?
    }

    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError('User recently changed password! Please log in again', 401)
      );
    }

    //we good : grant access to protected route :
    // (req as MyRequest).user = currentUser;
    req.user = currentUser;
    res.locals.user = currentUser; //TODO do you need need this
    // go to protected route
    next();
  }
);
