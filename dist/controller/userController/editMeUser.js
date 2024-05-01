"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editMe = void 0;
const appError_1 = __importDefault(require("../../utils/appError"));
const UserDoc_1 = require("../../models/UserDoc");
const uploadController_1 = __importDefault(require("../../controller/uploadController"));
const editMe = (role) => {
    return async (req, res, next) => {
        let oldDeleted = false;
        try {
            if (req.body.authentication &&
                (req.body.authentication.password ||
                    req.body.authentication.passwordConfirm)) {
                throw new appError_1.default('This route is not for password updates. Please use /updateMyPassword', 400);
            }
            if (req.user.role === UserDoc_1.Role.Worker &&
                (req.body.name)) {
                throw new appError_1.default('You cannot change your name because it is linked to your id card!', 400);
            }
            const oldPfp = req.user.profilePicture;
            const updatedUser = await role.findByIdAndUpdate(req.user.id, {
                name: req.body.name,
                wilaya: req.body.wilaya,
                phoneNumber: req.body.phoneNumber,
                facebookAccount: req.body.facebookAccount,
                bio: req.body.bio,
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
                profilePicture: req.profilePicture ?? oldPfp,
            }, { new: true, runValidators: true });
            if (updatedUser && updatedUser.profilePicture != oldPfp) {
                try {
                    oldDeleted = true;
                    await uploadController_1.default.deleteFromCloudinary(oldPfp);
                }
                catch (error) {
                    if (process.env.NODE_ENV !== 'production') {
                        throw new appError_1.default('Error while deleting old profile picture from editing user: ' +
                            error.message, 500);
                    }
                }
            }
            res.status(200).json({
                status: 'success',
                user: updatedUser,
            });
        }
        catch (error) {
            // oldDeleted = false => the user was updated successfully so you shoudn't delete req.pfp (which is now user.pfp)
            // if error occured while deleting old profile picture it is already handled
            if (!oldDeleted && req.profilePicture) {
                try {
                    await uploadController_1.default.deleteFromCloudinary(req.profilePicture);
                }
                catch (error) {
                    if (process.env.NODE_ENV !== 'production') {
                        throw new appError_1.default('Error while deleting old profile picture from editing user: ' +
                            error.message, 500);
                    }
                }
            }
            if (error instanceof appError_1.default) {
                return next(error);
            }
            else {
                return next(new appError_1.default('Error while editing profile', 500));
            }
        }
    };
};
exports.editMe = editMe;
//# sourceMappingURL=editMeUser.js.map