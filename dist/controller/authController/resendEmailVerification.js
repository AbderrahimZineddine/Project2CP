"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVerificationEmail = void 0;
const User_1 = require("../../models/User");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const crypto_1 = __importDefault(require("crypto"));
const appError_1 = __importDefault(require("../../utils/appError"));
const email_1 = __importDefault(require("../../utils/email"));
exports.sendVerificationEmail = (0, catchAsync_1.default)(async (req, res, next) => {
    if (!req.body.email) {
        return next(new appError_1.default('Enter an email to resend the code', 400)); //400 ??
    }
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    const hashedOTP = crypto_1.default.createHash('sha256').update(otp).digest('hex');
    const user = await User_1.User.findOne({ newEmail: req.body.email });
    if (!user) {
        return next(new appError_1.default('This is the wrong email address', 400)); //400 ??
    }
    user.authentication.otp = hashedOTP;
    user.authentication.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    user.save({ validateBeforeSave: false });
    try {
        await new email_1.default(user, otp).sendOTPEmail();
        res.status(200).json({
            status: 'success',
            message: 'Verification email sent',
            email: user.newEmail,
        });
    }
    catch (error) {
        console.log('error : ', error);
        user.authentication.otp = undefined;
        user.authentication.otpExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new appError_1.default('There was an error sending the email. Try again later!', 500));
    }
});
exports.default = exports.sendVerificationEmail;
//# sourceMappingURL=resendEmailVerification.js.map