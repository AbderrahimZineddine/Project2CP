"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupAsWorker = void 0;
const User_1 = require("../../models/User");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const authController_1 = require("../authController");
const validationRequest_1 = require("../../models/validationRequest");
const Certificate_1 = require("../../models/Certificate");
const appError_1 = __importDefault(require("../../utils/appError"));
const uploadController_1 = __importDefault(require("../../controller/uploadController"));
exports.signupAsWorker = (0, catchAsync_1.default)(async (req, res, next) => {
    const { job, location } = req.body;
    // if (!job || !location || !req.idPicture) {  //TODO require location !
    if (!job || !req.idPicture) {
        await cancelSingupAsWorker(req.user, req, next);
        return next(new appError_1.default('Please provide all required information for signing up as a worker', 400));
    }
    try {
        const certificates = [];
        if (req.certificates && req.certificates.length > 0) {
            for (const certificate of req.certificates) {
                //TODO send Worker Certificates!
                // sendCertificateToAdmin(req.user, certificate);
                const cert = await Certificate_1.Certificate.create({
                    title: certificate.title,
                    image: certificate.image,
                });
                certificates.push(cert.id);
            }
        }
        // await user.validate('idPicture');
        // await user.save({ validateBeforeSave: false });
        const user = await User_1.User.findByIdAndUpdate(req.user.id, {
            role: authController_1.Role.Worker,
            job,
            location,
            certificates,
            idPicture: req.idPicture,
        }, { new: true, overwriteDiscriminatorKey: true });
        console.log(user);
        //* Send To admin :
        // const val1 = await ValidateIdPictureCreate(user.id, req.idPicture);
        const val1 = await validationRequest_1.ValidationRequest.create({
            worker: user.id,
            idPicture: req.idPicture,
            type: 'idPicture',
        });
        console.log(val1);
        for (const cert of certificates) {
            // const v2 = await ValidateCertificateCreate(user.id, cert);
            const v2 = await validationRequest_1.ValidationRequest.create({
                worker: user.id,
                certificate: cert,
                type: 'Certificate',
            });
            console.log(v2);
        }
        req.user = user; //TODO ?? what to send ?
        res.status(200).json({
            status: 'success',
            message: 'Sign up as a worker successfully! Please wait for your id validation to login',
            worker: user,
        });
    }
    catch (error) {
        await cancelSingupAsWorker(req.user, req, next);
        console.log(error);
        return next(new appError_1.default('Error while sending validation request! please sing up again', 500)); //500??
    }
});
async function cancelSingupAsWorker(user, req, next) {
    user.role = authController_1.Role.User;
    user.job = undefined;
    user.location = undefined;
    let errorMessages = [];
    for (const cert of req.certificates) {
        try {
            await uploadController_1.default.deleteFromCloudinary(cert.image);
        }
        catch (error) {
            errorMessages.push(`Error deleting certificate image: ${error.message}`);
            // Log or handle the error as needed
        }
    }
    user.certificates = undefined;
    try {
        await uploadController_1.default.deleteFromCloudinary(req.idPicture);
        user.idPicture = undefined;
    }
    catch (error) {
        errorMessages.push(`Error deleting idPicture: ${error.message}`);
        // Log or handle the error as needed
    }
    // user.save({ validateBeforeSave: false }); //doesnt work!
    await User_1.User.replaceOne({ _id: user._id }, user, {
        overwriteDiscriminatorKey: true,
        runValidators: false,
    });
    if (process.env.NODE_ENV !== 'production' && errorMessages.length > 0) {
        return next(new appError_1.default(`Some uploaded images failed to delete during signup: ${errorMessages.join(', ')}`, 400));
    }
}
//# sourceMappingURL=signupAsWorker.js.map