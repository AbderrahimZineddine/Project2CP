"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = void 0;
const User_1 = require("../../models/User");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const email_1 = __importDefault(require("../../utils/email"));
const crypto_1 = __importDefault(require("crypto"));
const appError_1 = __importDefault(require("../../utils/appError"));
exports.signup = (0, catchAsync_1.default)(async (req, res, next) => {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    const hashedOTP = crypto_1.default.createHash('sha256').update(otp).digest('hex');
    const { name, email, password, wilaya, phoneNumber, passwordConfirm, } = req.body;
    const user = await User_1.User.create({
        name,
        email,
        newEmail: email,
        phoneNumber,
        wilaya,
        authentication: {
            password,
            passwordConfirm,
            otp: hashedOTP,
            otpExpires: new Date(Date.now() + 10 * 60 * 1000),
        },
    });
    // createAndSendToken(user, 201, req, res);
    // req.user.authentication.otp = hashedOTP;
    // req.user.authentication.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    // await req.user.save({ validateBeforeSave: false });
    try {
        console.log('user : ', user);
        console.log('otp : ', otp);
        await new email_1.default(user, otp).sendOTPEmail();
        res.status(200).json({
            status: 'PENDING',
            message: 'Verification email sent',
            email: user.newEmail,
        });
    }
    catch (error) {
        console.log('error : ', error);
        user.authentication.otp = undefined;
        user.authentication.otpExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new appError_1.default('There was an error sending the email. Try again later!' + error.message, 500));
    }
});
//# sourceMappingURL=signup.js.map