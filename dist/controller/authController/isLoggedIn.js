"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLoggedIn = void 0;
const User_1 = require("../../models/User");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const isLoggedIn = async (req, res, next) => {
    try {
        if (!req.cookies.jwt) {
            return next();
        }
        // 1) Verify Cookie : //function returns an error if not valid
        //! from http://stackoverflow.com/questions
        const jwtVerifyPromisified = (token, secret) => {
            return new Promise((resolve, reject) => {
                jsonwebtoken_1.default.verify(token, secret, {}, (err, payload) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(payload);
                    }
                });
            });
        };
        const decoded = await jwtVerifyPromisified(req.cookies.jwt, process.env.JWT_SECRET);
        //2) Check if user still exists or password is still the same
        const currentUser = await User_1.User.findById(decoded.id);
        if (!currentUser) {
            return next();
        }
        if (currentUser.changedPasswordAfter(decoded.iat)) {
            return next();
        }
        //we good
        req.user = currentUser;
        console.log('we good');
        res.locals.user = currentUser; //TODO check what is this
        next();
    }
    catch (error) {
        console.log(error);
        return next(); // return without setting the user
    }
};
exports.isLoggedIn = isLoggedIn;
//# sourceMappingURL=isLoggedIn.js.map