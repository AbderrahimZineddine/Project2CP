"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUsersName = void 0;
const express_1 = require("express");
const User_1 = require("../models/User");
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const Worker_1 = require("../models/Worker");
const router = (0, express_1.Router)();
router.patch('/makeAllUsersVerified', async (req, res) => {
    try {
        // Update all users to set isVerified to true
        await User_1.User.updateMany({}, { 'authentication.isVerified': true });
        res
            .status(200)
            .json({ status: 'success', message: 'All users are now verified.' });
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while updating users.',
            error: error.message,
        });
    }
});
router.patch('/checkCertifiedForAllWorkers', async (req, res) => {
    try {
        // Update all users to set isVerified to true
        const workers = await Worker_1.Worker.find();
        for (const worker of workers) {
            await worker.checkCertifiedStatus();
        }
        res
            .status(200)
            .json({ status: 'success', message: 'All certified checked.' });
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while updating .',
            error: error.message,
        });
    }
});
exports.updateUsersName = (0, catchAsync_1.default)(async (req, res, next) => {
    // Define the new name
    const newName = 'NewName this very nice'; // Replace 'NewName' with the desired new name
    // Fetch all users from the database
    const users = await User_1.User.find();
    // Check if there are users in the database
    if (users.length === 0) {
        res.status(404).json({ message: 'No users found' });
    }
    // Iterate through each user and update their name
    for (const user of users) {
        user.name = newName; // Update the name field to the new name
        await user.save({ validateBeforeSave: false }); // Save the changes to the database
    }
    res.status(200).json({ message: 'Names updated successfully' });
});
router.patch('/updateUsersName', exports.updateUsersName);
exports.default = router;
//# sourceMappingURL=modRouter.js.map