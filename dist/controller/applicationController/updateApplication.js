"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateApplication = void 0;
const Application_1 = require("../../models/Application");
const appError_1 = __importDefault(require("../../utils/appError"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
exports.updateApplication = (0, catchAsync_1.default)(async (req, res, next) => {
    const application = await Application_1.Application.findByIdAndUpdate(req.params.id, {
        description: req.body.description,
        price: req.body.price,
    }, { new: true });
    if (!application) {
        return next(new appError_1.default('Error updating your application! Please try again later.', 500));
    }
    res.status(200).json({
        status: 'success',
        application,
    });
});
//# sourceMappingURL=updateApplication.js.map