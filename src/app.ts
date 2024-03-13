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
import authRouter from './routes/authRouter';
import morgan from 'morgan';
import errorController from './controller/errorController';
import ExpressFormidable from 'express-formidable';
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

app.use('/api/v1/users', userRouter);
app.use('/api/v1/workers', workerRouter);
app.use('/api/v1/auth', authRouter);

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
