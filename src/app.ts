import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import helmet from 'helmet';
import path from 'path';

import AppError from './utils/appError';
import userRouter from './routes/userRouter';
import workerRouter from './routes/workerRouter';
import portfolioRouter from './routes/portfolioRouter';
import certificateRouter from './routes/certificateRouter';
import authRouter from './routes/authRouter';
import postRouter from './routes/postRouter';
import applicationRouter from './routes/applicationRouter';
import dealRouter from './routes/dealRouter';
import reviewRouter from './routes/reviewRouter';

import morgan from 'morgan';
import errorController from './controller/errorController';
import multer from 'multer';
const app = express();

app.use(compression());
app.use(cookieParser());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
// app.use(ExpressFormidable());
// app.use(multer().any());
// app.use(express.urlencoded({extended:true})); //TODO i donno

app.use(cors());
app.options('*', cors());
app.use(morgan('dev'));
// app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/src/public')));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/deals', dealRouter);
app.use('/api/v1/applications', applicationRouter);
app.use('/api/v1/users/posts', postRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/workers/certificates', certificateRouter);
app.use('/api/v1/workers/portfolioPosts', portfolioRouter);
app.use('/api/v1/workers', workerRouter);

app.all('*', (req, res, next) => {
  // express knows that it's an error ( anything is assumed to be an error )
  // const err = new Error(`Can't find ${req.originalUrl} on this server`);
  // err.status = 'fail';
  // err.statusCode = 404;

  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});
app.use(errorController);
// app.use(function (err: any, req: any, res: any, next: any) {
//   console.log('This is the invalid field ->', err.field)
//   next(err)
// })

export default app;
