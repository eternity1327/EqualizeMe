/**
 * utils/auth.js
 *
 * Password hashing helpers and a middleware to protect routes that
 * require a logged-in user.
 */

const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

function hashPassword(plainPassword) {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

function verifyPassword(plainPassword, hash) {
  return bcrypt.compare(plainPassword, hash);
}

// Attach to any route that should only work for a logged-in user.
// Reads req.session.userId, which /api/auth/login sets on success.
function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  next();
}

module.exports = { hashPassword, verifyPassword, requireAuth };
