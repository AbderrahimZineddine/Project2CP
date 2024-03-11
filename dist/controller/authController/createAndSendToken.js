"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAndSendToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function createAndSendToken(user, statusCode, req, res) {
    // payload : { _id: user._id.toString() }  This is the data you want to include in the JWT //TODO add current Role;
    const token = jsonwebtoken_1.default.sign({ id: user.id.toString(), currentRole: user.currentRole }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
    const number = process.env.JWT_COOKIE_EXPIRES_IN;
    const cookieOptions = {
        expires: new Date(Date.now() + number * 24 * 60 * 60 * 1000), // 90days
        secure: req.secure || req.headers['x-forwarded-proto'] == 'https',
        httpOnly: true, //* cannot be accessed or modified through JavaScript on the client-side
    };
    res.cookie('jwt', token, cookieOptions);
    user.authentication.password = undefined;
    //  const { password, ...other} = user;
    res.status(statusCode).json({
        status: 'success',
        token,
        user,
    });
}
exports.createAndSendToken = createAndSendToken;
//# sourceMappingURL=createAndSendToken.js.map