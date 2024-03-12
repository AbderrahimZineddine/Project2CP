"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appError_1 = __importDefault(require("../utils/appError"));
const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new appError_1.default(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    // console.log(value);
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new appError_1.default(message, 400);
};
const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new appError_1.default(message, 400);
};
const handleJWTError = () => new appError_1.default('Invalid token. Please log in again', 401);
const handleJWTExpiredError = () => new appError_1.default('Your token has expired. Please log in again', 401);
const sendErrorDev = (err, req, res) => {
    // api
    if (req.originalUrl.startsWith('/api')) {
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack,
        });
    }
    else {
        // Rendered website
        res.status(err.statusCode).render('error', {
            title: 'Something went  wrong!',
            msg: err.message,
        });
    }
};
const sendErrorProd = (err, req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        // Operational, trusted error: send message to client
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
            });
        }
        // Programming or other unknown error: don't leak error details
        // 1) Log error
        console.error('ERROR 💥😶‍🌫️😶‍🌫️😶‍🌫️😶‍🌫️😶‍🌫️😶‍🌫️😶‍🌫️😶‍🌫️', err);
        // 2) Send generic message
        return res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!',
        });
    }
    if (err.isOperational) {
        res.status(err.statusCode).render('error', {
            title: 'Something went  wrong!',
            msg: err.message,
        });
        // Programming or other unknown error: don't leak error details
    }
    else {
        // 1) Log error
        console.error('ERROR 💥😶‍🌫️😶‍🌫️😶‍🌫️😶‍🌫️😶‍🌫️😶‍🌫️😶‍🌫️😶‍🌫️', err);
        // 2) Send generic message
        res.status(err.statusCode).render('error', {
            title: 'Something went  wrong!',
            msg: 'Please try again later.',
        });
    }
};
const errorController = (err, req, res, next) => {
    // console.log(err.stack);
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);
    }
    else if (process.env.NODE_ENV === 'production') {
        let error = { ...err }; //! this is BULLSHIIIIITTT
        error.msg = err.msg; //* or use this
        if (err.name === 'CastError') {
            err = handleCastErrorDB(err);
        }
        if (err.code === 11000)
            err = handleDuplicateFieldsDB(err);
        if (err.name === 'ValidationError')
            err = handleValidationErrorDB(err);
        if (err.name === 'JsonWebTokenError')
            err = handleJWTError();
        if (err.name === 'TokenExpiredError')
            err = handleJWTExpiredError();
        sendErrorProd(err, req, res);
    }
};
exports.default = errorController;
//# sourceMappingURL=errorController.js.map