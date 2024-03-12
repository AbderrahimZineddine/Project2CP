"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyCertificates = exports.checkOwnerCertificate = exports.addCertificate = exports.checkTitle = exports.deleteCertificateById = exports.getCertificateById = exports.updateCertificateTitle = exports.updateCertificateImage = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const Certificate_1 = require("../../models/Certificate");
const validationRequest_1 = require("../../models/validationRequest");
const appError_1 = __importDefault(require("../../utils/appError"));
const uploadController_1 = __importDefault(require("../../controller/uploadController"));
exports.updateCertificateImage = (0, catchAsync_1.default)(async (req, res, next) => {
    const id = req.params.id;
    if (!req.certificate) {
        throw new appError_1.default('Certificate image not found', 404); //404 ??
    }
    const cert = await Certificate_1.Certificate.findById(id);
    if (!cert) {
        throw new appError_1.default('No Certificate found with that id', 404);
    }
    // const oldCert = {...cert}; //! error
    const oldImage = cert.image;
    const oldIsValid = cert.isValid;
    (cert.image = req.certificate), (cert.isValid = false), await cert.save();
    try {
        await validationRequest_1.ValidationRequest.create({
            worker: req.user.id,
            certificate: cert.id,
            type: 'Certificate',
        });
        await uploadController_1.default.deleteFromCloudinary(oldImage);
    }
    catch (error) {
        cert.image = oldImage;
        uploadController_1.default.deleteFromCloudinary(req.certificate);
        cert.isValid = oldIsValid;
        cert.save({ validateBeforeSave: false });
        console.log(error);
        if (error instanceof appError_1.default) {
            return next(error);
        }
        return next(new appError_1.default('Error sending certificate validation request! Please try again' + error.message, 500)); //500?
    }
    res.status(200).json({
        status: 'success',
        message: 'Certificate sent to admin successfully',
        certificate: cert,
    });
});
exports.updateCertificateTitle = (0, catchAsync_1.default)(async (req, res, next) => {
    const id = req.params.id;
    if (!req.body.title) {
        return next(new appError_1.default('Certificate title not found', 404)); //404 ??
    }
    const cert = await Certificate_1.Certificate.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
    }, {
        new: true,
    });
    res.status(200).json({
        status: 'success',
        message: 'Certificate sent to admin successfully',
        certificate: cert,
    });
});
exports.getCertificateById = (0, catchAsync_1.default)(async (req, res, next) => {
    const certificate = await Certificate_1.Certificate.findById(req.params.id);
    res.status(200).json({
        status: 'success',
        certificate,
    });
});
exports.deleteCertificateById = (0, catchAsync_1.default)(async (req, res, next) => {
    console.log('deleteCertificate');
    // await Certificate.findByIdAndDelete(req.params.id);
    const certificate = await Certificate_1.Certificate.findById(req.params.id);
    if (!certificate) {
        return next(new appError_1.default('No certificate found with this id :' + req.params.id, 404));
    }
    try {
        await uploadController_1.default.deleteFromCloudinary(certificate.image);
    }
    catch (error) {
        return next(new appError_1.default('Error deleting certificate! Please try again later', 500));
    }
    req.user.certificates = req.user.certificates.filter((certificate) => certificate != req.params.id);
    await req.user.save({ validateBeforeSave: false });
    await validationRequest_1.ValidationRequest.findOneAndDelete({ certificate: req.params.id });
    await Certificate_1.Certificate.findByIdAndDelete(certificate.id);
    res.status(200).json({
        status: 'success',
    });
});
exports.checkTitle = (0, catchAsync_1.default)(async (req, res, next) => {
    if (!req.body.title) {
        return next(new appError_1.default('Please provide a certificate title !', 404));
    }
    next();
});
exports.addCertificate = (0, catchAsync_1.default)(async (req, res, next) => {
    if (!req.certificate || !req.body.title) {
        return next(new appError_1.default('Please provide a certificate image and title !', 404));
    }
    // console.log(req);
    let pushed = false;
    try {
        const certificate = await Certificate_1.Certificate.create({
            image: req.certificate,
            title: req.body.title,
        });
        req.user.certificates.push(certificate.id);
        req.user.save({ validateBeforeSave: false });
        pushed = true;
        await (0, validationRequest_1.ValidateCertificateCreate)(req.user.id, certificate.id);
        res.status(200).json({
            status: 'success',
            certificate,
        });
    }
    catch (error) {
        uploadController_1.default.deleteFromCloudinary(req.certificate);
        if (pushed) {
            req.user.certificates.pop();
            return next(new appError_1.default('Error while sending validation request! please try again later', 500));
        }
        return next(new appError_1.default('Error while creating certificate! please try again later', 500));
    }
});
exports.checkOwnerCertificate = (0, catchAsync_1.default)(async (req, res, next) => {
    if (!req.user.certificates.includes(req.params.id)) {
        return next(new appError_1.default('This certificate does not belong to this user', 404));
    }
    next();
});
exports.getMyCertificates = (0, catchAsync_1.default)(async (req, res, next) => {
    const certificates = [];
    for (const certId of req.user.certificates) {
        certificates.push(await Certificate_1.Certificate.findById(certId));
    }
    res.status(200).json({
        status: 'success',
        certificates,
    });
});
//# sourceMappingURL=certificatesController.js.map