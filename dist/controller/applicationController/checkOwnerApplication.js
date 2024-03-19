"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkOwnerApplication = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const appError_1 = __importDefault(require("../../utils/appError"));
const Application_1 = require("../../models/Application");
exports.checkOwnerApplication = (0, catchAsync_1.default)(async (req, res, next) => {
    const application = await Application_1.Application.findById(req.params.id);
    if (!application) {
        return next(new appError_1.default('No Application found with that id!', 404));
    }
    if (application.worker != req.user.id) {
        return next(new appError_1.default('You do not have the permission to update this Application!', 404));
    }
    req.application = application;
    next();
});
//# sourceMappingURL=checkOwnerApplication.js.map