"use strict";
// import { Error } from 'mongoose';
// import AppError from '../utils/appError';
Object.defineProperty(exports, "__esModule", { value: true });
// const handleCastErrorDB = (err : AppError) => {
//   const message = `Invalid ${err.path}: ${err.value}.`;
//   return new AppError(message, 400);
// };
// const handleDuplicateFieldsDB = (err : AppError) => {
//   const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
//   // console.log(value);
//   const message = `Duplicate field value: ${value}. Please use another value!`;
//   return new AppError(message, 400);
// };
// const handleValidationErrorDB = (err : AppError) => {
//   const errors = Object.values(err.errors).map((el) => el.message);
//   const message = `Invalid input data. ${errors.join('. ')}`;
//   return new AppError(message, 400);
// };
// const handleJWTError = () =>
//   new AppError('Invalid token. Please log in again', 401);
// const handleJWTExpiredError = () =>
//   new AppError('Your token has expired. Please log in again', 401);
// const sendErrorDev = (err, req, res) => {
//   // api
//   if (req.originalUrl.startsWith('/api')) {
//     res.status(err.statusCode).json({
//       status: err.status,
//       error: err,
//       message: err.message,
//       stack: err.stack,
//     });
//   } else {
//     // Rendered website
//     res.status(err.statusCode).render('error', {
//       title: 'Something went  wrong!',
//       msg: err.message,
//     });
//   }
// };
// const sendErrorProd = (err, req, res) => {
//   if (req.originalUrl.startsWith('/api')) {
//     // Operational, trusted error: send message to client
//     if (err.isOperational) {
//       return res.status(err.statusCode).json({
//         status: err.status,
//         message: err.message,
//       });
//     }
//     // Programming or other unknown error: don't leak error details
//     // 1) Log error
//     console.error('ERROR 💥😶‍🌫️😶‍🌫️😶‍🌫️😶‍🌫️😶‍🌫️😶‍🌫️😶‍🌫️😶‍🌫️', err : AppError);
//     // 2) Send generic message
//     return res.status(500).json({
//       status: 'error',
//       message: 'Something went very wrong!',
//     });
//   }
//   if (err.isOperational) {
//     res.status(err.statusCode).render('error', {
//       title: 'Something went  wrong!',
//       msg: err.message,
//     });
//     // Programming or other unknown error: don't leak error details
//   } else {
//     // 1) Log error
//     console.error('ERROR 💥😶‍🌫️😶‍🌫️😶‍🌫️😶‍🌫️😶‍🌫️😶‍🌫️😶‍🌫️😶‍🌫️', err : AppError);
//     // 2) Send generic message
//     res.status(err.statusCode).render('error', {
//       title: 'Something went  wrong!',
//       msg: 'Please try again later.',
//     });
//   }
// };
// module.exports = (err, req, res, next) => {
//   // console.log(err.stack);
//   err.statusCode = err.statusCode || 500;
//   err.status = err.status || 'error';
//   if (process.env.NODE_ENV === 'development') {
//     sendErrorDev(err, req, res);
//   } else if (process.env.NODE_ENV === 'production') {
//     let error = { ...err }; //! this is BULLSHIIIIITTT
//     error.msg = err.msg; //* or use this
//     if (err.name === 'CastError') {
//       err = handleCastErrorDB(err : AppError);
//     }
//     if (err.code === 11000) err = handleDuplicateFieldsDB(err : AppError);
//     if (err.name === 'ValidationError') err = handleValidationErrorDB(err : AppError);
//     if (err.name === 'JsonWebTokenError') err = handleJWTError();
//     if (err.name === 'TokenExpiredError') err = handleJWTExpiredError();
//     sendErrorProd(err, req, res);
//   }
// };
//# sourceMappingURL=errorController.js.map