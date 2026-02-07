import { body, validationResult } from 'express-validator';

export function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
}

export const contactValidators = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('name').trim().notEmpty().isLength({ max: 200 }).withMessage('Name required (max 200 chars)'),
  body('company').optional().trim().isLength({ max: 200 }),
  body('message').optional().trim().isLength({ max: 5000 }),
];
