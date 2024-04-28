import { Router } from 'express';
import { User } from '../models/User';

const router = Router();

router.patch('/makeAllUsersVerified', async (req, res) => {
  try {
    // Update all users to set isVerified to true
    await User.updateMany({}, { 'authentication.isVerified': true });

    res.status(200).json({ status: 'success', message: 'All users are now verified.' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'An error occurred while updating users.', error: error.message });
  }
});

export default router;