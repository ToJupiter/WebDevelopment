import { Request, Response } from 'express';
import { changeUserPassword, getUserProfile, updateUserProfile } from './users.services';

export async function getMeHandler(req: Request, res: Response) {
  try {
    const userId = req.user?.user_id;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const user = await getUserProfile(userId);
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}

export async function updateMeHandler(req: Request, res: Response) {
  try {
    const userId = req.user?.user_id;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const updated = await updateUserProfile(userId, {
      full_name: req.body.full_name,
      avatar_url: req.body.avatar_url,
    });
    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}

export async function changePasswordHandler(req: Request, res: Response) {
  try {
    const userId = req.user?.user_id;
    const { old_password, new_password } = req.body;

    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });
    if (!old_password || !new_password) {
      return res.status(400).json({ success: false, error: 'Both old and new passwords are required' });
    }

    const success = await changeUserPassword(userId, old_password, new_password);
    if (!success) {
      return res.status(400).json({ success: false, error: 'Incorrect old password' });
    }

    return res.status(200).json({ success: true, data: { message: 'Password updated successfully' } });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}