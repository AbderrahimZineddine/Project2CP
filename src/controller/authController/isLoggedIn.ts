import { User } from '../../models/User';
import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { MyRequest } from './authController';

export const isLoggedIn = async (
  req: MyRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.cookies.jwt) {
      return next();
    }

    // 1) Verify Cookie : //function returns an error if not valid
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
      req.cookies.jwt,
      process.env.JWT_SECRET
    );

    //2) Check if user still exists or password is still the same
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next();
    }

    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next();
    }

    //we good
    res.locals.user = currentUser;
  } catch (error) {
    return next(); // return without setting the user
  }
};
