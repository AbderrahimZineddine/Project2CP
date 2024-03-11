"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppError extends Error {
    statusCode;
    status;
    isOperational;
    constructor(message, statusCode) {
        super(message); // Call parent constructor (Error only accepts message)
        this.statusCode = statusCode;
        this.status = statusCode.toString().startsWith('4') ? 'fail' : 'error';
        this.isOperational = true; // To use later
        Error.captureStackTrace(this, this.constructor); // Function call won't appear in stack trace
    }
}
exports.default = AppError;
//# sourceMappingURL=appError.js.map