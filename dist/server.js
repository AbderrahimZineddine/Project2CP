"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const mongoose_1 = __importDefault(require("mongoose"));
const app_2 = require("firebase-admin/app");
const admin = __importStar(require("firebase-admin"));
//* This should be first :
process.on('unhandledException', (err) => {
    console.log('unhandled exception, shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});
dotenv_1.default.config({ path: './config.env' });
console.log('hello world!');
// Initialize Firebase Admin SDK
if (!(0, app_2.getApps)().length) {
    const serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);
    admin.initializeApp({
        credential: (0, app_2.cert)(serviceAccount),
        projectId: process.env.PROJECT_ID,
    });
}
const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI; // Replace with your connection URI and database name
        // const options = { useNewUrlParser: true, useUnifiedTopology: true }; //TODO check
        await mongoose_1.default.connect(uri);
        console.log('MongoDB connected...');
    }
    catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit the application if connection fails
        //! check again later
    }
};
const connectLocalDb = async () => {
    try {
        const uri = 'mongodb://127.0.0.1:27017'; // Replace with your connection URI and database name
        // const options = { useNewUrlParser: true, useUnifiedTopology: true }; //TODO check
        await mongoose_1.default.connect(uri);
        console.log('MongoDB connected...');
    }
    catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit the application if connection fails
        //! check again later
    }
};
// connectDB();
connectLocalDb();
const port = process.env.PORT || 3000;
const server = app_1.default.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
//* for safety
process.on('unhandledRejection', (err) => {
    console.log('unhandled rejection, shutting down...');
    console.log(err.name, err.message);
    console.log('error is : ' + err);
    server.close(() => {
        process.exit(1);
    });
});
// import dotenv from 'dotenv';
// import app from './app';
// import mongoose from 'mongoose';
// // import { initializeApp } from 'firebase-admin';
// import { applicationDefault, cert, getApps } from 'firebase-admin/app';
// import * as admin from 'firebase-admin'
// // admin.initializeApp()//* This should be first:
// process.on('unhandledException', (err) => {
//   console.log('Unhandled exception, shutting down...');
//   console.log(err.name, err.message);
//   process.exit(1);
// });
// dotenv.config({ path: './config.env' });
// console.log('Hello world!');
// // Initialize Firebase Admin SDK
// if (!getApps().length) {
//   const serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);
//   admin.initializeApp({
//     credential: cert(serviceAccount),
//     projectId: process.env.PROJECT_ID,
//   });
// }
// const connectDB = async () => {
//   try {
//     const uri = process.env.MONGO_URI; // Replace with your connection URI and database name
//     await mongoose.connect(uri);
//     console.log('MongoDB connected...');
//   } catch (error) {
//     console.error('Error connecting to MongoDB:', error);
//     process.exit(1); // Exit the application if connection fails
//   }
// };
// const connectLocalDb = async () => {
//   try {
//     const uri = 'mongodb://127.0.0.1:27017'; // Replace with your connection URI and database name
//     await mongoose.connect(uri);
//     console.log('MongoDB connected...');
//   } catch (error) {
//     console.error('Error connecting to MongoDB:', error);
//     process.exit(1); // Exit the application if connection fails
//   }
// };
// // connectDB();
// connectLocalDb();
// const port = process.env.PORT || 3000;
// const server = app.listen(port, () => {
//   console.log(`App running on port ${port}...`);
// });
// //* For safety
// process.on('unhandledRejection', (err: Error) => {
//   console.log('Unhandled rejection, shutting down...');
//   console.log(err.name, err.message);
//   console.log('Error is:', err);
//   server.close(() => {
//     process.exit(1);
//   });
// });
//# sourceMappingURL=server.js.map