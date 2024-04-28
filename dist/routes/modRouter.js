"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = require("../models/User");
const router = (0, express_1.Router)();
router.patch('/makeAllUsersVerified', async (req, res) => {
    try {
        // Update all users to set isVerified to true
        await User_1.User.updateMany({}, { 'authentication.isVerified': true });
        res.status(200).json({ status: 'success', message: 'All users are now verified.' });
    }
    catch (error) {
        res.status(500).json({ status: 'error', message: 'An error occurred while updating users.', error: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=modRouter.js.map