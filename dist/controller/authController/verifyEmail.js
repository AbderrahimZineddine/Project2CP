"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmail = void 0;
const User_1 = require("../../models/User");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const crypto_1 = __importDefault(require("crypto"));
const appError_1 = __importDefault(require("../../utils/appError"));
const createAndSendToken_1 = require("./createAndSendToken");
exports.verifyEmail = (0, catchAsync_1.default)(async (req, res, next) => {
    if (!req.body.otp) {
        return next(new appError_1.default('Empty otp details are not allowed', 400)); //400 ??
    }
    const hashedOTP = crypto_1.default
        .createHash('sha256')
        .update(req.body.otp)
        .digest('hex');
    const user = await User_1.User.findOne({
        newEmail: req.body.email,
        'authentication.otp': hashedOTP,
        'authentication.otpExpires': { $gt: Date.now() },
    });
    if (!user) {
        return next(new appError_1.default('Token is invalid or has expired', 400));
    }
    user.email = user.newEmail; //Setting the new email / or original one when signing up
    user.newEmail = undefined;
    user.authentication.otp = undefined;
    user.authentication.otpExpires = undefined;
    user.authentication.isVerified = true;
    await user.save({ validateBeforeSave: false });
    (0, createAndSendToken_1.createAndSendToken)(user, 201, req, res);
});
//# sourceMappingURL=verifyEmail.js.map