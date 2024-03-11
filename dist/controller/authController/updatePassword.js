"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePassword = void 0;
const User_1 = require("../../models/User");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const appError_1 = __importDefault(require("../../utils/appError"));
const createAndSendToken_1 = require("./createAndSendToken");
exports.updatePassword = (0, catchAsync_1.default)(async (req, res, next) => {
    // 1) get user from collection
    //* can't user findByIdAndUpdate cz we can't access to this.password in the validator and middlewares
    // in genereal don't use it while working with password
    const user = await User_1.User.findById(req.user.id).select('+authentication.password');
    //2) check if POSTed password is correct
    if (!user ||
        !(await user.correctPassword(req.body.currentPassword, user.authentication.password))) {
        return next(new appError_1.default('Your currecnt password is Wrong!', 401));
    }
    //3) if correct, change password
    user.authentication.password = req.body.password;
    user.authentication.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    // 4) Log user in, send JWT
    (0, createAndSendToken_1.createAndSendToken)(user, 201, req, res);
});
//# sourceMappingURL=updatePassword.js.map