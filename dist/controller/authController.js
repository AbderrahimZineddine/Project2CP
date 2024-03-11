"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = void 0;
const signup_1 = require("./authController/signup");
const login_1 = require("./authController/login");
const switchRole_1 = require("./authController/switchRole");
const signupAsWorker_1 = require("./authController/signupAsWorker");
const isLoggedIn_1 = require("./authController/isLoggedIn");
const protect_1 = require("./authController/protect");
const forgotPassword_1 = require("./authController/forgotPassword");
const resetPassword_1 = require("./authController/resetPassword");
const updatePassword_1 = require("./authController/updatePassword");
const verifyEmail_1 = require("./authController/verifyEmail");
const restrictTo_1 = require("./authController/restrictTo");
const logout_1 = require("./authController/logout");
const updateEmail_1 = require("./authController/updateEmail");
const resendEmailVerification_1 = __importDefault(require("./authController/resendEmailVerification"));
const verifyWorkerSignup_1 = __importDefault(require("./authController/verifyWorkerSignup"));
var Role;
(function (Role) {
    Role["User"] = "User";
    Role["Worker"] = "Worker";
})(Role || (exports.Role = Role = {}));
const authController = {
    signup: signup_1.signup,
    login: login_1.login,
    logout: logout_1.logout,
    switchRole: switchRole_1.switchRole,
    signupAsWorker: signupAsWorker_1.signupAsWorker,
    isLoggedIn: isLoggedIn_1.isLoggedIn,
    protect: protect_1.protect,
    forgotPassword: forgotPassword_1.forgotPassword,
    resetPassword: resetPassword_1.resetPassword,
    updatePassword: updatePassword_1.updatePassword,
    verifyEmail: verifyEmail_1.verifyEmail,
    restrictTo: restrictTo_1.restrictTo,
    updateEmail: updateEmail_1.updateEmail,
    sendVerificationEmail: resendEmailVerification_1.default,
    verifyAlreadySignedUp: verifyWorkerSignup_1.default,
};
exports.default = authController;
//# sourceMappingURL=authController.js.map