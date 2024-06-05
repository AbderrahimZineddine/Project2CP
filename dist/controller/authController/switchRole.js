"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.switchRole = void 0;
const User_1 = require("../../models/User");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const Worker_1 = require("../../models/Worker");
const createAndSendToken_1 = require("./createAndSendToken");
const authController_1 = require("../authController");
exports.switchRole = (0, catchAsync_1.default)(async (req, res, next) => {
    if (req.user.currentRole === authController_1.Role.Worker) {
        // switch from worker to user :
        req.user = await Worker_1.Worker.findByIdAndUpdate(req.user.id, { currentRole: authController_1.Role.User }, { overwriteDiscriminatorKey: true, new: true });
        return (0, createAndSendToken_1.createAndSendToken)(req.user, 200, req, res);
        // this should end here
    }
    if (req.user.workerAccountVerified) {
        // all good :
        // req.user.currentRole = Role.Worker;
        req.user = await User_1.User.findByIdAndUpdate(req.user.id, { currentRole: authController_1.Role.Worker }, { overwriteDiscriminatorKey: true, new: true });
        return (0, createAndSendToken_1.createAndSendToken)(req.user, 200, req, res);
    }
    // already signed in as worker :
    if (req.user.role === authController_1.Role.Worker) {
        // all good :
        // req.user.currentRole = Role.Worker;
        req.user = await User_1.User.findByIdAndUpdate(req.user.id, { currentRole: authController_1.Role.Worker }, { overwriteDiscriminatorKey: true, new: true });
        return (0, createAndSendToken_1.createAndSendToken)(req.user, 200, req, res);
        // return next(
        //   new AppError('Your Worker account has not been validated yet', 404)
        // ); //TODO check 404 ?
        res.status(403).json({
            status: 'success',
            message: 'Your Worker account has not been validated yet',
        }); // Forbidden response
    }
    // return next(new AppError('Please sign up as a worker first', 404)); //TODO check  ?
    else {
        res.status(404).json({
            status: 'success',
            message: 'Please sign up as a worker first',
        }); // Not found response
    }
});
//# sourceMappingURL=switchRole.js.map