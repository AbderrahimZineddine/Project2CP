"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const User_1 = require("../../models/User");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const appError_1 = __importDefault(require("../../utils/appError"));
const createAndSendToken_1 = require("./createAndSendToken");
exports.login = (0, catchAsync_1.default)(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new appError_1.default('Please enter a valid email and password.', 404));
    }
    const user = await User_1.User.findOne({ email }).select('+authentication.password');
    console.log(user);
    if (!user ||
        !(await user.correctPassword(password, user.authentication.password))) {
        return next(new appError_1.default('Incorrect Email or Password.', 404));
    }
    if (!user.authentication.isVerified) {
        return next(new appError_1.default('You are not verified! Please verify your email account and login', 400)); //TODO 400 ?
    }
    // everything good
    (0, createAndSendToken_1.createAndSendToken)(user, 200, req, res); //TODO: code correct?
});
//# sourceMappingURL=login.js.map