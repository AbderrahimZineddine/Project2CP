"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getAllUsers_1 = require("./userController/getAllUsers");
const editMeUser_1 = require("./userController/editMeUser");
const getMe_1 = require("./userController/getMe");
const ToggleFavoriteWorker_1 = require("./userController/ToggleFavoriteWorker");
const userController = {
    getUser: getAllUsers_1.getUser,
    getAllUsers: getAllUsers_1.getAllUsers,
    deleteUser: getAllUsers_1.deleteUser,
    updateUser: getAllUsers_1.updateUser,
    createUser: getAllUsers_1.createUser,
    getMe: getMe_1.getMe,
    editMe: editMeUser_1.editMe,
    ToggleFavoriteWorker: ToggleFavoriteWorker_1.ToggleFavoriteWorker,
    getFavoriteWorkers: ToggleFavoriteWorker_1.getFavoriteWorkers,
};
exports.default = userController;
//# sourceMappingURL=userController.js.map