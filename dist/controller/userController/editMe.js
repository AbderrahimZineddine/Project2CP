"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editMe = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const appError_1 = __importDefault(require("../../utils/appError"));
const UserDoc_1 = require("../../models/UserDoc");
const uploadController_1 = __importDefault(require("../../controller/uploadController"));
// import { User } from 'models/User';
// import { Worker } from 'models/Worker';
// import { Model } from 'mongoose';
// import { WorkerDoc } from 'models/WorkerDoc';
const editMe = (role) => {
    return (0, catchAsync_1.default)(async (req, res, next) => {
        try {
            if (req.body.authentication &&
                (req.body.authentication.password ||
                    req.body.authentication.passwordConfirm)) {
                if (req.profilePicture) {
                    await uploadController_1.default.deleteFromCloudinary(req.profilePicture);
                }
                return next(new appError_1.default('This route is not for password updates. Please use /updateMyPassword', 400));
            }
            if (req.user.role === UserDoc_1.Role.Worker &&
                (req.body.firstName || req.body.lastName)) {
                if (req.profilePicture) {
                    await uploadController_1.default.deleteFromCloudinary(req.profilePicture);
                }
                return next(new appError_1.default('You cannot change your first name or last name', 400)); //TODO check 400 ?
            }
            const oldPfp = req.user.profilePicture;
            const updatedUser = await role.findByIdAndUpdate(req.user.id, {
                name: req.body.name,
                wilaya: req.body.wilaya,
                phoneNumber: req.body.phoneNumber,
                facebookAccount: req.body.facebookAccount,
                // 'contacts.instagram': req.body.contacts
                //   ? req.body.contacts.instagram
                //   : req.user.contacts.instagram,
                // 'contacts.facebook': req.body.contacts
                //   ? req.body.contacts.facebook
                //   : req.user.contacts.facebook,
                // 'contacts.whatsapp': req.body.contacts
                //   ? req.body.contacts.whatsapp
                //   : req.user.contacts.whatsapp,
                // 'contacts.linkedin': req.body.contacts
                //   ? req.body.contacts.linkedin
                //   : req.user.contacts.linkedin,
                profilePicture: req.profilePicture ?? req.user.profilePicture,
            }, { new: true, runValidators: true });
            if (updatedUser.profilePicture != oldPfp) {
                await uploadController_1.default.deleteFromCloudinary(oldPfp);
            }
            res.status(200).json({
                status: 'success',
                data: {
                    user: updatedUser,
                },
            });
        }
        catch (error) {
            try {
                if (req.profilePicture) {
                    await uploadController_1.default.deleteFromCloudinary(req.profilePicture);
                }
            }
            catch (error) {
                if (process.env.NODE_ENV !== 'production') {
                    return next(new appError_1.default(`Some uploaded images failed to delete during editing profile: ${error.message}`, 500));
                }
                else {
                    return next(new appError_1.default('Error while editing profile', 500));
                }
            }
            return next(new appError_1.default('Error while editing profile', 500));
        }
    });
};
exports.editMe = editMe;
//# sourceMappingURL=editMe.js.map