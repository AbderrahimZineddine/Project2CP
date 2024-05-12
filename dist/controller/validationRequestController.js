"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validationRequest_1 = require("../models/validationRequest");
const handlerFactory_1 = require("./handlerFactory");
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const appError_1 = __importDefault(require("../utils/appError"));
const Certificate_1 = require("../models/Certificate");
const Worker_1 = require("../models/Worker");
const uploadController_1 = __importDefault(require("./uploadController"));
const UserDoc_1 = require("../models/UserDoc");
const approveValidationRequest = (0, catchAsync_1.default)(async (req, res, next) => {
    const valReq = await validationRequest_1.ValidationRequest.findById(req.params.id);
    if (!valReq) {
        return next(new appError_1.default('There is no validation request with id ' + req.params.id, 404));
    }
    if (valReq.type === validationRequest_1.ValidationType.Certificate) {
        //   const cert = await Certificate.findById(valReq.certificate);
        //   if (!cert) {
        //     return next(
        //       new AppError(
        //         'There is no Certificate with id ' + valReq.certificate,
        //         404
        //       )
        //     );
        //   }
        console.log('in');
        const cert = valReq.certificate;
        cert.isValid = true;
        cert._acceptedAt = new Date(Date.now());
        await cert.save({ validateBeforeSave: false });
        // await ValidationRequest.findByIdAndDelete(req.params.id);
        await validationRequest_1.ValidationRequest.findByIdAndUpdate(req.params.id, { _deletedAt: Date.now() }, { new: true });
        res.status(200).json({ status: 'success', certificate: cert });
    }
    else {
        const worker = valReq.worker;
        worker.workerAccountVerified = true;
        await worker.save({ validateBeforeSave: false });
        await worker.checkCertifiedStatus();
        // await ValidationRequest.findByIdAndDelete(req.params.id);
        await validationRequest_1.ValidationRequest.findByIdAndUpdate(req.params.id, { _deletedAt: Date.now() }, { new: true });
        res.status(200).json({ status: 'success', worker });
    }
});
const disapproveValidationRequest = (0, catchAsync_1.default)(async (req, res, next) => {
    const valReq = await validationRequest_1.ValidationRequest.findById(req.params.id);
    if (!valReq) {
        return next(new appError_1.default('There is no validation request with id ' + req.params.id, 404));
    }
    if (valReq.type === validationRequest_1.ValidationType.Certificate) {
        // await Certificate.findByIdAndDelete(valReq.certificate.id);
        await Certificate_1.Certificate.findByIdAndUpdate(valReq.certificate.id, { _deletedAt: new Date(Date.now()) }, { new: true });
        await valReq.worker.checkCertifiedStatus();
        // await ValidationRequest.findByIdAndDelete(req.params.id);
        await validationRequest_1.ValidationRequest.findByIdAndUpdate(req.params.id, { _deletedAt: Date.now() }, { new: true });
        res.status(200).json({ status: 'success' });
    }
    else {
        const worker = valReq.worker;
        worker.workerAccountVerified = undefined;
        worker.job = undefined;
        worker.isCertified = undefined;
        worker.experience = undefined;
        worker.rating = undefined;
        worker.location = undefined;
        worker.ratingsNumber = undefined;
        worker.portfolioPosts = undefined;
        worker.savedPosts = undefined;
        if (worker.idPicture) {
            await uploadController_1.default.deleteFromCloudinary(worker.idPicture);
            worker.idPicture = undefined;
        }
        if (worker.certificates) {
            for (const certificate of worker.certificates) {
                const cert = await Certificate_1.Certificate.findById(certificate);
                await uploadController_1.default.deleteFromCloudinary(cert.image);
                await Certificate_1.Certificate.findByIdAndDelete(certificate);
            }
            worker.certificates = undefined;
        }
        await worker.save({ validateBeforeSave: false }); //TODO check if it is necessary
        await Worker_1.Worker.findByIdAndUpdate(worker.id, {
            role: UserDoc_1.Role.User,
            currentRole: UserDoc_1.Role.User,
        }, {
            new: true,
            overwriteDiscriminatorKey: true,
            runValidators: false,
        });
        // await ValidationRequest.findByIdAndDelete(req.params.id);
        await validationRequest_1.ValidationRequest.findByIdAndUpdate(req.params.id, { _deletedAt: Date.now() }, { new: true });
        res.status(200).json({ status: 'success' });
    }
});
const validationRequestController = {
    approveValidationRequest: approveValidationRequest,
    disapproveValidationRequest: disapproveValidationRequest,
    getValidationRequestById: (0, handlerFactory_1.getOne)(validationRequest_1.ValidationRequest),
    getAllValidationRequests: (0, handlerFactory_1.getAll)(validationRequest_1.ValidationRequest),
};
exports.default = validationRequestController;
//# sourceMappingURL=validationRequestController.js.map