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
const PortfolioPost_1 = require("../models/PortfolioPost");
const UserDoc_1 = require("../models/UserDoc");
const Post_1 = require("../models/Post");
const Deal_1 = require("../models/Deal");
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
router.patch('/checkPortfolioPosts', async (req, res) => {
    try {
        // Find all workers
        const workers = await Worker_1.Worker.find();
        // Iterate through each worker
        for (const worker of workers) {
            // Iterate through the portfolioPosts array of the worker
            for (let i = 0; i < worker.portfolioPosts.length; i++) {
                const postId = worker.portfolioPosts[i];
                // Check if the post exists in the PortfolioPost collection
                const postExists = await PortfolioPost_1.PortfolioPost.exists({ _id: postId });
                // If the post doesn't exist, remove it from the portfolioPosts array
                if (!postExists) {
                    worker.portfolioPosts.splice(i, 1);
                    i--; // Decrement i to account for the removed element
                }
            }
            // Save the updated worker document
            await worker.save({ validateBeforeSave: false });
        }
        res
            .status(200)
            .json({ status: 'success', message: 'All porfolios checked .' });
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while pofrofjieourg.',
            error: error.message,
        });
    }
});
router.patch('/workersLocations', async (req, res) => {
    try {
        const centerLat = 35.2; // Your current latitude
        const centerLng = -0.64; // Your current longitude
        const diameters = [10, 20, 40, 50, 100]; // Diameters in kilometers
        // Fetch existing workers from the database
        const workers = await Worker_1.Worker.find({});
        // Iterate over each worker and update their location
        for (let i = 0; i < workers.length; i++) {
            const worker = workers[i];
            // Determine the radius for this worker based on their index
            const radius = (diameters[Math.floor(i / (workers.length / diameters.length))] / 2) * 1000; // Radius in meters
            // Generate random offsets
            const randomOffsetLat = (Math.random() - 0.5) * 2 * (radius / 111300); // Random offset within +/- radius in latitude
            const randomOffsetLng = (Math.random() - 0.5) * 2 * (radius / (111300 * Math.cos(centerLat * Math.PI / 180))); // Random offset within +/- radius in longitude
            const newLat = centerLat + randomOffsetLat;
            const newLng = centerLng + randomOffsetLng;
            // Update the worker's location
            worker.location.lat = newLat;
            worker.location.lng = newLng;
            worker.location.title = "title";
            // worker.location.title = `${worker.name}'s location`;
            // Save the updated worker to the database
            await worker.save({ validateBeforeSave: false });
        }
        console.log('Worker locations updated successfully!');
        res.status(200).json({
            status: 'success',
            message: 'All workers locations updated and checked.',
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while updating locations.',
            error: error.message,
        });
    }
});
router.patch('/postsLocations', async (req, res) => {
    try {
        const centerLat = 35.2; // Your current latitude
        const centerLng = -0.64; // Your current longitude
        const diameters = [10, 20, 40, 50, 100]; // Diameters in kilometers
        // Fetch existing workers from the database
        const workers = await Post_1.Post.find({});
        // Iterate over each worker and update their location
        for (let i = 0; i < workers.length; i++) {
            const worker = workers[i];
            // Determine the radius for this worker based on their index
            const radius = (diameters[Math.floor(i / (workers.length / diameters.length))] / 2) * 1000; // Radius in meters
            // Generate random offsets
            const randomOffsetLat = (Math.random() - 0.5) * 2 * (radius / 111300); // Random offset within +/- radius in latitude
            const randomOffsetLng = (Math.random() - 0.5) * 2 * (radius / (111300 * Math.cos(centerLat * Math.PI / 180))); // Random offset within +/- radius in longitude
            const newLat = centerLat + randomOffsetLat;
            const newLng = centerLng + randomOffsetLng;
            // Update the worker's location
            worker.location.lat = newLat;
            worker.location.lng = newLng;
            worker.location.title = "title";
            // worker.location.title = `${worker.name}'s location`;
            // Save the updated worker to the database
            await worker.save({ validateBeforeSave: false });
        }
        console.log('posts locations updated successfully!');
        res.status(200).json({
            status: 'success',
            message: 'All posts locations updated and checked.',
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while updating locations.',
            error: error.message,
        });
    }
});
router.patch('/postsLocations', async (req, res) => {
    try {
        const centerLat = 35.65; // Sidibelabbas latitude
        const centerLng = 4.9667; // Sidibelabbas longitude
        const radius = 5000 * 111300; // Radius of the circle in meters
        // Fetch existing workers from the database
        const posts = await Post_1.Post.find({});
        // Iterate over each worker and update their location
        for (const post of posts) {
            const randomOffsetLat = (Math.random() - 0.5) * 2 * (radius / 111300); // Random offset within +/- radius in latitude
            const randomOffsetLng = (Math.random() - 0.5) * 2 * (radius / (111300 * Math.cos(centerLat))); // Random offset within +/- radius in longitude
            const newLat = centerLat + randomOffsetLat;
            const newLng = centerLng + randomOffsetLng;
            // Update the worker's location
            post.location.lat = newLat;
            post.location.lng = newLng;
            // worker.location.title = `${worker.name}'s location`;
            // Save the updated worker to the database
            await post.save();
        }
        console.log('post locations updated successfully!');
        res.status(200).json({
            status: 'success',
            message: 'All post locations updated checked .',
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while location mod .',
            error: error.message,
        });
    }
});
router.patch('/passwordUpdater', async (req, res, next) => {
    try {
        const workers = await User_1.User.find();
        for (const worker of workers) {
            worker.authentication.password = '1234';
            worker.authentication.otp = undefined;
            worker.authentication.otpExpires = undefined;
            // worker.authentication.password = await bcrypt.hash(
            //   worker.authentication.password,
            //   12
            // );
            // worker.authentication.passwordConfirm = worker.authentication.password; // to delete ...
            await worker.save({ validateBeforeSave: false });
            // worker.passwordBcryptMiddleware(next);
        }
        res.status(200).json({
            status: 'success',
            message: 'All users passwords updated checked .',
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while passwords mod .',
            error: error.message,
        });
    }
});
router.patch('/verifyAcc', async (req, res, next) => {
    try {
        const users = await User_1.User.find();
        for (const user of users) {
            if (user.role == UserDoc_1.Role.Worker) {
                user.workerAccountVerified = true;
            }
            else {
                user.workerAccountVerified = false;
            }
        }
        res.status(200).json({
            status: 'success',
            message: 'All users passwords updated checked .',
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while passwords mod .',
            error: error.message,
        });
    }
});
router.patch('/postHiddenSetter', async (req, res, next) => {
    try {
        const posts = await Post_1.Post.find();
        for (const post of posts) {
            if (await Deal_1.Deal.findOne({
                post: post.id,
            })) {
                post.hidden = true;
                post.save();
            }
            else {
                post.hidden = false;
                post.save();
            }
        }
        res.status(200).json({
            status: 'success',
            message: 'All posts hidden checked .',
        });
    }
    catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while post hidden setter mod .',
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
    let i = 1;
    for (const user of users) {
        if (user.role === UserDoc_1.Role.User) {
            user.name = `worker${i}`; // Update the name field to the new name
            i++;
        }
        await user.save({ validateBeforeSave: false }); // Save the changes to the database
    }
    res.status(200).json({ message: 'Names updated successfully' });
});
router.patch('/updateUsersName', exports.updateUsersName);
exports.default = router;
//# sourceMappingURL=modRouter.js.map