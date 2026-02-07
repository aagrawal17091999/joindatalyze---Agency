import { Router } from 'express';
import { Contact } from '../config/database.js';
import { contactValidators, handleValidationErrors } from '../middleware/validate.js';
import { rateLimitStrict } from '../middleware/security.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

router.use(rateLimitStrict);
router.use(optionalAuth);

router.post(
  '/',
  contactValidators,
  handleValidationErrors,
  async (req, res) => {
    const { email, name, company, message } = req.body;
    const userId = req.user ? req.user.uid : null;

    try {
      await Contact.create({
        email,
        name: name || null,
        company: company || null,
        message: message || null,
        user_id: userId,
      });
      res.status(201).json({ ok: true, message: 'Thank you. We will get back to you soon.' });
    } catch (err) {
      if (err.name === 'SequelizeDatabaseError' || err.name === 'SequelizeConnectionError') {
        return res.status(503).json({
          error: 'Service temporarily unavailable. Please try again later.',
        });
      }
      throw err;
    }
  }
);

export default router;
