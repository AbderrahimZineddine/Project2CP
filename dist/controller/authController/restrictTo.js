"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrictTo = void 0;
const appError_1 = __importDefault(require("../../utils/appError"));
const restrictTo = (...roles) => {
    //*?  answer : return a function cz express expects that, so we "call" (ex : restrictTo(['user'])) this function, which return a function (a) , then express uses (a) to do whatever it needs; other middlewares are used directly so we don't call them
    return (req, res, next) => {
        if (!roles.includes(req.user.currentRole)) {
            // console.log(req)
            return next(new appError_1.default('You do not have the permission to perform this action', 403));
        }
        // user may go to next route :
        next();
    };
};
exports.restrictTo = restrictTo;
//# sourceMappingURL=restrictTo.js.map