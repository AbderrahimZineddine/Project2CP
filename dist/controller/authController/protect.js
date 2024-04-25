"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const User_1 = require("../../models/User");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const appError_1 = __importDefault(require("../../utils/appError"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Worker_1 = require("../../models/Worker");
const authController_1 = require("../authController");
exports.protect = (0, catchAsync_1.default)(async (req, res, next) => {
    //1) get Token or return an error :
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }
    if (!token) {
        return next(new appError_1.default('You are not logged in! Please login to get access', 401));
    }
    // 2) Verify Token
    //! from http://stackoverflow.com/questions
    const jwtVerifyPromisified = (token, secret) => {
        return new Promise((resolve, reject) => {
            jsonwebtoken_1.default.verify(token, secret, {}, (err, payload) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(payload);
                }
            });
        });
    };
    const decoded = await jwtVerifyPromisified(token, //* sorry
    process.env.JWT_SECRET);
    //3) Check if user still exists or password is still the same
    let currentUser;
    const currentRole = decoded.currentRole;
    if (currentRole == authController_1.Role.Worker) {
        //TODO :check
        currentUser = await Worker_1.Worker.findById(decoded.id);
        if (!currentUser || !currentUser.workerAccountVerified) {
            return next(new appError_1.default('your account is not verified yet!', 400));
        }
    }
    else {
        currentUser = await User_1.User.findById(decoded.id);
    }
    if (!currentUser) {
        return next(new appError_1.default('The user belonging to the token no longer exists', 400)); //TODO 400 ?
    }
    if (!currentUser.authentication.isVerified) {
        return next(new appError_1.default('You are not verified! Please verify your email account and login', 400)); //TODO 400 ?
    }
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new appError_1.default('User recently changed password! Please log in again', 401));
    }
    //we good : grant access to protected route :
    // (req as MyRequest).user = currentUser;
    req.user = currentUser;
    res.locals.user = currentUser; //TODO do you need need this
    // go to protected route
    next();
});
//# sourceMappingURL=protect.js.map