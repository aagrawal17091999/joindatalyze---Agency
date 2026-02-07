import { Router } from 'express';
import { User } from '../config/database.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

/** GET /api/users/me - get or create user profile from Firebase token */
router.get('/me', async (req, res) => {
  const { uid, email, name } = req.user;

  try {
    let user = await User.findOne({ where: { firebase_uid: uid } });

    if (user) {
      return res.json({
        id: user.id,
        email: user.email,
        displayName: user.display_name,
        createdAt: user.created_at,
      });
    }

    user = await User.create({
      firebase_uid: uid,
      email: email || null,
      display_name: name || null,
    });
    res.status(201).json({
      id: user.id,
      email: user.email,
      displayName: user.display_name,
      createdAt: user.created_at,
    });
  } catch (err) {
    if (err.name === 'SequelizeDatabaseError' || err.name === 'SequelizeConnectionError') {
      return res.status(503).json({
        error: 'Service temporarily unavailable. Please try again later.',
      });
    }
    throw err;
  }
});

export default router;
