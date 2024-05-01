import { NextFunction, Response, Router } from 'express';
import { User } from '../models/User';
import catchAsync from '../utils/catchAsync';
import { MyRequest } from '../controller/userController';

const router = Router();

router.patch('/makeAllUsersVerified', async (req, res) => {
  try {
    // Update all users to set isVerified to true
    await User.updateMany({}, { 'authentication.isVerified': true });

    res
      .status(200)
      .json({ status: 'success', message: 'All users are now verified.' });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while updating users.',
      error: error.message,
    });
  }
});

export const updateUsersName = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    // Define the new name
    const newName = 'NewName this very nice'; // Replace 'NewName' with the desired new name

    // Fetch all users from the database
    const users = await User.find();

    // Check if there are users in the database
    if (users.length === 0) {
      res.status(404).json({ message: 'No users found' });
    }

    // Iterate through each user and update their name
    for (const user of users) {
      user.name = newName; // Update the name field to the new name
  
      await user.save({validateBeforeSave : false}); // Save the changes to the database
    }

    res.status(200).json({ message: 'Names updated successfully' });
  }
);

router.patch('/updateUsersName', updateUsersName);
export default router;
