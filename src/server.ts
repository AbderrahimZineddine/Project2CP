import dotenv from 'dotenv';
import app from './app';
import mongoose from 'mongoose';

//* This should be first :
process.on('unhandledException', (err) => {
  console.log('unhandled exception, shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

console.log('hello world!');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI; // Replace with your connection URI and database name
    // const options = { useNewUrlParser: true, useUnifiedTopology: true }; //TODO check
    await mongoose.connect(uri);
    console.log('MongoDB connected...');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit the application if connection fails
    //! check again later
  }
};

const connectLocalDb = async () => {
  try {
    const uri ='mongodb://127.0.0.1:27017'
    ; // Replace with your connection URI and database name
    // const options = { useNewUrlParser: true, useUnifiedTopology: true }; //TODO check
    await mongoose.connect(uri);
    console.log('MongoDB connected...');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit the application if connection fails
    //! check again later
  }
};


// connectDB();
connectLocalDb();

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

//* for safety
process.on('unhandledRejection', (err: Error) => {
  console.log('unhandled rejection, shutting down...');
  console.log(err.name, err.message);
  console.log('error is : ' + err)
  server.close(() => {
    process.exit(1);
  });
});
