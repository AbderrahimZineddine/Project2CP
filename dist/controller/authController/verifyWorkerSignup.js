"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserDoc_1 = require("../../models/UserDoc");
const appError_1 = __importDefault(require("../../utils/appError"));
const verifyAlreadySignedUp = (req, res, next) => {
    if (req.user.role === UserDoc_1.Role.Worker) {
        return next(new appError_1.default('This user has already signed up as a worker!', 400));
    }
    next();
};
exports.default = verifyAlreadySignedUp;
//# sourceMappingURL=verifyWorkerSignup.js.map