"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyApplications = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const Application_1 = require("../../models/Application");
exports.getMyApplications = (0, catchAsync_1.default)(async (req, res, next) => {
    const Applications = await Application_1.Application.find({ worker: req.user.id });
    res.status(200).json({
        status: 'success',
        Applications,
    });
});
//# sourceMappingURL=getMyApplications.js.map