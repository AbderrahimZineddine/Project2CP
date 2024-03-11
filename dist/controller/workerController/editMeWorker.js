"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editMeWorker = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
exports.editMeWorker = (0, catchAsync_1.default)(async (req, res, next) => {
    // const certificates = (req.user as WorkerDoc).certificates;
    // if (req.certificates && req.certificates.length > 0) {
    //   for (const certificate of req.certificates) {
    //     const cert = await Certificate.create({
    //       title: certificate.title,
    //       image: certificate.image,
    //     });
    //     certificates.push(cert.id);
    //   }
    // }
    // if (req.body.firstName || req.body.lastName ) {
    //     return next(new AppError('You cannot change your first name or last name', 400)) //TODO check 400 ?
    // }
    if (req.body.job) {
        req.user.job = req.body.job;
        req.user.save({ validateModifiedOnly: true });
    }
    if (req.body.location) {
        req.user.location = req.body.location;
        req.user.save({ validateModifiedOnly: true });
    }
    next();
});
//# sourceMappingURL=editMeWorker.js.map