"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = void 0;
const User_1 = require("../../models/User");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const appError_1 = __importDefault(require("../../utils/appError"));
const crypto_1 = __importDefault(require("crypto"));
const createAndSendToken_1 = require("./createAndSendToken");
exports.resetPassword = (0, catchAsync_1.default)(async (req, res, next) => {
    if (!req.body.otp) {
        return next(new appError_1.default('Empty otp details are not allowed', 400)); //400 ??
    }
    //1) get user based on password reset token :
    const hashedOTP = crypto_1.default
        .createHash('sha256')
        .update(req.body.otp)
        .digest('hex');
    //* be careful when querying nested ducuments
    const user = await User_1.User.findOne({
        email: req.body.email,
        'authentication.otp': hashedOTP,
        'authentication.otpExpires': { $gt: Date.now() },
    });
    //2)  If token has not expired, and there is user, set the new password
    if (!user) {
        return next(new appError_1.default('Token is invalid or has expired', 400));
    }
    user.authentication.password = req.body.password;
    user.authentication.passwordConfirm = req.body.passwordConfirm;
    user.authentication.otpExpires = undefined;
    user.authentication.otp = undefined;
    await user.save();
    //3) update change password at and hash the new password:
    //* done using middleware in user
    //4) Log the user in, send JWT
    (0, createAndSendToken_1.createAndSendToken)(user, 201, req, res);
});
//# sourceMappingURL=resetPassword.js.map