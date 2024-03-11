"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEmail = void 0;
const User_1 = require("../../models/User");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const appError_1 = __importDefault(require("../../utils/appError"));
const email_1 = __importDefault(require("../../utils/email"));
// email is for sure here :
// 1 : send otp
// check otp route , if successful : update email and login
// if not : back to old email !
exports.updateEmail = (0, catchAsync_1.default)(async (req, res, next) => {
    if (!req.body.email) {
        return next(new appError_1.default('Enter your new email', 400)); //400 ??
    }
    const user = await User_1.User.findOne({ email: req.body.email });
    if (user) {
        next(new appError_1.default('Email already exists', 400));
    }
    // req.user.email = req.body.email;
    const oldEmail = req.user.email;
    req.user.newEmail = req.body.email;
    const otp = req.user.createOTP();
    await req.user.save({ validateModifiedOnly: true }); //TODO check this feature again
    try {
        req.user.email = req.body.email;
        await new email_1.default(req.user, otp).sendOTPEmail();
    }
    catch (error) {
        req.user.email = oldEmail; //* so not to save req.user with the new email
        req.user.newEmail = undefined;
        req.user.authentication.otp = undefined;
        req.user.authentication.otpExpires = undefined;
        await req.user.save({ validateBeforeSave: false });
        return next(new appError_1.default('There was an error sending the email. Try again later!', 500));
    }
    res.status(200).json({
        status: 'PENDING',
        message: 'Verification email sent',
        email: req.body.email,
    });
});
//# sourceMappingURL=updateEmail.js.map