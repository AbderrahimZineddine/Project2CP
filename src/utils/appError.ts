class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  constructor(message: string, statusCode: number) {
    super(message); // Call parent constructor (Error only accepts message)
    this.statusCode = statusCode;
    this.status = statusCode.toString().startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // To use later
    Error.captureStackTrace(this, this.constructor); // Function call won't appear in stack trace
  }
}

export default AppError;
