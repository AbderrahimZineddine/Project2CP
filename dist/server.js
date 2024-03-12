"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const mongoose_1 = __importDefault(require("mongoose"));
//* This should be first :
process.on('unhandledException', (err) => {
    console.log('unhandled exception, shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});
dotenv_1.default.config({ path: './config.env' });
console.log('hello world!');
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
//# sourceMappingURL=server.js.map